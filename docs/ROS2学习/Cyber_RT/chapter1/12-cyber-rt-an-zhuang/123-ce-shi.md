### 1.2.3 测试

#### **测试前准备：**

默认情况下，cyber 的日志信息是写出到磁盘文件，而不会在终端输出，为了方便查看运行结果，我们需要修改 cyber 的配置文件，使其能够将日志消息输出在终端，具体操作如下：

##### 1.打开配置文件

```
vi cyber/setup.bash
```

**2.修改并退出编辑器**

文件中参数GLOG\_alsologtostderr 的默认值为0，需要修改为1

```
export GLOG_alsologtostderr=1
```

##### 3.重新加载配置文件

```
source cyber/setup.bash
```

#### **测试：**

打开两个终端A和B，按照上一节介绍，分别进入 docker 容器。

终端A输入命令：

```
./bazel-bin/cyber/examples/talker
```

终端B输入命令：

```
./bazel-bin/cyber/examples/listener
```

两个终端会分别输出日志信息，执行结果如下所示：

![](/assets/001_演示1_talker_listener.gif)

