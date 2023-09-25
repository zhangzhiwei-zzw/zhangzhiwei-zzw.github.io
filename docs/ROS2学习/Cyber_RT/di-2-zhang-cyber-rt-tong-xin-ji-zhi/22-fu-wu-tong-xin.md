## 2.2 服务通信

#### 概念

以请求响应的方式实现不同节点之间数据交互的通信模式。

#### 作用

用于偶然的、对时时性有要求、有一定逻辑处理需求的数据传输场景。

---

#### 需求

客户端发送请求提交两个整型数字，服务端处理请求提取两个数字求和，并将结果响应回客户端。

![](/assets/016_服务实现.gif)

#### 流程

在实现流程上，C++ 和 Python 实现的基本一致，大致步骤如下：

* 编写消息载体\(protobuf文件\)并配置；

* 编写发布方并配置；

* 编写订阅方并配置；

* 编译并执行。

#### 准备

我们需要先准备作为数据载体的 proto 文件，在demo\_base\_proto目录下，新建文件:addints.proto，内容如下:

```
syntax = "proto2";
package apollo.cyber.demo_base_proto;

message AddInts_Request {
    required int64 num1 = 1;
    required int64 num2 = 2;
}

message AddInts_Response {
    required int64 sum = 1;
}
```

上述文件中，包含两种消息类型，AddInts\_Request 是用于客户端向服务端发送请求的数据类型，AddInts\_Response 是用于服务端向客户端发送响应的数据类型。

BUILD中添加如下内容:

```
proto_library(
    name = "addints_proto",
    srcs = ["addints.proto"]
)
cc_proto_library(
    name = "addints_proto_cc",
    deps = [
        ":addints_proto",
    ],
)
py_proto_library(
    name = "addints_proto_py",
    deps = [
        ":addints_proto",
    ],
)
```

验证文件编写是否正确，先编译:

```
bazel build cyber/demo_base_proto/...
```

如无异常，生成消息相关文件: addints.pb.h、addints.pb.cc和addints\_pb2.py。

