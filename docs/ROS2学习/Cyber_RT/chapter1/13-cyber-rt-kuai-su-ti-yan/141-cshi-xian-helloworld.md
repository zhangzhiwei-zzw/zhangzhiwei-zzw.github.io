### 1.4.1 c++实现HelloWorld

#### 1.编写源文件

demo\_cc 目录下新建文件demo00\_helloworld.cc，编写如下内容：

```cpp
#include "cyber/cyber.h"
/*      
    需求: 在控制台输出文本HelloWorld;
*/

int main(int argc, char *argv[])
{
    apollo::cyber::Init(argv[0]);
    AINFO << "hello world!";    
    return 0;
}
```

#### 2.编辑配置文件

demo\_cc 目录下新建BUILD文件，编写如下内容：

```py
cc_binary(
    name = "demo00_helloworld",
    srcs = ["demo00_helloworld.cc"],
    deps = ["//cyber"],
)
```

#### 3.编译

容器终端下，输入命令：

```
bazel build cyber/demo_cc/...
```

#### 4.执行

容器终端下，输入命令：

```
source cyber/setup.bash
```

```
./bazel-bin/cyber/demo_cc/demo00_helloworld
```

终端输出文本：hello world!

