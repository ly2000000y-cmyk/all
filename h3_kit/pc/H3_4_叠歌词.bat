@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title 爱错 x H3：叠歌词

echo ============================================================
echo   把 H3 版 out\aicuo_h3.mp4 放大到 1080p、叠上歌词、换回原曲
echo   歌词文字层比歌词文件旧时会自动重渲
echo ============================================================
echo.

set "PATH=D:\nodejs;C:\Program Files\nodejs;%PATH%"
for /d %%D in ("%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg*") do for /d %%E in ("%%D\ffmpeg-*") do if exist "%%E\bin\ffmpeg.exe" set "PATH=%%E\bin;%PATH%"

where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 找不到 Node.js。
  goto :fail
)
where ffmpeg >nul 2>nul
if errorlevel 1 (
  echo [错误] 找不到 ffmpeg。先双击一次 render.bat 它会自动安装 ffmpeg，再回来双击本文件。
  goto :fail
)
if not exist "out\aicuo_mv.mp4" (
  echo [错误] 找不到 out\aicuo_mv.mp4（无字幕的手绘版）。请先双击 render.bat 渲出视频。
  goto :fail
)

if not exist "node_modules\p5.brush\dist\p5.brush.js" (
  echo [错误] 依赖还没装好，请先双击 render.bat。
  goto :fail
)
if not exist "out\aicuo_h3.mp4" (
  echo [错误] 找不到 out\aicuo_h3.mp4。请把从云端下载的 H3 版视频改名为 aicuo_h3.mp4 放进 out 文件夹。
  goto :fail
)
copy /y "tools\p5.brush.patched.js" "node_modules\p5.brush\dist\p5.brush.js" >nul

rem 文字层比歌词文件旧（或还没渲过）就清掉重渲；已经是最新的就直接用
set "NEED=1"
if exist "out\lyric\l00000.png" (
  powershell -NoProfile -Command "if ((Get-Item 'out\lyric\l00000.png').LastWriteTime -ge (Get-Item 'src\scenes\aicuo_lyrics.js').LastWriteTime) { exit 0 } else { exit 1 }"
  if not errorlevel 1 set "NEED=0"
)
if "%NEED%"=="1" (
  echo [1/2] 歌词文字层需要重渲，约几分钟 ...
  if exist "out\lyric" rmdir /s /q "out\lyric"
  node render.mjs --frames --lyrics-only --workers=3 --dir=out/lyric
  if errorlevel 1 (
    echo [错误] 文字层渲染中断了。再双击一次会接着渲。
    goto :fail
  )
) else (
  echo [1/2] 歌词文字层已是最新，直接使用。
)

echo.
echo [2/2] 放大到 1080p、叠歌词、换回原曲并重新编码 ...
ffmpeg -y -loglevel error -stats -i "out\aicuo_h3.mp4" -framerate 24 -i "out\lyric\l%%05d.png" -i "out\aicuo_mv.mp4" -filter_complex "[0:v]fps=24,scale=1920:1080:flags=lanczos,setsar=1[b];[b][1:v]overlay=format=auto:shortest=1,format=yuv420p[v]" -map "[v]" -map 2:a -c:v libx264 -preset slow -crf 17 -c:a copy -shortest -movflags +faststart "out\aicuo_h3_lyrics.mp4"
if errorlevel 1 (
  echo [错误] 合成失败，请把上面的报错截图发给我。
  goto :fail
)
echo.
echo ============================================================
echo   完成！带歌词的 H3 黏土版：%~dp0out\aicuo_h3_lyrics.mp4
echo ============================================================
start "" explorer /select,"%~dp0out\aicuo_h3_lyrics.mp4"
pause
exit /b 0

:fail
echo.
pause
exit /b 1
