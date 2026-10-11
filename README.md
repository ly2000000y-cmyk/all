# 《翠花》MV · 翠花2

本分支保存已完成的《翠花》纸感二维动画 MV：1920×1080、24fps、约62.9秒，15个镜头，完整保留用户提供的歌曲。

## 查看作品

- [完整成片](outputs/翠花_MV_完整成片.mp4)（约84.4 MiB，下载后播放）
- [13.5秒样片](outputs/翠花_MV_13.5秒样片.mp4)
- [完整分镜](STORYBOARD.md)
- [制作说明](outputs/翠花_制作方向.md)
- [原音轨](assets/cuihua.mp3)
- [成片验证报告](review/verification.json)与 `review/actual_contact_*.jpg` 实际抽帧检查图

故事从骑摩托来到寨子、买红河、偷西瓜，走到六年后重逢、拒绝卷裤脚、独自寻找，最后以花落水面收束。画面不叠加歌词字幕。

## 继续编辑与渲染

需要 Node.js、Google Chrome 和 FFmpeg；执行时须让 FFmpeg 在 PATH 中，或设置 `FFMPEG_PATH` 为其完整路径。

```sh
npm ci
node render-full.mjs
```

打开 `studio.html` 可预览并拖动时间轴。正式镜头在 `src/scenes/cuihua_full.js`，共享角色与样片在 `src/scenes/cuihua_sample.js`；时长和节拍在 `src/config.js`。

渲染默认使用3个并行进程。在 Windows 上使用 Chrome 的 Direct3D GPU 后端，本次成片使用本地 RTX 5060 渲染。可指定 Chrome：`node render-full.mjs --chrome="Chrome完整路径"`；无 GPU 可加 `--soft-gl`。已有帧时运行 `node render-full.mjs --encode-only` 可重新合成。

合成脚本保留全部音频，不使用提前截断音轨的 `-shortest`。视频轨62.875秒，音频轨约62.929秒；验证通过全片解码，音轨对齐延迟0，相关系数0.999416。逐帧渲染可能因平台和依赖环境略有差异，`outputs` 中保存的是已验收制作流程产出的原始交付文件。

## 来源

动画引擎基于 [JohnHeibel/ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)，参考提交 `0ac8bf2b31942376cb6b8c4074715595d512acd2`。保留原作者 John Heibel 的 [MIT许可](LICENSE) 和 [动画指南](ANIMATION_GUIDE.md)。MV故事、镜头和场景是本项目的改编制作；音轨由用户提供，MIT许可仅适用于其授权的软件部分。

本分支直接保存视频与音频；依赖、浏览器缓存和渲染中间帧不纳入版本库。
