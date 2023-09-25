### 1.2.1 准备工作

在正式安装 Apollo 或 CyberRT 之前，需要先准备基础环境，基础环境主要包含如下内容：

1. 安装 Ubuntu Linux；
2. 安装 NVIDIA GPU 驱动（可选）；
3. 安装docker；
4. 安装 NVIDIA Container Toolkit。

#### 1.安装 Ubuntu Linux

当前课程采用的是 Apollo 6.0 版，建议对应的操作系统使用ubuntu20.04 或 ubuntu18.04，在此不涉及ubuntu操作系统的安装，如有需要可参考链接：[https://www.bilibili.com/video/BV1Ci4y1L7ZZ?p=7](https://www.bilibili.com/video/BV1Ci4y1L7ZZ?p=7)。

在执行下一步前，请先更新相关软件，命令如下：

```
sudo apt-get update
sudo apt-get upgrade
```

> 耗时记录：1.5h~2h

#### 2.安装 NVIDIA GPU 驱动（可选）

车上的 Apollo 运行环境需要依赖 NVIDIA GPU 驱动。

> 注意：如果您不需要运行感知模块，只想播放数据包体验 Apollo，则不需要安装 NVIDIA 驱动。

您可以通过以下两种方式在 Ubuntu 上进行安装：

* （推荐）`apt-get`命令，参见[How to Install NVIDIA Driver](https://github.com/NVIDIA/nvidia-docker/wiki/Frequently-Asked-Questions#how-do-i-install-the-nvidia-driver)。

* 使用官方[runfile](https://www.nvidia.com/en-us/drivers/unix/)。

对于 Ubuntu 18.04+，只需要简单执行以下命令即可：

```
sudo apt-get update
sudo apt-add-repository multiverse
sudo apt-get update
sudo apt-get install nvidia-driver-455
```

可以输入`nvidia-smi`来校验 NVIDIA GPU 驱动是否在正常运行（可能需要在安装后重启系统以使驱动生效）。如果成功，则会出现以下信息：

```
Prompt> nvidia-smi
Mon Jan 25 15:51:08 2021
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 460.27.04    Driver Version: 460.27.04    CUDA Version: 11.2     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  GeForce RTX 3090    On   | 00000000:65:00.0  On |                  N/A |
| 32%   29C    P8    18W / 350W |    682MiB / 24234MiB |      7%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|    0   N/A  N/A      1286      G   /usr/lib/xorg/Xorg                 40MiB |
|    0   N/A  N/A      1517      G   /usr/bin/gnome-shell              120MiB |
|    0   N/A  N/A      1899      G   /usr/lib/xorg/Xorg                342MiB |
|    0   N/A  N/A      2037      G   /usr/bin/gnome-shell               69MiB |
|    0   N/A  N/A      4148      G   ...gAAAAAAAAA --shared-files      105MiB |
+-----------------------------------------------------------------------------+
```

#### 3.安装docker

##### 3.1 安装

Apollo 6.0+ 依赖于 Docker 19.03+。安装 Docker 引擎，参见[Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)。

Ubuntu 上的 Docker-CE 也可以通过 Docker 提供的官方脚本安装：

```
curl https://get.docker.com | sh
sudo systemctl start docker && sudo systemctl enable docker
```

注意：安装时，可能会抛出异常

![](/assets/004_安装准备工作_异常提示.PNG)

直接根据提示调用 sudo apt install curl 即可。

> 耗时记录：10min

##### 3.2 测试

测试docker，在终端中输入：

```
sudo docker run hello-world
```

运行结果：

![](/assets/005_安装准备工作_docker_helloworld.PNG)

##### 3.3 优化

在上一步测试时，使用到了 sudo 权限，否则，可能会抛出异常，比如：

![](/assets/006_安装准备工作_docker_权限异常.PNG)对此，我们可以进行优化，添加 docker 权限给当前用户，使用 docker 时可以免sudo，具体操作如下：

1. 创建  docker 用户组

   ```
   $ sudo groupadd docker
   ```

2. 添加当前用户到 docker 组

   ```
   $ sudo usermod -aG docker $USER
   ```

3. 重启虚拟机或者执行以下命令使之生效（要重启）

   ```
   $ newgrp docker
   ```

4. 测试是否可以免sudo运行

   ```
   $ docker run hello-world
   ```

另外，我们还可以配置docker开机自启动，执行如下命令：

```
$ sudo systemctl enable docker.service
$ sudo systemctl enable containerd.service
```

#### 1.4安装 NVIDIA Container Toolkit

基于 Apollo 的 CUDA 的 docker 镜像需要依赖于 NVIDIA Container Toolkit。运行以下命令安装 NVIDIA Container Toolkit：

```
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get -y update
sudo apt-get install -y nvidia-docker2
```

> 耗时统计： 比较快。

安装完成后，重启 Docker 以使改动生效。

```
sudo systemctl restart docker
```

---



