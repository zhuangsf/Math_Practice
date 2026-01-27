# Electron 打包使用指南

## 快速开始

### 1. 打包 Windows 可执行程序

```bash
npm run electron:build:win
```

这个命令会：
1. 先构建 Vue 应用（生成 dist 目录）
2. 然后使用 electron-builder 打包成 Windows 可执行程序

### 2. 打包输出

打包完成后，在 `release` 目录中会生成两个文件：

- **安装程序**：`小学数学出题工具 Setup 1.0.0.exe`
  - 标准的 Windows 安装程序
  - 可以安装到系统，创建桌面快捷方式
  - 适合需要正式安装的用户

- **便携版**：`小学数学出题工具-1.0.0-portable.exe`
  - 绿色便携版，无需安装
  - 双击即可运行
  - **推荐使用**，方便快速分享

### 3. 分享给好友

直接将 `小学数学出题工具-1.0.0-portable.exe` 文件发送给好友即可：
- 无需安装，双击运行
- 文件大小约 100-150MB
- 功能完整，与 Web 版本一致

### 4. 开发模式测试

如果想在开发模式下测试 Electron 应用：

```bash
# 终端1：启动 Vite 开发服务器
npm run dev

# 终端2：启动 Electron
npm run electron:dev
```

## 注意事项

1. **首次打包**：electron-builder 需要下载 Electron 二进制文件，请确保网络连接正常
2. **文件大小**：打包后的文件包含 Electron 运行时，体积较大（100-150MB）是正常的
3. **图标**：当前未配置应用图标，如需添加图标，请将 `icon.ico` 文件放在 `build` 目录，并取消 `package.json` 中 `win.icon` 的注释
4. **依赖**：electron-builder 会自动处理依赖，无需手动配置 node_modules

## 故障排除

如果打包失败：
1. 确保已运行 `npm install` 安装所有依赖
2. 确保已成功运行 `npm run build` 生成 dist 目录
3. 检查网络连接，electron-builder 需要下载 Electron 二进制文件
4. 查看错误信息，根据提示解决问题
