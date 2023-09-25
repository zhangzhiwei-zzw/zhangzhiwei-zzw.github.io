### 2.3.2 Python实现

#### 1.参数服务端

demo\_py 目录下新建 Python 文件 demo05\_param\_server\_py.py，输入如下内容：

```py
#!/usr/bin/env python3
"""  
    需求: 服务端设置参数，客户端操作参数
    实现:
        1.包含头文件；
        2.初始化 cyber 框架；
        3.创建节点；
        4.创建参数服务端；
        5.设置参数；
        6.等待关闭。
"""
from cyber.python.cyber_py3 import cyber
from cyber.python.cyber_py3 import parameter

if __name__ == "__main__":
    cyber.init()
    print("param service .....")
    # 3.创建节点；
    param_service_node = cyber.Node("param")
    # 4.创建参数服务端；
    param_service = parameter.ParameterServer(param_service_node)
    # 5.设置参数；
    #
    param1 = parameter.Parameter("type","car_apollo")
    param2 = parameter.Parameter("length",1.5)
    param3 = parameter.Parameter("cameras",2)

    param_service.set_parameter(param1)
    param_service.set_parameter(param2)
    param_service.set_parameter(param3)

    #
    p1 = param_service.get_parameter("type")
    p2 = param_service.get_parameter("length")
    p3 = param_service.get_parameter("cameras")
    print("type = %s,length = %.2f,cameras = %d" %(p1.as_string(), p2.as_double(), p3.as_int64()))

    #  
    ps = param_service.get_paramslist()
    for p in ps:
        print(p.debug_string())

    # while not cyber.is_shutdown():
    #     pass
    param_service_node.spin()
    # 6.等待关闭。
    cyber.shutdown()
```

配置文件BUILD添加内容如下:

```
py_binary(
    name = "demo05_param_server_py",
    srcs = ["demo05_param_server_py.py"],
    deps = [
        "//cyber/python/cyber_py3:cyber",
        "//cyber/python/cyber_py3:parameter"
    ] 
)
```

#### 2.参数客户端

demo\_py 目录下新建 Python 文件 demo06\_param\_client\_py.py，输入如下内容：

```py
#!/usr/bin/env python3
"""  
    需求: 服务端设置参数，客户端操作参数
    实现:
        1.包含头文件；
        2.初始化 cyber 框架；
        3.创建节点；
        4.创建参数客户端；
        5.操作参数；
        6.等待关闭。
"""
from cyber.python.cyber_py3 import cyber
from cyber.python.cyber_py3 import parameter

if __name__ == "__main__":
    cyber.init()
    print("param client .....")
    # 3.创建节点；
    param_client_node = cyber.Node("param_client_node")
    # 4.创建参数客户端；
    client = parameter.ParameterClient(param_client_node,"param")
    # 5.操作参数；
    p1 = client.get_parameter("type")
    p2 = client.get_parameter("length")
    p3 = client.get_parameter("cameras")
    print("type = %s,length = %.2f,cameras = %d" %(p1.as_string(), p2.as_double(), p3.as_int64()))
    client.set_parameter(parameter.Parameter("cameras",100))
    p4 = client.get_parameter("cameras")
    print("type = %s,length = %.2f,cameras = %d" %(p1.as_string(), p2.as_double(), p4.as_int64()))
    ps = client.get_paramslist()
    for p in ps:
        print(p.debug_string())
    # 6.等待关闭。
    cyber.shutdown()
```

配置文件BUILD添加内容如下:

```
py_binary(
    name = "demo06_param_client_py",
    srcs = ["demo06_param_client_py.py"],
    deps = [
        "//cyber/python/cyber_py3:cyber",
        "//cyber/python/cyber_py3:parameter"
    ] 
)
```

#### 3.编译运行

编译：

```
bazel build cyber/demo_py/...
```

执行\(需要两个终端\)：

终端A执行发布方：

```
source cyber/setup.bash
```

```
./bazel-bin/cyber/demo_py/demo05_param_server_py
```

终端B执行订阅方：

```
source cyber/setup.bash
```

```
./bazel-bin/cyber/demo_py/demo06_param_client_py
```

执行结果：参数服务端和客户端都会输出参数相关信息。

