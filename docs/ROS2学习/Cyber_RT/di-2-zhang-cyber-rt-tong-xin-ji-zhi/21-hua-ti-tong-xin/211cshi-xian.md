### 2.1.1C++实现

#### 1.发布方实现

demo\_cc 目录下新建 C++ 文件 demo01\_talker.cc，输入如下内容：

```cpp
/*  
    需求: 发布学生相关消息
    实现:
        1.头文件；
        2.初始化 cyber 框架；
        3.创建节点；
        4.创建发布者；
        5.组织数据并发布；
        6.等待关闭。

*/
#include "cyber/cyber.h"
#include "cyber/demo_base_proto/student.pb.h"

using apollo::cyber::demo_base_proto::Student;

int main(int argc, char *argv[])
{
    apollo::cyber::Init(argv[0]);

    // 3.创建节点；
    auto talker_node = apollo::cyber::CreateNode("ergou");
    // 4.创建发布者；
    auto talker = talker_node->CreateWriter<Student>("chatter");
    // 5.组织数据并发布；
    uint64_t seq = 0;//计数器
    apollo::cyber::Rate rate(0.5);
    while (apollo::cyber::OK())
    {
        seq++;
        AINFO << "发布第" << seq << "条数据！";
        // 组织数据
        auto msg = std::make_shared<Student>();
        msg->set_name("huluwa");
        msg->set_age(seq);
        msg->set_height(1.72);
        msg->add_books("chinese");
        msg->add_books("math");
        msg->add_books("english");

        //发布
        talker->Write(msg);
        rate.Sleep();
    }

    // 6.等待关闭。
    apollo::cyber::WaitForShutdown();

    return 0;
}
```

配置BUILD文件添加内容如下:

```py
cc_binary(
    name = "demo01_talker",
    srcs = ["demo01_talker.cc"],
    deps = [
        "//cyber",
        "//cyber/demo_base_proto:student_cc"
    ],
)
```

#### 2.订阅方实现

demo\_cc 目录下新建 C++ 文件 demo02\_listener.cc，输入如下内容：

```cpp
/* 
    需求:订阅发布的消息，并输出
    实现:
        1.头文件；
        2.初始化；
        3.创建节点；
        4.创建订阅方；
        5.回调函数处理数据；
        6.等待关闭。

 */
#include "cyber/cyber.h"
#include "cyber/demo_base_proto/student.pb.h"

using apollo::cyber::demo_base_proto::Student;

void cb(const std::shared_ptr<Student>& stu){
    AINFO << "name: " << stu->name();
    AINFO << "age: " << stu->age();
    AINFO << "height: " << stu->height();
    for (int i = 0; i < stu->books_size(); i++)
    {
        AINFO << "books: " << stu->books(i);
    }

    AINFO << "-----------------------------------------";
}
int main(int argc, char *argv[])
{
    // 2.初始化；
    apollo::cyber::Init(argv[0]);
    AINFO << "订阅方创建.....";
    // 3.创建节点；
    auto listener_node = apollo::cyber::CreateNode("cuihua");
    // 4.创建订阅方；
    auto listener = listener_node->CreateReader<Student>("chatter",cb);
    // 5.回调函数处理数据；
    // 6.等待关闭。
    apollo::cyber::WaitForShutdown();

    return 0;
}
```

配置文件BUILD添加内容如下:

```py
cc_binary(
    name = "demo02_listener",
    srcs = ["demo02_listener.cc"],
    deps = [
        "//cyber",
        "//cyber/demo_base_proto:student_cc"
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
./bazel-bin/cyber/demo_cc/demo01_talker
```

终端B执行订阅方：

```
source cyber/setup.bash
```

```
./bazel-bin/cyber/demo_cc/demo02_listener
```

最终运行结果与本章引言部分的案例1类似。

