### 1.6.1 proto使用之文件创建

本节会介绍如何创建 proto 文件并生成可被 C++ 和 Python 直接调用的源码文件。

#### 1. 创建 proto 文件

在 /apollo/cyber 目录下新建文件夹 demo\_base\_proto，文件夹下新建文件 student.proto，并输入如下内容：

```cpp
// 使用的 proto 版本, Cyber RT 中目前使用的是 proto2
syntax = "proto2";
//包
package apollo.cyber.demo_base_proto;

//消息 --- message 是关键字，Student 消息名称
message Student {
    //字段
    //字段格式: 字段规则 数据类型 字段名称 字段编号
    required string name = 1;
    optional uint64 age = 2;
    optional double height = 3;
    repeated string books = 4;
}
```

**proto 中的字段语法，**字段就格式而言主要有四部分组成：**字段规则**、**数据类型**、**字段名称**、**字段编号**，接下来分别介绍一下这四种格式。

##### 1.字段规则

字段类型主要有如下三种：

* required —— 调用时，必须提供该字段的值，否则该消息将被视为“未初始化”，不建议使用，当需要把字段修改为其他规则时，会存在兼容性问题。

* optional —— 调用时该字段的值可以设置也可以不设置，不设置时，会根据数据类型生成默认值。

* repeated —— 该规则字段可以以动态数组的方式存储多个数据。

##### 2.数据类型

protobuf 中的数据类型与不同的编程语言存在一定的映射关系，具体可参考官方资料，如下：

![](/assets/013_protobuf数据类型.png)

##### 3.字段名称

字段名称就是变量名，其命名规则参考C++中的变量名命名规则即可。

##### 4.字段编号

每个字段都有一个唯一编号，用于在消息的二进制格式中标识字段。

#### 2. proto文件编译

##### 1.编辑BUILD文件

在 demo\_base\_proto 目录下新建 BUILD 文件，并输入以下内容：

```py
load("//tools:python_rules.bzl", "py_proto_library")
package(default_visibility = ["//visibility:public"])
proto_library(
    name = "student_proto",
    srcs = ["student.proto"]
)

cc_proto_library(
    name = "student_cc",
    deps = [":student_proto"]
)

py_proto_library(
    name = "student_py",
    deps = [":student_proto"]
)
```

代码解释：

1.proto\_library 函数

该函数用于生成 proto 文件对应的库，该库被其他编程语言创建依赖库时所依赖。

参数：

* name  目标名称
* srcs  proto文件

2.cc\_proto\_library 函数

该函数用于生成C++相关的proto依赖库。

参数：

* name 目标名称
* deps 依赖的proto 库名称

3.py\_proto\_library 函数

该函数用于生成Python相关的proto依赖库。

参数：

* name 目标名称
* deps 依赖的proto 库名称

**注意：**

1. 使用py\_proto\_library 必须声明 load\("//tools:python\_rules.bzl", "py\_proto\_library"\)。
2. proto\_library 函数的参数 name 值必须后缀 \_proto 否则，python调用时会抛出异常。
3. 为了方便后期使用，建议先添加语句：package\(default\_visibility = \["//visibility:public"\]\)。

##### 2.编译

终端下进入 /apollo 目录，执行编译命令：

```
bazel build cyber/demo_base_proto/...
```

在 /apollo/bazel-bin/cyber/demo\_base\_proto 下将生成可以被C++和Python调用的中间文件。

![](/assets/014_protobuf中间文件.png)

