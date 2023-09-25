## 2.3 参数

#### 概念

以共享的方式实现不同节点之间数据交互的通信模式。

参数服务器是基于服务实现的，包含客户端和服务器端，服务端节点可以存储数据，客户端节点可以访问服务端节点操作数据，这个过程虽然基于请求响应的，但是无需自己实现请求与响应，此过程已经被封装，调用者只需要通过比较简单友好的API就可以实现参数操作。

#### 作用

存储一些多节点共享的数据，类似于全局变量。

---

#### 需求

创建两个节点A与B，节点A作为参数服务端，节点B作为参数客户端，在节点A存储数据\(车辆参数\)，节点B操作数据。

#### 流程

在实现流程上，C++ 和 Python 实现的基本一致，大致步骤如下：

* 创建参数服务器服务端

* 创建参数服务器客户端

* 编译并执行

---

#### 参数说明:

**关于参数所支持的数据类型**

Cyber RT 中通过apollo::cyber::Parameter封装参数，下列表格列出了所支持的参数类型，以及对应的 C++ 和 protobuf 中的数据类型。

| Parameter type | C++ data type | protobuf data type |
| :--- | :--- | :--- |
| apollo::cyber::proto::ParamType::INT | int64\_t | int64 |
| apollo::cyber::proto::ParamType::DOUBLE | double | double |
| apollo::cyber::proto::ParamType::BOOL | bool | bool |
| apollo::cyber::proto::ParamType::STRING | std::string | string |
| apollo::cyber::proto::ParamType::PROTOBUF | std::string | string |
| apollo::cyber::proto::ParamType::NOT\_SET | - | - |

除了上述 5 种类型之外，Parameter 还支持以 protobuf 对象作为传入参数的接口。执行后的序列化处理对象并将其转换为 STRING 类型以进行传输。

