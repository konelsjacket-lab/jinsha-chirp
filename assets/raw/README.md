# 美术原图

GPT 画的原始大图放这里（文件名和 docs/美术提示词_像素版.txt 里一致，扩展名随意）。
用 `tools/pixelate.py` 处理成游戏尺寸后放进 `assets/img/`，例如：

    python3 tools/pixelate.py assets/raw/portrait_baiguo_happy.webp assets/img/portrait_baiguo_happy.png --size 96

| 原图 | 处理方式 |
|---|---|
| ref_baiguo | 只做参考，不进游戏 |
| portrait_baiguo* | 96×96，48 色，保留背景 |
