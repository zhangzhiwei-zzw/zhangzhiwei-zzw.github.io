### 2.2.2 Python实现

#### 1.服务端实现

demo\_py 目录下新建 Python 文件 demo03\_server\_py.py，输入如下内容：

```py
#!/usr/bin/env python3
"""  
    需求:实现请求响应
    实现:
        1.导包；
        2.初始化 cyber 框架；
        3.创建服务节点；
        4.创建服务方；
        5.处理请求；
        6.关闭。

"""
from cyber.python.cyber_py3 import cyber
from cyber.demo_base_proto.addints_pb2 import AddInts_Request
from cyber.demo_base_proto.addints_pb2 import AddInts_Response

def cb(req):
    num1 = req.num1
    num2 = req.num2
    print("num1: %d, num2 %d"%(num1,num2))
    sum = num1 + num2
    response = AddInts_Response()
    response.sum = sum
    return response


if __name__ == "__main__":
    cyber.init()
    print("server.....")
    # 3.创建服务节点；
    server_node = cyber.Node("server_node")
    # 4.创建服务方；
    server = server_node.create_service("addints",AddInts_Request,AddInts_Response,cb)
    server_node.spin()
    # 5.处理请求；
    # 6.关闭。
    cyber.shutdown()
```

配置文件BUILD添加内容如下:

```
py_binary(
    name = "demo03_server_py",
    srcs = ["demo03_server_py.py"],
    deps = [
        "//cyber/python/cyber_py3:cyber",
        "//cyber/demo_base_proto:addints_proto_py"
    ] 

)
```

#### 2.客户端实现

demo\_py 目录下新建 Python 文件 demo04\_client\_py.py，输入如下内容：

```py
#!/usr/bin/env python3
"""  
    需求:发送两个数字到服务端，并处理响应
    实现:
        1.导包；
        2.初始化；
        3.创建节点；
        4.创建客户端；
        5.发送数据处理响应；
        6.等待关闭。

"""

from cyber.python.cyber_py3 import cyber
from cyber.demo_base_proto.addints_pb2 import AddInts_Request
from cyber.demo_base_proto.addints_pb2 import AddInts_Response
import sys

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("请输入两个参数")
        sys.exit(1)
    cyber.init()
    print("client...... ")
    # 3.创建节点；
    client_node = cyber.Node("client_node")
    # 4.创建客户端；
    client = client_node.create_client("addints",AddInts_Request,AddInts_Response)
    # 5.发送数据处理响应；
    req = AddInts_Request()
    req.num1 = int(sys.argv[1])
    req.num2 = int(sys.argv[2])
    response = client.send_request(req)
    print("response sum = %d "%response.sum)
    # 6.等待关闭。
    cyber.shutdown()
```

配置文件BUILD添加内容如下:

```
py_binary(
    name = "demo04_client_py",
    srcs = ["demo04_client_py.py"],
    deps = [
        "//cyber/python/cyber_py3:cyber",
        "//cyber/demo_base_proto:addints_proto_py"
    ] 

)
```

#### 3.编译执行

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
./bazel-bin/cyber/demo_py/demo03_server_py
```

终端B执行订阅方：

```
source cyber/setup.bash
```

```
./bazel-bin/cyber/demo_py/demo04_client_py 30 50
```

最终运行结果与本章引言部分的案例2类似。

