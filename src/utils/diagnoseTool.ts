/**
 * 客户电脑环境诊断工具
 * 用于排查"不是有效的win32应用程序"错误
 * create by jx + diagnose tool for customer environment check
 */

// 获取系统基本信息
function getSystemInfo() {
    const info = {
        os: {
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            appVersion: navigator.appVersion,
        },
        screen: {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth,
        },
        // 检测是否在Electron环境
        isElectron: typeof window !== 'undefined' && window.process && window.process.versions && window.process.versions.electron,
        electronVersion: typeof window !== 'undefined' && window.process && window.process.versions ? window.process.versions.electron : null,
        nodeVersion: typeof window !== 'undefined' && window.process && window.process.versions ? window.process.versions.node : null,
        chromeVersion: typeof window !== 'undefined' && window.process && window.process.versions ? window.process.versions.chrome : null,
    };
    return info;
}

// 检测Windows版本
function getWindowsVersion() {
    if (navigator.userAgent.indexOf('Windows') === -1) {
        return '非Windows系统';
    }

    const ua = navigator.userAgent;
    let version = '未知';

    // 提取Windows版本
    if (ua.indexOf('Windows NT 10.0') !== -1) version = 'Windows 10/11';
    else if (ua.indexOf('Windows NT 6.3') !== -1) version = 'Windows 8.1';
    else if (ua.indexOf('Windows NT 6.2') !== -1) version = 'Windows 8';
    else if (ua.indexOf('Windows NT 6.1') !== -1) version = 'Windows 7';
    else if (ua.indexOf('Windows NT 6.0') !== -1) version = 'Windows Vista';
    else if (ua.indexOf('Windows NT 5.1') !== -1) version = 'Windows XP';

    return version;
}

// 检测系统架构
function getSystemArchitecture() {
    if (navigator.userAgent.indexOf('Win64') !== -1 || navigator.userAgent.indexOf('x64') !== -1) {
        return 'x64 (64位)';
    }
    if (navigator.userAgent.indexOf('WOW64') !== -1) {
        return 'x64 (64位，通过32位程序运行)';
    }
    return 'x86 (32位)';
}

// 导出诊断报告
function generateDiagnosticReport() {
    const report = {
        timestamp: new Date().toISOString(),
        systemInfo: getSystemInfo(),
        windowsVersion: getWindowsVersion(),
        architecture: getSystemArchitecture(),
        // 检测关键DLL是否存在（通过尝试加载）
        dllCheck: {
            // 这些DLL是Electron应用运行所必需的
            // 在Web环境中无法直接检测，但可以在Electron主进程中检测
        },
    };

    console.log('=== 诊断报告 ===');
    console.log(JSON.stringify(report, null, 2));

    return report;
}

// 在Electron主进程中运行额外的诊断
async function runElectronDiagnostics() {
    if (typeof window === 'undefined' || !window.process) {
        console.log('非Electron环境，跳过Electron特定诊断');
        return null;
    }

    const fs = window.require('fs');
    const path = window.require('path');

    // 定义DLL检查对象的类型
    type DllStatus = { [key: string]: boolean };

    const report = {
        currentDirectory: process.cwd(),
        execPath: process.execPath,
        resourcesPath: window.require('electron').ipcRenderer.invoke('get-resources-path'),
        platform: process.platform,
        arch: process.arch,
        versions: process.versions,
        env: {
            NODE_ENV: process.env.NODE_ENV,
        },
        // 检查关键文件是否存在
        criticalFiles: {} as DllStatus,
    };

    // 初始化criticalFiles对象
    const dllList = [
        'd3dcompiler_47.dll',
        'dxcompiler.dll',
        'dxil.dll',
        'ffmpeg.dll',
        'libEGL.dll',
        'libGLESv2.dll',
        'vulkan-1.dll',
        'vk_swiftshader.dll',
    ];

    // 检查DLL文件是否存在
    const baseDir = path.dirname(process.execPath);
    for (const dll of dllList) {
        const dllPath = path.join(baseDir, dll);
        try {
            report.criticalFiles[dll] = fs.existsSync(dllPath);
        } catch (e) {
            report.criticalFiles[dll] = false;
        }
    }

    console.log('=== Electron诊断报告 ===');
    console.log(JSON.stringify(report, null, 2));

    return report;
}

// 定义诊断工具接口
interface DiagnoseTool {
    getSystemInfo: () => {
        os: { platform: string; userAgent: string; appVersion: string; };
        screen: { width: number; height: number; colorDepth: number; };
        isElectron: string | false | undefined;
        electronVersion: string | null;
        nodeVersion: string | null;
        chromeVersion: string | null;
    };
    getWindowsVersion: () => string;
    getSystemArchitecture: () => string;
    generateDiagnosticReport: () => {
        timestamp: string;
        systemInfo: ReturnType<typeof getSystemInfo>;
        windowsVersion: string;
        architecture: string;
        dllCheck: Record<string, unknown>;
    };
    runElectronDiagnostics: () => Promise<{
        currentDirectory: string;
        execPath: string;
        resourcesPath: unknown;
        platform: string;
        arch: string;
        versions: Record<string, string>;
        env: { NODE_ENV: string | undefined };
        criticalFiles: { [key: string]: boolean };
    } | null>;
}

// 导出诊断函数到全局
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).diagnoseTool = {
    getSystemInfo,
    getWindowsVersion,
    getSystemArchitecture,
    generateDiagnosticReport,
    runElectronDiagnostics,
} as unknown as DiagnoseTool;

console.log('诊断工具已加载。使用 diagnoseTool 对象调用诊断函数。');
console.log('示例: diagnoseTool.generateDiagnosticReport()');
