### 1.5.2 protobuf



##### 2.1 创建 proto 文件

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

**proto 中的字段语法，**字段就格式而言主要有四部分组成：

* 字段规则
* 数据类型
* 字段名称
* 字段编号

**1.字段规则**

字段类型主要有如下三种：

* required —— 调用时，必须提供该字段的值，否则该消息将被视为“未初始化”，不建议使用，当需要把字段修改为其他规则时，会存在兼容性问题。

* optional —— 调用时该字段的值可以设置也可以不设置，不设置时，会根据数据类型生成默认值。

* repeated —— 该规则字段可以以动态数组的方式存储多个数据。

**2.数据类型**

protobuf 中的数据类型与不同的编程语言存在一定的映射关系，具体可参考官方资料，如下：

**3.字段名称**

字段名称就是变量名，其命名规则参考C++中的变量名命名规则即可。

**4.字段编号**

每个字段都有一个唯一编号，用于在消息的二进制格式中标识字段。

##### 2.2 C++ 中调用 proto

##### 

##### 2.3 Python 中调用 proto

---

关于更多 protobuf 的使用与介绍请参考官网：[https://developers.google.com/protocol-buffers](https://developers.google.com/protocol-buffers)

BUILD 补齐插件

自定义的 python 导入无提示。

