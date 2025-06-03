# Linux下使用nmcli连接网络

## 介绍
在使用ubuntu系统的时候，有时候不方便使用桌面，使用ssh远程连接，可能需要使用`nmcli`命令来连接网络。本文将介绍如何使用`nmcli`命令连接网络。`nmcli` 是 NetworkManager 的命令行工具，用于管理网络连接

## 查看网络设备状态
nmcli命令一般系统自带的有，没有的话使用命令安装，安装后首先查看设备状态，来判断是否有相关网络设备。
```bash
nmcli device status
```
显示所有网络设备（网卡、Wi-Fi、蓝牙等）的当前状态。

## 扫描可用的 Wi-Fi
```
nmcli device wifi list
```

## 连接到 Wi-Fi
```bash 
nmcli device wifi connect "SSID名称" password "密码"
```
如果权限不够需要加`sudo`。

## 查看已保存的连接
```bash
nmcli connection show
```
列出所有已配置的网络连接（包括 Wi-Fi、有线、VPN 等）。

## 激活 / 停用连接
```bash
# 激活指定连接
nmcli connection up "连接名称"

# 停用指定连接
nmcli connection down "连接名称"
```
## 断开当前网络
```bash
nmcli device disconnect "设备名"
```

## 添加新连接（以 Wi-Fi 为例）
```bash
nmcli connection add type wifi con-name "新连接名称" ifname wlan0 ssid "SSID名称"

# 删除连接
nmcli connection delete "连接名称"
```
## 设置静态 IP（有线网络）
```bash 

nmcli connection modify "连接名称" ipv4.addresses "192.168.1.100/24" \
ipv4.gateway "192.168.1.1" \
ipv4.dns "8.8.8.8,8.8.4.4" \
ipv4.method manual
```

## 重新加载 NetworkManager 配置
```bash
nmcli networking reload
```