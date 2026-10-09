@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title 爱错 x H3：拼回整片

echo ============================================================
echo   把 H3 生成的镜头拼回整片，音轨用原曲
echo   没有 H3 版本的镜头自动用原手绘版
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

dir /b "h3\out\s*.mp4" >nul 2>nul
if errorlevel 1 (
  echo [错误] h3\out 里还没有 H3 生成的镜头。把生成好的 s01.mp4、s03.mp4 ... 放进去再双击本文件。
  goto :fail
)
echo 开始拼接（没有 H3 版本的镜头自动用原来的手绘版）...
node h3_kit\join_shots.mjs out\aicuo_h3.mp4
if errorlevel 1 (
  echo [错误] 拼接失败，请把上面的报错截图发给我。
  goto :fail
)
echo.
echo ============================================================
echo   完成！混合版在：%~dp0out\aicuo_h3.mp4（还没有歌词）
echo   下一步：双击 H3_4_叠歌词.bat
echo ============================================================
start "" explorer /select,"%~dp0out\aicuo_h3.mp4"
pause
exit /b 0

:fail
echo.
pause
exit /b 1
