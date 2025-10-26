# MongoDB 本地安装脚本 (Windows)

## 方法1：使用Chocolatey（推荐）

1. 安装Chocolatey（如果未安装）：
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

2. 安装MongoDB：
```powershell
choco install mongodb
```

## 方法2：手动安装

1. 下载MongoDB Community Server：
   - 访问：https://www.mongodb.com/try/download/community
   - 选择Windows版本
   - 下载MSI安装包

2. 运行安装程序：
   - 选择"Complete"安装
   - 勾选"Install MongoDB as a Service"
   - 勾选"Install MongoDB Compass"（图形界面工具）

3. 启动MongoDB服务：
```powershell
net start MongoDB
```

## 方法3：使用便携版

1. 下载MongoDB便携版
2. 解压到指定目录
3. 创建数据目录：
```powershell
mkdir C:\data\db
```

4. 启动MongoDB：
```powershell
mongod --dbpath C:\data\db
```

## 验证安装

安装完成后，验证MongoDB是否正常工作：
```powershell
mongod --version
mongo --version
```

## 配置环境变量

将MongoDB添加到系统PATH：
```
C:\Program Files\MongoDB\Server\6.0\bin
```
