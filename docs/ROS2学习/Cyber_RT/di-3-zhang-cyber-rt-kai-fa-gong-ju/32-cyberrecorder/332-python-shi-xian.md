### 3.3.2 Python 实现

#### 1.序列化

demo\_py/tools 目录下新建 Python 文件 demo01\_record\_write\_py.py，输入如下内容：

```py
#!/usr/bin/env python3

"""  
    需求：将 student 消息写入到磁盘文件
    实现：
        1.创建写出对象；
        2.设置写出参数；
        3.打开文件流；
        4.组织消息；
        5.写出消息；
        6.关闭文件流。


"""

from cyber.python.cyber_py3 import cyber
from cyber.python.cyber_py3 import record
from cyber.demo_base_proto.student_pb2 import Student

if __name__ == "__main__":
    cyber.init()
    print("record write ....")
    # 1.创建写出对象；
    writer = record.RecordWriter()
    # 2.设置写出参数；
    writer.set_size_fileseg(0)
    writer.set_intervaltime_fileseg(0)
    # 3.打开文件流；
    writer.open("/apollo/cyber/demo_py/tools/mytest_py.record")
    # 4.组织消息；
    stu = Student()
    stu.name = "haha"
    stu.height = 1.78
    stu.books.append("yuwen")
    stu.books.append("shuxue")
    stu.books.append("yingyu")
    print("full name:%s" %stu.DESCRIPTOR.full_name)
    channel = "chatter_py"
    writer.write_channel(channel,"cyber.demo_base_proto.Student","test....")
    for seq in range(20):
        stu.age = seq
        writer.write_message(channel,stu.SerializeToString(),seq)

    # 5.写出消息；
    # 6.关闭文件流。
    writer.close()
```

配置BUILD文件添加内容如下:

```py
py_binary(
    name = "demo01_record_write_py",
    srcs = ["demo01_record_write_py.py"],
    deps = [
        "//cyber/python/cyber_py3:cyber",
        "//cyber/python/cyber_py3:record",
        "//cyber/demo_base_proto:student_py"
    ] 

)
```

#### 2.反序列化

demo\_py/tools 目录下新建 Python 文件 demo02\_record\_read\_py.py，输入如下内容：

```cpp
#!/usr/bin/env python3
"""  
    需求：将 student 消息写入到磁盘文件
    实现：
        1.创建读取对象；
        2.读消息；
        3.关闭文件流。


"""
from cyber.python.cyber_py3 import cyber
from cyber.python.cyber_py3 import record
from cyber.demo_base_proto.student_pb2 import Student

if __name__ == "__main__":
    cyber.init()
    print("record read ....")
    reader = record.RecordReader("/apollo/cyber/demo_py/tools/mytest_py.record")
    msgs = reader.read_messages()
    count = 0
    for msg in msgs:
        count += 1
        print("=" * 20)
        print("data NO.%d" % count)
        print("channel_name:%s" % msg[0])
        print("msg num %d" % reader.get_messagenumber(msg[0]))
        print("data:%s" % msg[1])
        print("data type:%s" % msg[2])
        print("time %d" % msg[3])

        msg_new = Student()
        msg_new.ParseFromString(msg[1])
        print(msg_new)
```

配置BUILD文件添加内容如下:

```py
py_binary(
    name = "demo02_record_read_py",
    srcs = ["demo02_record_read_py.py"],
    deps = [
        "//cyber/python/cyber_py3:cyber",
        "//cyber/python/cyber_py3:record",
        "//cyber/demo_base_proto:student_py"
    ] 

)
```

#### 3.编译执行

编译：

```
bazel build cyber/demo_py/tools/...
```

执行：

```
source cyber/setup.bash
```

先执行序列化操作（执行完毕将在 demo\_py/tools 目录下生成一个名为 mytest\_py.record 的用于保存消息数据的文件）

```
./bazel-bin/cyber/demo_py/tools/demo01_record_write_py
```

再执行反序列化操作（执行完毕将在终端输出文件中保存的消息内容）

```
./bazel-bin/cyber/demo_py/tools/demo02_record_read_py
```



