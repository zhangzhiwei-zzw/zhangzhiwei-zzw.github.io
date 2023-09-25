## 1.6 预备知识——protobuf

在 Apollo Cyber RT 中使用到了 protobuf，鉴于部分同学之前并没有接触过，所以本节会介绍其简单使用，如果以前已经有所了解，本部分内容可以直接略过。

在前面我们安装完  Apollo Cyber RT 之后，运行了内置的发布订阅例程，发布方可以发布一组数据，订阅方可以接收到数据，那么数据是如何在二者之间传输的呢？在 Cyber RT 中就是使用 protobuf 实现的。

#### 1.protobuf 简介

##### 概念

protobuf 全称 Protocol buffers，是 Google 研发的一种跨语言、跨平台的序列化数据结构的方式，是一个灵活的、高效的用于序列化数据的协议。

##### 特点

在序列化数据时常用的数据格式还有 XML、JSON等，相比较而言，protobuf 更小、效率更高且使用更为便捷，protobuf内置编译器，可以将protobuf 文件编译成 C++、Python、Java、C\#、Go 等多种语言对应的代码，然后可以直接被对应语言使用，轻松实现对数据流的读或写操作而不需要再做特殊解析。

Protobuf 的优点如下：

1. **高效  —— **序列化后字节占用空间比XML少3-10倍，序列化的时间效率比XML快20-100倍；
2. **便捷  —— **可以将结构化数据封装为类，使用方便；
3. **跨语言  —— **支持多种编程语言；
4. **高兼容性  —— **当数据交互的双方使用同一数据协议，如果一方修改了数据结构，不影响另一方的使用。

Protobuf 也有缺点：

1. 二进制格式易读性差；
2. 缺乏自描述。

#### 2.基本使用流程

在bazel中已经集成了protobuf的编译器，所以我们直接使用即可，接下来我们就通过一个案例来演示 protobuf 的基本使用，需求如下：

> 创建 protobuf 文件，在该文件中需要生命学生的姓名、年龄、身高、所有的书籍......等信息，然后分别使用C++和Python实现学生数据的读写操作。

该需求实现大致流程如下：

1. 编写proto文件；
2. 配置BUILD文件，编译生成对应的C++或Python文件；
3. 在C++或Python中调用。

同一proto文件，是可以被多种语言使用的，所以在演示 C++ 和 Python 调用 proto 之前，我们可以编写proto文件并通过案例来学习一些proto的基本语法，后学习如何在C++ 和 Python 中调用 proto。

---

官网：[https://developers.google.com/protocol-buffers](https://developers.google.com/protocol-buffers)

