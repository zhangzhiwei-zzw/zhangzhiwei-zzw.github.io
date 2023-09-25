### 2.4.2 基本组件演示\(下\)

#### 需求

现无人车前后各安装了一颗雷达，雷达可以发布障碍物消息，需要将两颗雷达发送的消息进行融合，运行效果如下：

![](/assets/018_组件02_数据融合.gif)

#### 准备

* 编写两个节点，分别模拟前后雷达发送障碍物消息；
* 在 demo\_cc 目录下新建文件夹：component\_common02，并在 component\_common02 下新建BUILD文件。

模拟雷达消息发布实现如下：

##### 1.定义雷达消息

demo\_base\_proto 目录下新建 lasers.proto，输入如下内容：

```cpp
syntax = "proto2";

package apollo.cyber.demo_base_proto;

message Lasers {
    required uint64 seq = 1;
    required uint64 count = 2;
}
```

配置文件BUILD添加内容如下:

```
proto_library(
    name = "lasers_proto",
    srcs = ["lasers.proto"]
)
cc_proto_library(
    name = "lasers_proto_cc",
    deps = [
        ":lasers_proto",
    ],
)
py_proto_library(
    name = "lasers_proto_py",
    deps = [
        ":lasers_proto",
    ],
)
```

##### 2.分别编写前后雷达消息发送节点

component\_common02 目录下新建 C++ 文件 front\_laser.cc，输入如下内容：

```cpp
/*  
    前置雷达发布
*/

#include "cyber/cyber.h"
#include "cyber/demo_base_proto/lasers.pb.h"

using apollo::cyber::demo_base_proto::Lasers;


int main(int argc, char *argv[])
{
    apollo::cyber::Init(argv[0]);
    AINFO << "模拟前雷达节点....";
    auto pub_node = apollo::cyber::CreateNode("front_laser_node");
    auto pub = pub_node->CreateWriter<Lasers>("/front/laser");
    apollo::cyber::Rate rate(1.0);
    auto lasers = std::make_shared<Lasers>();
    lasers->set_count(2);
    uint64_t seq = 0;
    while (apollo::cyber::OK())
    {
        seq++;
        lasers->set_seq(seq);
        pub->Write(lasers);
        rate.Sleep();
    }

    apollo::cyber::WaitForShutdown();

    return 0;
}
```

component\_common02 目录下新建 C++ 文件 back\_laser.cc，输入如下内容：

```cpp
/*  
    前置雷达发布
*/

#include "cyber/cyber.h"
#include "cyber/demo_base_proto/lasers.pb.h"

using apollo::cyber::demo_base_proto::Lasers;


int main(int argc, char *argv[])
{
    apollo::cyber::Init(argv[0]);
    AINFO << "模拟后雷达节点....";
    auto pub_node = apollo::cyber::CreateNode("back_laser_node");
    auto pub = pub_node->CreateWriter<Lasers>("/back/laser");
    apollo::cyber::Rate rate(0.2);
    auto lasers = std::make_shared<Lasers>();
    lasers->set_count(3);
    uint64_t seq = 0;
    while (apollo::cyber::OK())
    {
        seq++;
        lasers->set_seq(seq);
        pub->Write(lasers);
        rate.Sleep();
    }

    apollo::cyber::WaitForShutdown();

    return 0;
}
```

配置文件BUILD添加内容如下:

```
cc_binary(
    name = "front_laser",
    srcs = ["front_laser.cc"],
    deps = [
        "//cyber",
        "//cyber/demo_base_proto:lasers_proto_cc"
    ],
)
cc_binary(
    name = "back_laser",
    srcs = ["back_laser.cc"],
    deps = [
        "//cyber",
        "//cyber/demo_base_proto:lasers_proto_cc"
    ],
)
```

接下来可以编译并执行，以测试程序是否正确。

---

#### 实现流程

上述需求可以通过组件实现，只要包括如下步骤：

1. 自定义类继承 Component 类，并重写其 Init\(\) 与 Proc\(\) 函数；
2. 编写 dag 文件与 launch 文件；
3. 编辑BUILD文件；
4. 编译执行。

##### 1.继承并重写 Component 类

component\_common02 目录下新建 C++ 文件 lasers\_cpt.h，输入如下内容：

```cpp
#include "cyber/component/component.h"
#include "cyber/demo_base_proto/lasers.pb.h"


using apollo::cyber::Component;
using apollo::cyber::demo_base_proto::Lasers;

class LaserCpt : public Component<Lasers,Lasers> {
    public:
        bool Init() override;
        bool Proc(const std::shared_ptr<Lasers>& front_laser,const std::shared_ptr<Lasers>& back_laser) override;
    private:
        std::shared_ptr<apollo::cyber::Writer<Lasers>> pub = nullptr;
        uint64_t seq;
};
CYBER_REGISTER_COMPONENT(LaserCpt)
```

在 component\_common02 目录下新建 C++ 文件 lasers\_cpt.cc，输入如下内容：

```cpp
#include "cyber/demo_cc/component_common02/lasers_cpt.h"

using apollo::cyber::demo_base_proto::Lasers;
bool LaserCpt::Init(){
    AINFO << ".....lasers filter init.......";
    pub = this->node_->CreateWriter<Lasers>("/laser");
    seq = 0;
    return true;
}

bool LaserCpt::Proc(const std::shared_ptr<Lasers>& front_laser,const std::shared_ptr<Lasers>& back_laser){
    uint64_t seq_front = front_laser->seq();
    uint64_t seq_back = back_laser->seq();
    uint64_t num_front = front_laser->count();
    uint64_t num_back = back_laser->count();
    uint64_t sum = num_back + num_front;
    AINFO << "total sum = " << sum << ", front seq = " << seq_front << ", back seq = " << seq_back;

    seq++;

    auto laser = std::make_shared<Lasers>();
    laser->set_seq(seq);
    laser->set_count(sum);
    pub->Write(laser);

    return true;
}
```

代码解释：

* 使用的模板与订阅的消息类型一致，此处为两通道数据，最多可以支持四通道数据。

* Init\(\) 函数是用于初始化的，只会执行一次。

* proc\(\)函数在订阅到消息时就会被回调执行。

##### 2.编写 dag 文件与 launch 文件

在 component\_common02 目录下新建 cpt2.dag 文件，输入如下内容：

```
# Define all coms in DAG streaming.
    module_config {
    module_library : "/apollo/bazel-bin/cyber/demo_cc/component_common02/lib_lasers_cpt.so"
    components {
        class_name : "LaserCpt"
        config {
            name : "my_common2"
            readers {
                channel: "/front/laser"
            }
            readers {
                channel: "/back/laser"
            }
        }
      }
    }
```

在 component\_common02 目录下新建 cpt2.launch 文件，输入如下内容：

```
<cyber>
    <module>
        <name>my_common2</name>
        <dag_conf>/apollo/cyber/demo_cc/component_common02/cpt2.dag</dag_conf>
        <process_name>my_common2</process_name>
    </module>
</cyber>
```

##### 3.编辑BUILD文件

配置文件BUILD添加内容如下:

```
package(default_visibility = ["//visibility:public"])



# https://docs.bazel.build/versions/master/be/c-cpp.html#cc_library
cc_library(
    name = "lasers_cpt_lib",
    srcs = ["lasers_cpt.cc"],
    hdrs = ["lasers_cpt.h"],
    deps = [
        "//cyber",
        "//cyber/demo_base_proto:lasers_proto_cc"
    ],
)
# https://docs.bazel.build/versions/master/be/c-cpp.html#cc_binary
cc_binary(
    name = "lib_lasers_cpt.so",
    linkshared = True,
    linkstatic = False,
    deps = [":lasers_cpt_lib"],
)
filegroup(
    name = "conf",
    srcs = [
        ":cpt2.dag",
        ":cpt2.launch",
    ],
)
```

##### 4.编译执行

编译：

```
bazel build cyber/demo_cc/component_common02/...
```

执行\(需要三个终端\)：

终端A执行前雷达发布方：

```
source cyber/setup.bash
```

```
./bazel-bin/cyber/demo_cc/component_common02/front_laser
```

终端B执行后雷达发布方：

```
source cyber/setup.bash
```

```
./bazel-bin/cyber/demo_cc/component_common02/back_laser
```

终端C执行组件：

```
source cyber/setup.bash
```

```
cyber_launch start cyber/demo_cc/component_common02/cpt2.launch
```

或执行 dag 文件：

```
mainboard -d cyber/demo_cc/component_common02/cpt2.dag
```

关闭组件\(需要系启动终端\)：

```
source cyber/setup.bash
```

```
cyber_launch stop cyber/demo_cc/component_common02/cpt2.launch
```

执行结果：会对前后雷达检测到的障碍物进行融合。

