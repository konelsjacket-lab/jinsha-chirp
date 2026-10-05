"""按 tools/art_manifest.json 把 assets/raw 里的原图批量处理成 assets/img 里的游戏图。

  python3 tools/process_art.py            # 处理清单里所有的图
  python3 tools/process_art.py tile_05    # 只处理名字里带 tile_05 的
  python3 tools/process_art.py --preview  # 额外在 assets/raw/_preview/ 生成放大 4 倍的预览

依赖：pip install pillow numpy
"""
import json
import os
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from pixelate import block_median, quantize, make_transparent, clean_edges  # noqa: E402

ROOT = os.path.join(os.path.dirname(__file__), '..')
RAW = os.path.join(ROOT, 'assets', 'raw')
OUT = os.path.join(ROOT, 'assets', 'img')


def frame_ranges(mask, n):
    """按竖直方向上的空白列，把横排的 n 帧切开（比三等分可靠：扇翅膀的帧会伸进隔壁那一格）。"""
    cols = mask.any(0)
    gaps, x = [], 0
    W = len(cols)
    while x < W:
        if not cols[x]:
            s0 = x
            while x < W and not cols[x]:
                x += 1
            if s0 > 0 and x < W:
                gaps.append((x - s0, s0, x))
        else:
            x += 1
    cuts = sorted(g[1] + (g[2] - g[1]) // 2 for g in sorted(gaps, reverse=True)[:n - 1])
    edges = [0] + cuts + [W]
    return [(edges[i], edges[i + 1]) for i in range(n)]


def content_boxes(img, n, thresh=60):
    """把一张横排 n 帧的图切成 n 段，返回每段的列范围和非白色内容的包围盒（原图坐标）。"""
    a = np.asarray(img.convert('RGB')).astype(int)
    mask = (765 - a.sum(2)) > thresh
    out = []
    for x0, x1 in frame_ranges(mask, n):
        ys, xs = np.nonzero(mask[:, x0:x1])
        out.append(((x0, x1), (x0 + xs.min(), ys.min(), x0 + xs.max() + 1, ys.max() + 1)))
    return out


def make_sheet(it):
    """多张“横排 n 帧”的图 → 一张精灵图（每张一行）。所有帧用同一个缩放比例，脚底对齐。"""
    n, size = it['frames'], int(it['size'])
    imgs = [Image.open(os.path.join(RAW, s)).convert('RGBA') for s in it['sheet']]
    found = [content_boxes(im, n) for im in imgs]
    side = max(max(b[2] - b[0], b[3] - b[1]) for fs in found for _, b in fs) * it.get('pad', 1.1)
    sheet = Image.new('RGBA', (size * n, size * len(imgs)), (0, 0, 0, 0))
    for r, (im, fs) in enumerate(zip(imgs, found)):
        ground = max(fs[0][1][3], fs[-1][1][3])  # 第 1、3 帧是站着的，用它们的脚底当地面
        for c, ((x0, x1), b) in enumerate(fs):
            # 只保留这一帧自己那一段，免得把隔壁帧的翅膀也裁进来
            col = Image.new('RGBA', im.size, (255, 255, 255, 255))
            col.paste(im.crop((x0, 0, x1, im.height)), (x0, 0))
            cx = (b[0] + b[2]) / 2
            box = (int(cx - side / 2), int(ground - side * 0.97), int(cx + side / 2), int(ground + side * 0.03))
            frame = Image.new('RGBA', (box[2] - box[0], box[3] - box[1]), (255, 255, 255, 255))
            part = col.crop(box)
            frame.paste(part, (0, 0), part)
            px = make_transparent(quantize(block_median(frame, size, size), it['colors']))
            sheet.paste(px, (c * size, r * size))
    return sheet


def fit_single(img, it):
    """单个角色：裁到内容包围盒（正方形、脚底贴底），再缩小、去白底。"""
    ((_, b),) = content_boxes(img, 1)
    side = max(b[2] - b[0], b[3] - b[1]) * it.get('pad', 1.1)
    cx = (b[0] + b[2]) / 2
    box = (int(cx - side / 2), int(b[3] - side * 0.97), int(cx + side / 2), int(b[3] + side * 0.03))
    frame = Image.new('RGBA', (box[2] - box[0], box[3] - box[1]), (255, 255, 255, 255))
    part = img.crop(box)
    frame.paste(part, (0, 0), part)  # 用 alpha 当蒙版：裁到原图外面的部分保持白色，不会变成黑边
    return frame


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    preview = '--preview' in sys.argv
    manifest = json.load(open(os.path.join(os.path.dirname(__file__), 'art_manifest.json'), encoding='utf-8'))
    defaults = manifest.get('defaults', {})
    done = 0
    for item in manifest['items']:
        it = {**defaults, **item}
        if 'src' in it and args and not any(a in it['src'] for a in args):
            continue
        if 'sheet' in it:
            if args and not any(a in s for s in it['sheet'] + [it['dst']] for a in args):
                continue
            missing = [s for s in it['sheet'] if not os.path.exists(os.path.join(RAW, s))]
            if missing:
                print(f'  跳过 {it["dst"]}（缺原图：{", ".join(missing)}）')
                continue
            out = make_sheet(it)
            out.save(os.path.join(OUT, it['dst']))
            if preview:
                os.makedirs(os.path.join(RAW, '_preview'), exist_ok=True)
                out.resize((out.width * 4, out.height * 4), Image.NEAREST).save(os.path.join(RAW, '_preview', it['dst']))
            print(f'  {" + ".join(it["sheet"])} -> assets/img/{it["dst"]}  ({out.width}x{out.height})')
            done += 1
            continue
        src = os.path.join(RAW, it['src'])
        dst = os.path.join(OUT, it.get('dst', os.path.splitext(it['src'])[0] + '.png'))
        if not os.path.exists(src):
            print(f'  跳过（没有原图）：{it["src"]}')
            continue
        img = Image.open(src).convert('RGBA')
        if it.get('fit'):
            img = fit_single(img, it)
        if it.get('crop'):
            img = img.crop(tuple(int(v) for v in it['crop'].split(',')))
        size = str(it['size'])
        w, h = (int(v) for v in (size.split('x') if 'x' in size else (size, size)))
        out = quantize(block_median(img, w, h), it['colors'])
        if it.get('transparent'):
            out = make_transparent(out)
        if it.get('holes'):
            # 被身体围住的白底（比如腿之间）也清掉。只给身上没有白色的角色用
            arr = np.asarray(out).copy()
            arr[arr[..., :3].min(2) > 246, 3] = 0
            out = Image.fromarray(arr, 'RGBA')
        if it.get('clean_edges'):
            out = clean_edges(out)
        out.save(dst)
        if preview:
            os.makedirs(os.path.join(RAW, '_preview'), exist_ok=True)
            out.resize((w * 4, h * 4), Image.NEAREST).save(os.path.join(RAW, '_preview', os.path.basename(dst)))
        print(f'  {it["src"]} -> {os.path.relpath(dst, ROOT)}  ({w}x{h}, {it["colors"]} 色)')
        done += 1
    print(f'处理了 {done} 张。')


if __name__ == '__main__':
    main()
