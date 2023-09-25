### 1.6.2 proto读写之C++实现

本节将介绍如何在 C++ 中实现 proto 的读写操作。

大致步骤如下：

1. 编写 C++ 源文件；
2. 配置 BUILD 文件；
3. 编译；
4. 执行。

#### 1.编写 C++ 源文件

在 demo\_base\_proto 目录下新建 test\_student.cc 文件，输入内容如下：

```cpp
/*  
    演示 C++中 protobuf 的基本读写使用
*/
#include "cyber/demo_base_proto/student.pb.h"

int main(int argc, char const *argv[])
{
    //创建对象
    apollo::cyber::demo_base_proto::Student stu;
    //数据写
    stu.set_name("zhangsan");
    stu.set_age(18);
    stu.set_height(1.75);
    stu.add_books("yuwen");
    stu.add_books("c++");
    stu.add_books("Python");

    //数据读
    std::string name = stu.name();
    uint64_t age = stu.age();
    double height = stu.height();
    std::cout << name << " == " << age << " == " << height << " == "; 
    for (int i = 0; i < stu.books_size(); i++)
    {
        std::cout << stu.books(i) << "-";
    }
    std::cout << std::endl;

    return 0;
}
```

代码解释：

proto 文件生成的对应的 C++ 源码中，字段的设置与获取有其默认规则：

1. 如果是非 repeated 规则的字段：那么字段值的设置函数对应的格式为：set\_xxx\(value\)，获取函数对应的格式为xxx\(\)。
2. 如果是 repeated 规则的字段：那么字段值的设置函数对应的格式为：add\_xxx\(\)，获取函数对应的格式为xxx\(索引\)，另外还可以通过函数 xxx\_size\(\) 获取数组中元素的个数。

其中 xxx 为字段名称。

#### 2.配置 BUILD 文件

BUILD 文件追加如下内容：

```
cc_binary(
    name = "test_student",
    srcs = ["test_student.cc"],
    deps = [":student_cc"],
)
```

#### 3.编译

运行如下编译命令：

```
bazel build cyber/demo_base_proto/...
```

#### 4.执行

运行如下命令：

```
./bazel-bin/cyber/demo_base_proto/test_student
```

终端输出结果：zhangsan == 18 == 1.75 == yuwen-c++-Python-

