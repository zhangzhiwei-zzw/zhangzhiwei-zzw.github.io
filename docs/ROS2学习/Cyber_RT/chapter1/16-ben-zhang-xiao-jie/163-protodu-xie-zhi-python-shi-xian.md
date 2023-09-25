### 1.6.3 proto读写之Python实现

本节将介绍如何在 Python 中实现 proto 的读写操作。

大致步骤如下：

1. 编写 Python 源文件；
2. 配置 BUILD 文件；
3. 编译；
4. 执行。

#### 1.编写 Python 源文件

在 demo\_base\_proto 目录下新建 test\_student\_py.py 文件，输入内容如下：

```py
#!/usr/bin/env python3
"""    
    演示 Python中 protobuf 的基本读写使用
"""
from cyber.demo_base_proto.student_pb2 import Student

if __name__ == "__main__":
    # 创建 student 对象
    stu = Student()
    # 写数据
    stu.name = "zhangsan"
    stu.age = 18
    stu.height = 1.80
    stu.books.append("c++")
    stu.books.append("python")
    stu.books.append("Java")

    # 读数据
    print("%s == %d == %.2f " %(stu.name,stu.age,stu.height))
    for book in stu.books:
        print(book)
```

代码解释：

proto 文件生成的对应的 Python 源码中，字段的设置与获取有其默认规则：

1. 如果是非 repeated 规则的字段：那么字段操作可以以属性的方式直接读或写。
2. 如果是 repeated 规则的字段：那么字段可以以列表的方式进行操作。

#### 2.配置 BUILD 文件

BUILD 文件追加如下内容：

```
py_binary(
    name = "test_student_py",
    srcs = ["test_student_py.py"],
    deps = [":student_py"],
)
```

#### 3.编译

运行如下编译命令：

```
bazel build cyber/demo_base_proto/...
```

#### 4.执行

运行如下命令：

```
./bazel-bin/cyber/demo_base_proto/test_student_py
```

终端输出结果：

```
zhangsan == 18 == 1.80 
c++
python
Java
```



