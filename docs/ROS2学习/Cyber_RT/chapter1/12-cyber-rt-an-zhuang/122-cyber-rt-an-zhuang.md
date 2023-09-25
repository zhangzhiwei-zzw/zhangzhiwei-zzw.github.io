### 1.2.2 Cyber RT 安装

Apollo Cyber RT 安装步骤如下：

1. 下载源码；
2. 执行脚本启动docker容器；
3. 进入docker容器；
4. 构建。

#### 1.下载

克隆 Apollo 源码仓库：

```
git clone https://github.com/ApolloAuto/apollo.git
```

GitHub 在国内访问速度可能很慢，可以使用 Gitee 替代：

```
git clone https://gitee.com/ApolloAuto/apollo.git
```

> 注意: 可能会经常性失败。
>
> 耗时记录：1h

#### 2.启动 Apollo Docker 开发容器

进入到 Apollo 源码根目录，执行下述命令以启动 Apollo Docker 开发容器：

```
./docker/scripts/dev_start.sh
```

如果只是使用 Cyber RT 可以执行：

```
./docker/scripts/cyber_start.sh
```

或\(国内建议选择此项，速度更快\)：

```
./docker/scripts/cyber_start.sh -g cn
```

> 耗时记录：1h

#### 3.进入 Apollo Docker 开发容器

启动 Apollo Docker 开发容器后，执行下述命令进入容器：

```
./docker/scripts/dev_into.sh
```

如果只是使用 Cyber RT 可以执行：

```
./docker/scripts/cyber_into.sh
```

可以发现，进入容器后终端信息发生了相应变化，后面的操作将在容器中进行。

#### 4.在容器中构建 Apollo

进入 Apollo Docker 开发容器后，在容器终端中执行下述命令构建 Apollo：

```
./apollo.sh build
```

如果只是使用 Cyber RT 可以执行：

```
./apollo.sh build cyber
```

> 此操作比较耗时
>
> 注意：如果报无权限相关异常，在命令前加`sudo`即可，如遇其他错误，重新执行命令直至成功。



