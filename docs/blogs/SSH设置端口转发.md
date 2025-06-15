# SSH设置端口转发
假设本地主机A的IP地址为`192.168.124.130`,没有无线网口，不能连接无线网，但是可以通过有线网络和主机B通信，主机B的IP地址为`192.1687.124.151`，主机B可以通过wifi连接网络，那么可以设置主机A的流量通过主机B转发。

## 主机A设置
在本地主机执行如下命令,-f：让 SSH 在后台运行,-C：启用压缩,-N：不执行远程命令，只用于端口转发,-T：不分配伪终端,-D 8080：设置动态端口转发，本地监听 8080 端口
```shell
ssh -fCNT -D 8080 nubot@192.168.124.151
```
注意在这一步中要确定8080端口没有在监听状态。

然后在本地终端中配置代理服务：
```shell
export http_proxy=socks5h://127.0.0.1:8080
export https_proxy=socks5h://127.0.0.1:8080
export ftp_proxy=socks5h://127.0.0.1:8080
```
这个时候执行`curl www.baidu.com`可以看到网络已经可以成功访问，但是使用`sudo apt update`命令的时候，还可能存在问题，使用`sudo -E apt update`命令， -E保留环境变量


## 主机B配置
主机B需要保证SSH服务正在运行，
1、检查SSH服务配置
```
sudo nano /etc/ssh/sshd_config
```
确保一下存在或者没有注释
```
AllowTcpForwarding yes
GatewayPorts no
X11Forwarding no
```
2、重启SSH服务使配置生效
```
sudo systemctl restart sshd
```