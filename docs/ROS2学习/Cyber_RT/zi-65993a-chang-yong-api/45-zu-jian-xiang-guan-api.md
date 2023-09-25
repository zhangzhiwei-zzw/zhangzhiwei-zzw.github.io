## 4.5 组件相关API

组件只有 C++ 实现，没有 Python 实现。

### C++部分

#### 1.组件接口

* Init\(\) 该函数用于执行初始化操纵；

* Proc\(\) 该函数类似于订阅方的回调函数，当接收到消息时会被调用。

#### 2.dag 文件

* module\_library：要加载的 .so库，根目录是cyber的工作目录（与setup.bash同目录）；

* components & timer\_component：选择需要加载的基组件类类型；

* class\_name：要加载的组件类的名称；

* name：加载的class\_name作为加载示例的标识符；

* reader：当前组件接收到的数据，支持1-3路数据。

#### 3.launch 文件

cyber\_launch 是 Cyber​​ RT 框架的启动器。它根据launch文件启动多个 mainboard，根据dag文件将不同的组件加载到不同的mainboard 中。 cyber\_launch 支持动态加载组件或在子进程中启动二进制程序的两种方案。

module：每个加载的组件或二进制文件都是一个模块

* name 是加载的模块名称；

* dag\_conf 是组件对应的dag文件名；

* process\_name 是 mainboard 进程启动后的名称，process\_name 相同的组件会被加载并运行在同一个进程中。

* exception\_handler 是进程发生异常时的处理方法。该值可以是下面列出的 exit 或 respawn。

  * exit, 这意味着当当前进程异常退出时，整个进程需要停止运行。
  * respawn,当前进程异常退出后需要重启。



