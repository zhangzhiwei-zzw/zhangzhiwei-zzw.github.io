### 1.5.2 Bazel 使用之库依赖

本部分内容主要介绍Bazel中的库依赖语法，包含同包下的库依赖，以及跨包库依赖。

#### 1. 编写被依赖库实现

首先需要实现被依赖的库的相关文件。

##### 1.新建project目录

在demo\_base\_bazel 目录下新建目录 pro2\_lib，再在 pro2\_lib 目录下新建WORKSPACE 文件。

##### 2.新建包目录

在 pro2\_lib 目录下新建 demo\_lib 目录，该目录下新建 BUILD 文件。

##### 3.新建头文件与源文件

在 demo\_lib 目录下新建 c++ 头文件 hello\_great.h，编写内容如下：

```cpp
#ifndef LIB_HELLO_GREAT_H
#define LIB_HELLO_FREAT_H

#include <string>
std::string get_great(const std::string& name);

#endif
```

在 demo\_lib 目录下新建 c++ 头文件 hello\_great.cc，编写内容如下：

```cpp
#include "hello_great.h"

std::string get_great(const std::string& name){
    return "hello " + name;
}
```

##### 4.编辑BUILD文件

编辑BUILD文件，编写内容如下：

```py
cc_library(
    name = "hello_great",
    srcs = ["hello_great.cc"],
    hdrs = ["hello_great.h"],
)
```

参数：

* name 库文件
* srcs 源文件
* hdrs 头文件

##### 5.编译

终端下进入 pro2\_lib 目录，执行：

```
bazel build //demo_lib/...
```

或

```
bazel build //demo_lib:hello_great
```

在当前项目的 bazel-bin/demo\_lib 目录下将生成相关的库文件。

#### 2. 同包下的库依赖

##### 1.编写C++源文件

承上，在 demo\_lib 目录中新建 hello\_world.cc，需要包含 hello\_great.h 并调用头文件中的 get\_great 函数，内容如下：

```cpp
#include <iostream>
#include "hello_great.h"
using namespace std;
int main(int argc, char const *argv[])
{
    cout << get_great("bazel lib") << endl;
    return 0;
}
```

##### 2.编辑BUILD文件

在 BUILD 文件中追加内容如下：

```
cc_binary(
    name = "hello_world",
    srcs = ["hello_world.cc"],
    deps = [":hello_great"],
)
```

参数：

* deps 依赖项

##### 3.编译

终端下进入 pro2\_lib 目录，执行：

```
bazel build //demo_lib/...
```

或

```
bazel build //demo_lib:hello_world
```

##### 4.执行

执行命令：

```
./bazel-bin/demo_lib/hello_world
```

或

```
bazel run //demo_lib:hello_world
```

终端将输出文本：hello bazel lib 。

#### 3. 跨包库依赖

##### 1.新建包

基于3.1，在 pro2\_lib 下新建包：demo\_main，包下新建BUILD 文件。

##### 2.新建C++源文件

在包 demo\_main 中新建 hello\_world.cc 文件，需要包含 hello\_great.h 并调用头文件中的 get\_great 函数，内容如下：

```cpp
#include <iostream>
#include "demo_lib/hello_great.h"
using namespace std;
int main(int argc, char const *argv[])
{
    cout << get_great("bazel lib") << endl;
    return 0;
}
```

##### 3.编辑BUILD文件

BUILD 文件内容如下：

```
cc_binary(
    name = "hello_world",
    srcs = ["hello_world.cc"],
    deps = ["//demo_lib:hello_great"],
)
```

另外，还需要为 demo\_lib 包添加可访问权限，否则会导致编译失败，修改 demo\_lib/BUILD 文件。

方式1：在 demo\_lib/BUILD 文件中添加函数：

```
package(default_visibility = ["//visibility:public"])
```

方式2：修改 cc\_library 函数内容如下：

```
cc_library(
    name = "hello_great",
    srcs = ["hello_great.cc"],
    hdrs = ["hello_great.h"],
    visibility = ["//demo_main:__pkg__"]
)
```

参数：

* visiility 设置可见度\(权限\)

###### 4.编译

终端下进入 pro2\_lib 目录，执行命令：

```
bazel build //demo_main/...
```

或

```
bazel build //demo_main:hello_world
```

##### 5.执行

执行命令：

```
./bazel-bin/demo_main/hello_world
```

或

```
bazel run //demo_main:hello_world
```

终端将输出文本：hello bazel lib 。

---



