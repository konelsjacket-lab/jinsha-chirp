"""把像素字体裁成“游戏里用到的字”，从 2MB 缩到几十 KB。

新加了台词以后运行一次：
  python3 tools/subset_font.py
npm test 会检查字体里是不是缺字（缺了就提醒你重新运行这个脚本）。

字体：Fusion Pixel 12px（SIL OFL 1.1，可商用），原文件 assets/fonts/fusion-pixel-12px-full.woff2
依赖：pip install fonttools brotli
"""
import glob
import os
import string

from fontTools import subset

ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = os.path.join(ROOT, 'assets', 'fonts', 'fusion-pixel-12px-full.woff2')
OUT = os.path.join(ROOT, 'assets', 'fonts', 'jinsha-pixel.woff2')

# 常用标点、数字、字母，保证玩家看到的任何数字/符号都有
EXTRA = string.printable + '，。、？！：；“”‘’（）《》【】「」『』—…·～×÷↑↓←→▶▼◆✔⛶　0123456789'


def used_chars():
    chars = set(EXTRA)
    files = glob.glob(os.path.join(ROOT, 'src', '**', '*.js'), recursive=True) + [os.path.join(ROOT, 'index.html')]
    for f in files:
        chars |= set(open(f, encoding='utf-8').read())
    return ''.join(sorted(c for c in chars if c.isprintable() or c == '　'))


def main():
    text = used_chars()
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['*']
    font = subset.load_font(SRC, opts)
    sub = subset.Subsetter(opts)
    sub.populate(text=text)
    sub.subset(font)
    subset.save_font(font, OUT, opts)
    # 记下字体里有哪些字，npm test 用它检查新台词有没有缺字
    open(os.path.join(ROOT, 'assets', 'fonts', 'charset.txt'), 'w', encoding='utf-8').write(text)
    print(f'{len(text)} 个字符 -> {os.path.relpath(OUT, ROOT)} ({os.path.getsize(OUT) // 1024} KB)')


if __name__ == '__main__':
    main()
