### 3.2.1 C++ 实现

#### 1.序列化

demo\_cc/tools 目录下新建C++ 文件 demo01\_record\_write.cc，输入如下内容：

```cpp
/*  

    将话题消息写入磁盘文件。
    实现:
        1.初始化 cyber 框架;
        2.创建 recorder 写对象；
        3.设置写出参数；
        4.打开文件流；
        5.写出消息类型以及消息数据；
        6.关闭文件流。


*/
#include "cyber/cyber.h"
#include "cyber/record/record_writer.h"
#include "cyber/demo_base_proto/student.pb.h"
using apollo::cyber::record::RecordWriter;

int main(int argc, char *argv[])
{

    apollo::cyber::Init(argv[0]);
    AINFO << "record 写操作演示...";
    // 2.创建 recorder 写对象；
    RecordWriter writer;
    // 3.设置写出参数；
    writer.SetSizeOfFileSegmentation(0);
    writer.SetIntervalOfFileSegmentation(0);
    // 4.打开文件流；
    writer.Open("/apollo/cyber/demo_cc/tools/mytest.record");
    AINFO << "file : " << writer.GetFile();

    // 5.写出消息类型以及消息数据；
    std::string channel = "chatter";
    writer.WriteChannel(channel,"apollo.cyber.demo_base_proto.Student","test ....");
    // writer.WriteMessage    
    for (size_t i = 0; i < 100; i++)
    {
        auto stu = std::make_shared<apollo::cyber::demo_base_proto::Student>();
        stu->set_name("huluwa");
        stu->add_books("yingyu");
        stu->add_books("yuwen");
        // stu->SerializeAsString();
        std::string content;
        stu->SerializeToString(&content);
        writer.WriteMessage(channel,content,i);
        // writer.WriteMessage(channel,stu->SerializeAsString(),i);

    }

    // 6.关闭文件流。
    writer.Close();


    return 0;
}
```

配置BUILD文件添加内容如下:

```
cc_binary(
    name = "demo01_record_write",
    srcs = ["demo01_record_write.cc"],
    deps = [
        "//cyber",
        "//cyber/demo_base_proto:student_cc",
    ],
)
```

#### 2.反序列化

demo\_cc/tools 目录下新建C++ 文件 demo02\_record\_read.cc，输入如下内容：

```cpp
#include "cyber/cyber.h"
#include "cyber/record/record_reader.h"
#include "cyber/record/record_message.h"

using apollo::cyber::record::RecordReader;
using apollo::cyber::record::RecordMessage;
int main(int argc, char *argv[])
{
    apollo::cyber::Init(argv[0]);

    AINFO << "record 读操作演示...";
    RecordReader reader("/apollo/cyber/demo_cc/tools/mytest.record");
    std::string channel = "chatter";
    uint64_t msg_count = reader.GetMessageNumber(channel);
    AINFO << "总共" << msg_count << "条消息";
    std::string msg_type = reader.GetMessageType(channel);
    std::string msg_desc = reader.GetProtoDesc(channel);
    AINFO << "消息类型:" << msg_type;
    AINFO << "消息描述:" << msg_desc;
    RecordMessage msg;
    for (size_t i = 0; i < msg_count; i++)
    {
        if(reader.ReadMessage(&msg)){
            AINFO << "第" << i << "条消息 -> " 
                  << "channel name: " << msg.channel_name
                  << "; content: " << msg.content
                  << "; msg time: " << msg.time;
        } else  {
            AINFO << "消息读取失败.....";
        }
    }


    return 0;
}
```

配置BUILD文件添加内容如下:

```
cc_binary(
    name = "demo02_record_read",
    srcs = ["demo02_record_read.cc"],
    deps = [
        "//cyber",
        "//cyber/demo_base_proto:student_cc",
    ],
)
```

#### 3.编译执行

编译：

```
bazel build cyber/demo_cc/tools/...
```

执行：

```
source cyber/setup.bash
```

先执行序列化操作（执行完毕将在 demo\_cc/tools 目录下生成一个名为 mytest.record 的用于保存消息数据的文件）

```
./bazel-bin/cyber/demo_cc/tools/demo01_record_write
```

再执行反序列化操作（执行完毕将在终端输出文件中保存的消息内容）

```
./bazel-bin/cyber/demo_cc/tools/demo02_record_read
```



