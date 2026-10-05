"""按 tools/art_manifest.json 把 assets/raw 里的原图批量处理成 assets/img 里的游戏图。

  python3 tools/process_art.py            # 处理清单里所有的图
  python3 tools/process_art.py tile_05    # 只处理名字里带 tile_05 的
  python3 tools/process_art.py --preview  # 额外在 assets/raw/_preview/ 生成放大 4 倍的预览

依赖：pip install pillow numpy
"""
import json
import os
import sys

from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from pixelate import block_median, quantize, make_transparent  # noqa: E402

ROOT = os.path.join(os.path.dirname(__file__), '..')
RAW = os.path.join(ROOT, 'assets', 'raw')
OUT = os.path.join(ROOT, 'assets', 'img')


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    preview = '--preview' in sys.argv
    manifest = json.load(open(os.path.join(os.path.dirname(__file__), 'art_manifest.json'), encoding='utf-8'))
    defaults = manifest.get('defaults', {})
    done = 0
    for item in manifest['items']:
        it = {**defaults, **item}
        if args and not any(a in it['src'] for a in args):
            continue
        src = os.path.join(RAW, it['src'])
        dst = os.path.join(OUT, it.get('dst', os.path.splitext(it['src'])[0] + '.png'))
        if not os.path.exists(src):
            print(f'  跳过（没有原图）：{it["src"]}')
            continue
        img = Image.open(src).convert('RGBA')
        if it.get('crop'):
            img = img.crop(tuple(int(v) for v in it['crop'].split(',')))
        size = str(it['size'])
        w, h = (int(v) for v in (size.split('x') if 'x' in size else (size, size)))
        out = quantize(block_median(img, w, h), it['colors'])
        if it.get('transparent'):
            out = make_transparent(out)
        out.save(dst)
        if preview:
            os.makedirs(os.path.join(RAW, '_preview'), exist_ok=True)
            out.resize((w * 4, h * 4), Image.NEAREST).save(os.path.join(RAW, '_preview', os.path.basename(dst)))
        print(f'  {it["src"]} -> {os.path.relpath(dst, ROOT)}  ({w}x{h}, {it["colors"]} 色)')
        done += 1
    print(f'处理了 {done} 张。')


if __name__ == '__main__':
    main()
