# 普通用户权限运行Docker

## 安装Docker
Docker的安装比较简单，在[Docker官网](https://docs.docker.com/engine/install/ubuntu/)已经给出了具体的方案，可以直接使用apt安装
```shell
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
安装完成之后，可以使用```sudo docker pull hello-world```命令拉取镜像，国内镜像速度较慢，可以使用阿里云进行镜像加速。
## 给当前用户添加权限
安装完成之后，直接docker命令可能会提示当前用户的权限不够，需要使用root用户权限，这里可以使用如下命令设置当前用户的权限。

* 创建Docker用户组(如果该用户组已创建过，则会提示该用户组已存在)
```shell
sudo groupadd docker
```
* 添加当前用户到Docker的用户组，```usermod```用来修改用户账号，更改用户属性，```-aG```命令的两个选项，-a表示append，追加用户到当前用户组。```-G```允许指定用户应该被添加到的附加组。这不会更改用户的主组，只是将用户添加到指定的组中。$USER指的是当前用户也可以是其他要添加的用户名。
```shell
sudo usermod -aG docker $USER
```
* 更新并激活组权限
```shell
newgrp docker
```

之后就可以直接使用```docker```命令，而不用在前面加```sudo```
