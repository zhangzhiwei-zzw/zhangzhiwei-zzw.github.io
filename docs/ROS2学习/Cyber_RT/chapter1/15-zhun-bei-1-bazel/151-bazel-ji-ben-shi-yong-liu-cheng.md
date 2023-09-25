### 1.5.1 Bazel 使用之基本流程

本节将分别演示 C++ 和 Python 中Bazel 的基本使用流程。

#### 1. C++实现

##### 1.新建project目录

在demo\_base\_bazel 目录下新建目录 pro1\_helloworld，再在 pro1\_helloworld 目录下新建WORKSPACE 文件。

##### 2.新建包目录

在 pro1\_helloworld 目录下新建 demo\_pkg 目录，该目录下新建 BUILD 文件。

##### 3.新建源文件

在 demo\_pkg 目录下新建 c++ 源文件 hello\_world.cc，编写内容如下：

```cpp
#include <iostream>

using namespace std;

int main(int argc, char const *argv[])
{
    cout << "hello world" << endl;
    return 0;
}​
```

##### 4.编辑BUILD文件

编辑BUILD文件，编写内容如下：

```
cc_binary(
    name = "hello",
    srcs = ["hello_world.cc"]
)
```

参数：

* name 可执行文件
* srcs 源文件

##### 5.编译

终端下先进入项目目录，也即pro1\_helloworld，常用编译方式有两种。

编译方式1：

```
bazel build //demo_pkg/...
```

上述命令是指编译 demo\_pkg 包下的所有程序，“//” 指代项目根目录\(也即pro1\_helloworld\)，或者也可以不使用"//"。

编译方式2：

```
bazel build //demo_pkg:hello
```

上述命令是指编译 demo\_pkg 包下名为 hello（语法格式为"包名:目标名"） 的程序。

##### 6.执行

编译完成后，在 pro1\_helloworld 目中，会生成一些中间文件，其中 bazel-bin 中有对应的可执行文件，运行该文件即可，常用执行方式有两种：

执行方式1：

```
./bazel-bin/demo_pkg/hello
```

执行方式2：

```
bazel run demo_pkg:hello
```

运行结果：在终端输出文本 hello world。

> 两种执行方式比较，方式1只是执行，后者既编译又执行。

#### 2. Python实现

##### 1.新建project目录

参考 C++ 实现，或者可以直接复用 C++ 实现，本处采用后者。

##### 2.新建包目录

参考 C++ 实现，或者可以直接复用 C++ 实现，本处采用后者。

##### 3.新建源文件

在 demo\_pkg 目录下新建 python 源文件 hello\_world\_py.py，编写内容如下：

```py
#!/usr/bin/env python3

if __name__ == "__main__":
    print("hello world (py)")
```

##### 4.编辑BUILD文件

编辑BUILD文件，编写内容如下：

```
py_binary(
    name = "hello_world_py",
    srcs = ["hello_world_py.py"],
)
```

参数：

* name 可执行文件
* srcs 源文件

##### 5.编译

终端下先进入项目目录，也即pro1\_helloworld，常用编译方式有两种。

编译方式1：

```
bazel build //demo_pkg/...
```

上述命令是指编译 demo\_pkg 包下的所有程序，“//” 指代项目根目录\(也即pro1\_helloworld\)，或者也可以不使用"//"。

编译方式2：

```
bazel build //demo_pkg:hello_world_py
```

上述命令是指编译 demo\_pkg 包下名为 hello\_world\_py（需要参考 BUILD 文件） 的程序。

##### 6.执行

编译完成后，在 pro1\_helloworld 目中，会生成一些中间文件，其中 bazel-bin 中有对应的可执行文件，运行该文件即可，常用执行方式有两种：

执行方式1：

```
./bazel-bin/demo_pkg/hello_world_py
```

执行方式2：

```
bazel run demo_pkg:hello_world_py
```

运行结果：在终端输出文本 hello world \(py\)。

