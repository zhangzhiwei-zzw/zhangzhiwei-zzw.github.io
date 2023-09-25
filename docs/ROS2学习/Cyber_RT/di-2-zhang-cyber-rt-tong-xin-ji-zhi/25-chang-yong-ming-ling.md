## 3.2 常用命令

通过前面内容的学习，想必大家对通信本身的实现流程以及相关API有一定了解了，接下来我们再介绍一下通信应用中可能会遇到的一些问题，比如：

> * 调试时我们如何获取 Cyber RT 中运行的节点及其相关状态？
>
> * 开发时我编写完了发布节点，如何快速验证节点运行是否正常呢？
>
> * 如何判断消息发布的频率是否符合预期？
>
> * ......

在 Cyber RT 中提供了一些命令工具，可以方便快捷的解决上述问题，本部分内容就主要介绍这些命令的使用，常用的通信相关命令如下：

1. cyber\_node；
2. cyber\_channel；
3. cyber\_service；
4. cyber\_launch。

关于命令的使用，可以查看其内置的帮助文档，以方便学习与应用，获取使用说明的方式如下：

1.获取某个指令的使用说明，可以输入如下格式的命令

```
cyber_xxx -h
```

2.获取某个指令的某个参数的使用说明，可以输入如下格式的命令

```
cyber_xxx yyy -h
```

**准备工作**

启动多个节点，并在调用命令之前请先加载环境变量

```
source cyber/setup.bash
```

---

#### 1.cyber\_node

用于获取 Cyber RT 中运行的节点的相关信息。

```
cyber_node list      列出所有运行中的节点
cyber_node info xxx  输出某个节点或所有节点信息
```

#### 2.cyber\_channel

获取关于话题的相关信息。

```
cyber_channel list   列出所有运行中的话题
cyber_channel info   输出话题相关信息(发布者、订阅者、消息类型....)
cyber_channel echo   输出话题消息
cyber_channel hz     输出话题消息的发布频率
cyber_channel bw     输出消息发布所占用带宽
cyber_channel type   输出话题消息类型
```

#### 3.cyber\_service

获取关于服务的相关信息。

```
cyber_service list   列出所有运行中的服务
cyber_service info   输出某个服务的相关信息
```

#### 4.cyber\_launch

用于 launch 文件的启动与关闭。

```
cyber_launch start   启动 launch 文件
cyber_launch stop    关闭 launch 文件中的模块
```

#### 5.cyber\_monitor

#### 6.cyber\_record

用于录制或重放 record 文件。

```
info    显示 record 文件的相关信息
play    重放 record 文件
record  录制 record 文件
split   分割 record 文件
recover 复制 record 文件
```

综上，这是目前位置 Cyber RT 中提供的关于通信的一些命令，熟练使用这些命令可以大大提高开发和调试成本。

