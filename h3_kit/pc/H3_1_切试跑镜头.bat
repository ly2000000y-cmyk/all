@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
title 爱错 x H3 试跑：切 3 个镜头

echo ============================================================
echo   《爱错》× MiniMax H3 试跑：只切 3 个镜头（s01 开场 / s03 铁山院子 / s19 熊抱）
echo   不改动原视频，只生成 h3 文件夹
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

node h3_kit\cut_shots.mjs --only=s01,s03,s19
if errorlevel 1 (
  echo [错误] 切镜头失败，请把上面的报错截图发给我。
  goto :fail
)
echo.
echo ============================================================
echo   完成！参考包：%~dp0h3\ref_pack.zip
echo   里面有参考片段、参考图、prompts.md（每个镜头的提示词）
echo   下一步：把它上传到云端 ComfyUI，照 H3_说明.txt 操作
echo ============================================================
start "" explorer /select,"%~dp0h3\ref_pack.zip"
pause
exit /b 0

:fail
echo.
pause
exit /b 1
