## 4.1 节点相关API

### C++部分

#### 1.节点初始化

```
bool apollo::cyber::Init(const char* binary_name)
```

用于初始化 cyber 框架。

#### 2.节点创建

在CyberRT框架中，节点是最基本的单元，类似于句柄的角色。 在创建特定的函数对象\(写入器、读取器等\)时，需要基于现有的节点实例创建它。 创建节点界面如下所示:

```
std::unique_ptr<Node> apollo::cyber::CreateNode(const std::string& node_name, const std::string& name_space = "");
```

参数:

* Node\_name:节点名，全局唯一标识

* Name\_space:节点所在空间的名称

  Name\_space默认为空。 它是与node\_name连接的空间的名称。 格式为/namespace/node\_name

返回值:

一个指向Node的智能指针

当cyber::Init\(\)未被调用时，系统处于未初始化状态，无法创建节点，返回nullptr

#### 3.节点状态判断

判断节点状态:

```
apollo::cyber::OK()
```

返回值: true 正常，否则 false

待测试

```
bool IsShutdown()
```

#### 4.节点释放

程序关闭时，需要释放节点资源。

```
void apollo::cyber::WaitForShutdown()
```

---

### Python部分

#### 1.节点初始化

```
##
# @brief init cyber environment.
# @param module_name Used as the log file name.
#
# @return Success is True, otherwise False.
def init(module_name="cyber_py"):
    """
    init cyber environment.
    """
    return _CYBER.py_init(module_name)
```

#### 2.节点创建

```
class Node(object):

    """
    Class for cyber Node wrapper.
    """

    def __init__(self, name):
        self.node = _CYBER.new_PyNode(name)
        self.list_writer = []
        self.list_reader = []
        self.subs = {}
        self.pubs = {}
        self.list_client = []
        self.list_service = []
        self.mutex = threading.Lock()
        self.callbacks = {}
        self.services = {}
```

#### 3.节点状态判断

```
def ok():
    """
    is cyber envi ok.
    """
    return _CYBER.py_ok()


def is_shutdown():
    """
    is cyber shutdown.
    """
    return _CYBER.py_is_shutdown()
```

#### 4.节点释放

```
def shutdown():
    """
    shutdown cyber envi.
    """
    return _CYBER.py_shutdown()


def waitforshutdown():
    """
    wait until the cyber is shutdown.
    """
    return _CYBER.py_waitforshutdown()
```



