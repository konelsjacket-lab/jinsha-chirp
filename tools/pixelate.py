"""把 GPT 画的“伪像素图”整理成真正的像素图。

GPT 出的像素图通常是 1024~1536px 的大图，像素格子大小不统一、边缘有抗锯齿。
这个脚本会：
  1. （可选）裁剪出需要的区域
  2. 按目标尺寸分块，每块取“中位色”——比直接缩放更能保住清晰的像素边缘
  3. 把颜色压到指定数量（不抖动，MAXCOVERAGE 能保住嘴里那点红这种小面积颜色），去掉抗锯齿杂色
  4. （可选）把指定背景色变成透明

用法：
  python3 tools/pixelate.py 输入图 输出.png --size 96 [--colors 48] [--crop x0,y0,x1,y1] [--transparent]
依赖：pip install pillow numpy
"""
import argparse
import numpy as np
from PIL import Image


def block_median(img, w, h):
    a = np.asarray(img.convert('RGBA')).astype(np.float32)
    H, W = a.shape[:2]
    out = np.zeros((h, w, 4), np.uint8)
    ys = np.linspace(0, H, h + 1)
    xs = np.linspace(0, W, w + 1)
    for j in range(h):
        y0, y1 = int(round(ys[j])), int(round(ys[j + 1]))
        # 只取每块中间 60% 的区域，避开格子边缘的抗锯齿
        my = max(1, int((y1 - y0) * 0.2))
        for i in range(w):
            x0, x1 = int(round(xs[i])), int(round(xs[i + 1]))
            mx = max(1, int((x1 - x0) * 0.2))
            blk = a[y0 + my:y1 - my, x0 + mx:x1 - mx].reshape(-1, 4)
            out[j, i] = np.median(blk, axis=0)
    return Image.fromarray(out, 'RGBA')


def quantize(img, colors):
    rgb = img.convert('RGB').quantize(colors=colors, method=Image.Quantize.MAXCOVERAGE, dither=Image.Dither.NONE)
    out = rgb.convert('RGBA')
    out.putalpha(img.getchannel('A'))
    return out


def make_transparent(img, tol=40):
    """把四个角的颜色（背景）变成透明，只清除和边缘连通的部分。"""
    a = np.asarray(img).copy()
    h, w = a.shape[:2]
    seen = np.zeros((h, w), bool)
    stack = [(0, 0), (0, w - 1), (h - 1, 0), (h - 1, w - 1)]
    bg = a[0, 0, :3].astype(int)
    while stack:
        y, x = stack.pop()
        if y < 0 or x < 0 or y >= h or x >= w or seen[y, x]:
            continue
        if np.abs(a[y, x, :3].astype(int) - bg).sum() > tol:
            continue
        seen[y, x] = True
        a[y, x, 3] = 0
        stack += [(y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)]
    return Image.fromarray(a, 'RGBA')


def main():
    p = argparse.ArgumentParser()
    p.add_argument('src')
    p.add_argument('dst')
    p.add_argument('--size', required=True, help='96 或 96x64')
    p.add_argument('--colors', type=int, default=48)
    p.add_argument('--crop', help='x0,y0,x1,y1（原图坐标）')
    p.add_argument('--transparent', action='store_true')
    p.add_argument('--preview', help='另存一张放大 4 倍的预览图')
    a = p.parse_args()

    img = Image.open(a.src).convert('RGBA')
    if a.crop:
        img = img.crop(tuple(int(v) for v in a.crop.split(',')))
    w, h = (int(v) for v in (a.size.split('x') if 'x' in a.size else (a.size, a.size)))
    out = quantize(block_median(img, w, h), a.colors)
    if a.transparent:
        out = make_transparent(out)
    out.save(a.dst)
    if a.preview:
        out.resize((w * 4, h * 4), Image.NEAREST).save(a.preview)
    print(f'{a.src} -> {a.dst} ({w}x{h}, {a.colors} 色)')


if __name__ == '__main__':
    main()
