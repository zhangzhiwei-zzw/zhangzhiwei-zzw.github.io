### 2.4.3 定时器组件演示

#### 需求

周期性的执行某种操作，运行效果如下：

![](/assets/019_组件03_定时.gif)

#### 准备

* 在 demo\_cc 目录下新建文件夹：component\_timer，并在 component\_timer下新建BUILD文件。

#### 实现流程

上述需求可以通过定时器组件实现，只要包括如下步骤：

1. 自定义类继承 TimerComponent 类，并重写其 Init\(\) 与 Proc\(\) 函数；
2. 编写 dag 文件与 launch 文件；
3. 编辑BUILD文件；
4. 编译执行。

##### 1.继承并重写 TimerComponent 类

component\_timer 目录下新建 C++ 文件 timer\_cpt.h，输入如下内容：

```cpp
#include "cyber/component/component.h"
#include "cyber/component/timer_component.h"

using apollo::cyber::TimerComponent;
using apollo::cyber::Component;

class MyTimer : public TimerComponent { 
    public:
        bool Init() override;
        bool Proc() override;
    private:
        int seq;
};

CYBER_REGISTER_COMPONENT(MyTimer)
```

component\_timer 目录下新建 C++ 文件 timer\_cpt.cc，输入如下内容：

```cpp
#include "cyber/demo_cc/component_timer/timer_cpt.h"
#include "cyber/component/component.h"

bool MyTimer::Init(){
    AINFO << "timer component init ......";
    seq = 0;
    return true;
}
bool MyTimer::Proc(){
    seq++;
    AINFO << "--------------------------" << seq;

    return true;
}
```

代码解释：

* Init\(\) 函数是用于初始化的，只会执行一次。

* proc\(\)函数在订阅到消息时就会被回调执行。

##### 2.编写 dag 文件与 launch 文件

在 component\_timer 目录下新建 timer.dag 文件，输入如下内容：

```
module_config {
    module_library : "/apollo/bazel-bin/cyber/demo_cc/component_timer/libtimer_cpt.so"
    timer_components {
        class_name : "MyTimer"
        config {
            name : "timer"
            interval : 10
        }
    }
}
```

在 component\_timer 目录下新建 timer.launch 文件，输入如下内容：

```
<cyber>
    <module>
        <name>my_timer</name>
        <dag_conf>/apollo/cyber/demo_cc/component_timer/timer.dag</dag_conf>
        <process_name>my_timer</process_name>
    </module>
</cyber>
```

##### 3.编辑BUILD文件

配置文件BUILD添加内容如下:

```
cc_binary(
    name = "libtimer_cpt.so",
    linkshared = True,
    linkstatic = False,
    deps = [":timer_cpt_lib"],
)

cc_library(
    name = "timer_cpt_lib",
    srcs = ["timer_cpt.cc"],
    hdrs = ["timer_cpt.h"],
    deps = [
        "//cyber",
    ],
)

filegroup(
    name = "conf",
    srcs = [
        ":timer.dag",
        ":timer.launch",
    ],
)
```

##### 4.编译执行

编译：

```
bazel build cyber/demo_cc/component_timer/...
```

终端执行组件：

```
source cyber/setup.bash
```

```
cyber_launch start cyber/demo_cc/component_timer/timer.launch
```

或执行 dag 文件：

```
mainboard -d cyber/demo_cc/component_timer/timer.dag
```

关闭组件\(需要系启动终端\)：

```
source cyber/setup.bash
```

```
cyber_launch stop cyber/demo_cc/component_timer/timer.launch
```

执行结果：终端周期性的循环输出打印语句。

