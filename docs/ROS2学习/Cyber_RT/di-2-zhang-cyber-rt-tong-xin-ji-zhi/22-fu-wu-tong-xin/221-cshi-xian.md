### 2.2.1 C++实现

#### 1.服务端实现

demo\_cc 目录下新建 C++ 文件 demo03\_server.cc，输入如下内容：

```cpp
/*  
    需求:客户端发送请求，提交两个整数，服务端接收请求，提取数字，相加后
        将结果响应回客户端；
    实现:
        1.包含头文件；
        2.初始化；
        3.创建节点；
        4.创建服务方；
        5.数据处理；
        6.等待关闭；


*/
#include "cyber/cyber.h"
#include "cyber/demo_base_proto/addints.pb.h"

using apollo::cyber::demo_base_proto::AddInts_Request;
using apollo::cyber::demo_base_proto::AddInts_Response;
void cb(const std::shared_ptr<AddInts_Request>& request,const std::shared_ptr<AddInts_Response>& response){
    //处理请求，产生响应
    int64_t num1 = request -> num1();
    int64_t num2 = request -> num2();
    AINFO << "客户端请求num1="<< num1 << ",num2=" << num2;
    //求和并设置响应
    int16_t sum = num1 + num2;
    response->set_sum(sum);
}
int main(int argc, char *argv[])
{
    apollo::cyber::Init(argv[0]);
    AINFO << "服务端执行....";
    // 3.创建节点；
    auto server_node = apollo::cyber::CreateNode("server_node");
    // 4.创建服务方；
    auto server = server_node->CreateService<AddInts_Request,AddInts_Response>("addints",cb);   
    // 5.数据处理；

    // 6.等待关闭；
    apollo::cyber::WaitForShutdown();
    return 0;
}
```

配置文件BUILD添加内容如下:

```
cc_binary(
    name = "demo03_server",
    srcs = ["demo03_server.cc"],
    deps = [
        "//cyber",
        "//cyber/demo_base_proto:addints_proto_cc"
    ],
)
```

#### 2.客户端实现

demo\_cc 目录下新建 C++ 文件 demo04\_client.cc，输入如下内容：

```py
/*  
    需求:客户端发送数据并处理响应
    实现:
        1.包含头文件；
        2.初始化 cyber；
        3.创建客户端节点；
        4.创建发布方；
        5.发送数据；
        6.等待关闭。
*/
#include "cyber/cyber.h"
#include "cyber/demo_base_proto/addints.pb.h"

using apollo::cyber::demo_base_proto::AddInts_Request;
using apollo::cyber::demo_base_proto::AddInts_Response;

int main(int argc, char *argv[])
{


    apollo::cyber::Init(argv[0]);
    // 处理输入的参数   
    if (argc != 3)
    {
        AINFO << "执行程序时请输入两个数字作为参数";
        return 1;
    }

    AINFO << "客户端....";   
    // 3.创建客户端节点；
    auto client_node = apollo::cyber::CreateNode("client_node");
    // 4.创建发布方；
    auto client = client_node -> CreateClient<AddInts_Request,AddInts_Response>("addints");
    // 5.发送数据；
    AINFO << "等待服务启动";
    auto request = std::make_shared<AddInts_Request>();
    request -> set_num1(atoll(argv[1]));
    request -> set_num2(atoll(argv[2]));
    auto flag = client -> WaitForService(std::chrono::duration<long int>(10));
    // client->ServiceIsReady
    if(flag){
        AINFO << "服务已经启动";
        AINFO << "发送num1 = " << request->num1() << ",num2 = " << request->num2(); 
        auto response = client -> SendRequest(request);
        //处理响应
        AINFO << "响应结果:sum = " << response->sum();
    } else {
        AINFO << "服务未启动";
    }
    // 6.等待关闭。 
    apollo::cyber::WaitForShutdown();
    return 0;
}
```

配置文件BUILD添加内容如下:

```
cc_binary(
    name = "demo04_client",
    srcs = ["demo04_client.cc"],
    deps = [
        "//cyber",
        "//cyber/demo_base_proto:addints_proto_cc"
    ],
)
```

#### 3.编译执行

编译：

```
bazel build cyber/demo_cc/...
```

执行\(需要两个终端\)：

终端A执行发布方：

```
source cyber/setup.bash
```

```
./bazel-bin/cyber/demo_cc/demo03_server
```

终端B执行订阅方：

```
source cyber/setup.bash
```

```
./bazel-bin/cyber/demo_cc/demo04_client 30 50
```

最终运行结果与本章引言部分的案例2类似。

