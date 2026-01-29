@echo off
chcp 65001 >nul

echo ============================================
echo      小学数学出题工具 - Windows打包工具
echo ============================================
echo.

echo [1/3] 清理旧构建文件...
if exist "release\win-unpacked" rmdir /s /q "release\win-unpacked"
if exist "release\win-ia32-unpacked" rmdir /s /q "release\win-ia32-unpacked"
echo 完成

echo.
echo [2/3] 构建 Vue 应用...
call npm run build
if errorlevel 1 (
    echo 构建失败!
    echo.
    echo 按任意键退出...
    pause >nul
    exit 1
)
echo 构建成功

echo.
echo [3/3] 打包 Windows 便携版...
echo 注意: 首次打包需要下载 Electron，可能需要3-5分钟
npx electron-builder --win portable --x64 --ia32
if errorlevel 1 (
    echo 打包失败!
    echo.
    echo 按任意键退出...
    pause >nul
    exit 1
)
echo 打包成功

echo.
echo ============================================
echo           打包完成!
echo ============================================
echo.
echo 便携版: release\小学数学出题工具-1.0.0-portable.exe
echo 安装版: release\小学数学出题工具 Setup 1.0.0.exe
echo 支持系统: Windows 7 SP1+ (32位/64位)
echo.
echo 按任意键退出...
pause >nul
