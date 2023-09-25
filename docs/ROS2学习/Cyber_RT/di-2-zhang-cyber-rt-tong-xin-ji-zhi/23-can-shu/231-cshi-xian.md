### 2.3.1 C++实现

#### 1.参数服务端

demo\_cc 目录下新建 C++ 文件 demo05\_param\_server.cc，输入如下内容：

```cpp
/*  
    需求: 服务端设置参数，客户端操作参数
    实现:
        1.包含头文件；
        2.初始化 cyber 框架；
        3.创建节点；
        4.创建参数服务端；
        5.设置参数；
        6.等待关闭。


*/
#include "cyber/cyber.h"
#include "cyber/parameter/parameter_server.h"

using apollo::cyber::ParameterServer;
using apollo::cyber::Parameter;

int main(int argc, char *argv[])
{
    apollo::cyber::Init(argv[0]);
    AINFO << "参数服务端";
    // 3.创建节点；
    std::shared_ptr<apollo::cyber::Node> param_service_node = apollo::cyber::CreateNode("param");
    // 4.创建参数服务端；
    auto param_service = std::make_shared<ParameterServer>(param_service_node);
    // 5.设置参数；
    param_service->SetParameter(Parameter("type","apool_car"));
    param_service->SetParameter(Parameter("height",1.65));
    param_service->SetParameter(Parameter("lasers",4));

    //获取指定参数
    Parameter temp;
    param_service->GetParameter("type",&temp);
    AINFO << temp.Name() << ":" << temp.AsString();
    param_service->GetParameter("height",&temp);
    AINFO << temp.Name() << ":" << temp.AsDouble();
    param_service->GetParameter("lasers",&temp);
    AINFO << temp.Name() << ":" << temp.AsInt64();

    //获取所有参数
    std::vector<Parameter> params;
    param_service->ListParameters(&params);
    for (auto &&param : params)
    {
        AINFO << param.Name() << " = " << param.TypeName();
    }

    // 6.等待关闭。
    apollo::cyber::WaitForShutdown();
    return 0;
}
```

配置文件BUILD添加内容如下:

```
cc_binary(
    name = "demo05_param_server",
    srcs = ["demo05_param_server.cc"],
    deps = [
        "//cyber",
        "//cyber/parameter"
    ],
)
```

#### 2.参数客户端

demo\_cc 目录下新建 C++ 文件 demo06\_param\_client.cc，输入如下内容：

```py
/*  
    需求: 服务端设置参数，客户端操作参数
    实现:
        1.包含头文件；
        2.初始化 cyber 框架；
        3.创建节点；
        4.创建参数客户端；
        5.操作参数；
        6.等待关闭。
*/
#include "cyber/cyber.h"
#include "cyber/parameter/parameter_client.h"

using apollo::cyber::ParameterClient;
using apollo::cyber::Parameter;
int main(int argc, char *argv[])
{
    apollo::cyber::Init(argv[0]);
    AINFO << "参数客户端";
    // 3.创建节点；
    std::shared_ptr<apollo::cyber::Node> param_client_node = apollo::cyber::CreateNode("param_client_node");
    // 4.创建参数客户端；
    auto param_client = std::make_shared<ParameterClient>(param_client_node,"param");
    // 5.操作参数；
    //
    Parameter temp;
    param_client->GetParameter("type",&temp);
    AINFO << temp.Name() <<" = " <<temp.AsString();
    param_client->GetParameter("height",&temp);
    AINFO << temp.Name() <<" = " <<temp.AsDouble();
    param_client->GetParameter("lasers",&temp);
    AINFO << temp.Name() <<" = " <<temp.AsInt64();
    //
    param_client->SetParameter(Parameter("lasers",1));
    AINFO << "修改后...";
    param_client->GetParameter("lasers",&temp);
    AINFO << temp.Name() <<" = " <<temp.AsInt64();

    //
    std::vector<Parameter> ps;
    param_client->ListParameters(&ps);
    for (auto &&p : ps)
    {
        AINFO <<"参数名称:" << p.Name() << ";参数类型:" << p.TypeName();
    }

    // 6.等待关闭。
    apollo::cyber::WaitForShutdown();
    return 0;
}
```

配置文件BUILD添加内容如下:

```
cc_binary(
    name = "demo06_param_client",
    srcs = ["demo06_param_client.cc"],
    deps = [
        "//cyber",
        "//cyber/parameter"
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
./bazel-bin/cyber/demo_cc/demo05_param_server
```

终端B执行订阅方：

```
source cyber/setup.bash
```

```
./bazel-bin/cyber/demo_cc/demo06_param_client
```

执行结果：参数服务端和客户端都会输出参数相关信息。

