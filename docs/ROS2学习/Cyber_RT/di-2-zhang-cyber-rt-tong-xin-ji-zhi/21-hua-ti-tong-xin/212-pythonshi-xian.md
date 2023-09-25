### 2.1.2 Python实现

#### 1.发布方实现

demo\_py 目录下新建 Python 文件 demo01\_talker\_py.py，输入如下内容：

```py
#!/usr/bin/env python3

'''  
    需求:实现消息发布方，发布数据

    实现:
        1.导包;
        2.初始化cyber框架;
        3.创建节点；
        4.创建发布方；
        5.组织并发送数据；
        6.等待关闭。

'''
from cyber.python.cyber_py3 import cyber
from cyber.demo_base_proto.student_pb2 import Student
import time
def talk():
    # 3.创建节点；
    talker_node = cyber.Node("ergou_py")
    # 4.创建发布方；
    talker = talker_node.create_writer("chatter",Student)
    # 5.组织并发送数据；
    seq = 0
    while not cyber.is_shutdown():
        seq += 1
        print("send message %d" % seq)
        stu = Student()
        stu.name = "huluwa"
        stu.age = seq
        stu.height = 1.78
        stu.books.append("yuwen")
        stu.books.append("shuxue")
        stu.books.append("yingyu")


        talker.write(stu)
        time.sleep(1.0)

if __name__ == "__main__":
    cyber.init()
    #主逻辑封装进函数
    talk()
    cyber.shutdown()
```

BUILD文件:

```
py_binary(
    name = "demo01_talker_py",
    srcs = ["demo01_talker_py.py"],
    deps = [
        "//cyber/python/cyber_py3:cyber",
        "//cyber/demo_base_proto:student_py"
    ] 

)
```

#### 2.订阅方实现

demo\_py 目录下新建 Python 文件 demo02\_listener\_py.py，输入如下内容：

```py
#!/usr/bin/env python3
'''  
    需求:订阅数据
    实现:
        1.导包；
        2.初始化 cyber 框架；
        3.创建订阅节点；
        4.创建订阅方；
        5.处理数据；
        6.等待关闭。

'''
from cyber.python.cyber_py3 import cyber
from cyber.demo_base_proto.student_pb2 import Student

def cb(stu):
    # print(stu)
    print("name = %s age = %d height = %.2f" % (stu.name, stu.age, stu.height))
    for book in stu.books:
        print("book: %s" %book)
    print("-" * 80)

def listen():
    listener_node = cyber.Node("cuihua_py")
    listener = listener_node.create_reader("chatter",Student,cb)
    listener_node.spin()

if __name__ == "__main__":
    cyber.init()
    listen()
    cyber.shutdown()
```

BUILD文件:

```
py_binary(
    name = "demo02_listener_py",
    srcs = ["demo02_listener_py.py"],
    deps = [
        "//cyber/python/cyber_py3:cyber",
        "//cyber/demo_base_proto:student_py"
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
./bazel-bin/cyber/demo_py/demo01_talker_py
```

终端B执行订阅方：

```
source cyber/setup.bash
```

```
./bazel-bin/cyber/demo_py/demo02_listener_py
```

最终运行结果与本章引言部分的案例1类似。

