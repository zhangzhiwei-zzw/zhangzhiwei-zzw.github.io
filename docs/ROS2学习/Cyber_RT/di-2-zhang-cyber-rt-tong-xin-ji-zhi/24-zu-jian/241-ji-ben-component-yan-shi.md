### 2.4.1 基本组件演示\(上\)

#### 需求

启动之前的消息发布节点，对订阅到的数据进行过滤，只获取其中的姓名和年龄信息并输出到终端，运行效果如下：

![](/assets/017_组件01_数据过滤.gif)

#### 准备

* 保证之前话题通信中的发布方可以正常运行；
* 在 demo\_cc 目录下新建文件夹：component\_common01，并在 component\_common01 下新建BUILD文件。

#### 实现流程

上述需求可以通过组件实现，只要包括如下步骤：

1. 自定义类继承 Component 类，并重写其 Init\(\) 与 Proc\(\) 函数；
2. 编写 dag 文件与 launch 文件；
3. 编辑BUILD文件；
4. 编译执行。

##### 1.继承并重写 Component 类

component\_common01 目录下新建 C++ 文件 common\_cpt.h，输入如下内容：

```cpp
/*  
    组件头文件

*/
#include "cyber/component/component.h"
#include "cyber/demo_base_proto/student.pb.h"

using apollo::cyber::Component;
using apollo::cyber::demo_base_proto::Student;

class CommonCpt : public Component<Student> {
    public:
        bool Init() override;
        bool Proc(const std::shared_ptr<Student>& stu) override;
};
CYBER_REGISTER_COMPONENT(CommonCpt)
```

在 component\_common01 目录下新建 C++ 文件 common\_cpt.cc，输入如下内容：

```cpp
#include "cyber/demo_cc/component_common01/common_cpt.h"

bool CommonCpt::Init() {
    AINFO << "................................... int .........................";
    return true;
}
bool CommonCpt::Proc(const std::shared_ptr<Student>& stu) {
    // AINFO << "do data.....";
    AINFO << "do message:" << stu->name() << " -- " << stu->age();
    return true;
}
```

代码解释：

* 使用的模板与订阅的消息类型一致。

* Init\(\) 函数是用于初始化的，只会执行一次。

* proc\(\)函数在订阅到消息时就会被回调执行。

##### 2.编写 dag 文件与 launch 文件

在 component\_common01 目录下新建 cpt.dag 文件，输入如下内容：

```
# Define all coms in DAG streaming.
    module_config {
    module_library : "/apollo/bazel-bin/cyber/demo_cc/component_common01/lib_common_cpt.so"
    components {
        class_name : "CommonCpt"
        config {
            name : "my_common"
            readers {
                channel: "chatter"
            }
        }
      }
    }
```

在 component\_common01 目录下新建 cpt.launch 文件，输入如下内容：

```
<cyber>
    <module>
        <name>my_common</name>
        <dag_conf>/apollo/cyber/demo_cc/component_common01/cpt.dag</dag_conf>
        <process_name>my_common</process_name>
    </module>
</cyber>
```

##### 3.编辑BUILD文件

配置文件BUILD添加内容如下:

```
package(default_visibility = ["//visibility:public"])


# https://docs.bazel.build/versions/master/be/c-cpp.html#cc_library
cc_library(
    name = "common_cpt_lib",
    srcs = ["common_cpt.cc"],
    hdrs = ["common_cpt.h"],
    deps = [
        "//cyber",
        "//cyber/demo_base_proto:student_cc"
    ],
)

# https://docs.bazel.build/versions/master/be/c-cpp.html#cc_binary
cc_binary(
    name = "lib_common_cpt.so",
    linkshared = True,
    linkstatic = False,
    deps = [":common_cpt_lib"],
)

filegroup(
    name = "conf",
    srcs = [
        ":cpt.dag",
        ":cpt.launch",
    ],
)
```

##### 4.编译执行

编译：

```
bazel build cyber/demo_cc/component_common01/...
```

执行\(需要两个终端\)：

终端A执行发布方：

```
source cyber/setup.bash
```

```
./bazel-bin/cyber/demo_cc/demo01_talker
```

终端B执行组件：

```
source cyber/setup.bash
```

```
cyber_launch start cyber/demo_cc/component_common01/cpt.launch
```

或执行 dag 文件：

```
mainboard -d cyber/demo_cc/component_common01/cpt.dag
```

关闭组件\(需要系启动终端\)：

```
source cyber/setup.bash
```

```
cyber_launch stop cyber/demo_cc/component_common01/cpt.launch
```

执行结果：B中和之前运行结果一致，A中输出对B二次处理的数据。

