### 1.4.2 Python实现HelloWorld

#### 1.编写源文件

demo\_py 目录下新建文件demo00\_helloworld\_py.py，编写如下内容：

```py
#!/usr/bin/env python3
from cyber.python.cyber_py3 import cyber

if __name__ == "__main__":
    cyber.init()
    print("hello apollo!")
```

#### 2.编辑配置文件

demo\_py 目录下新建BUILD文件，编写如下内容：

```
py_binary(
    name = "demo00_helloworld_py",
    srcs = ["demo00_helloworld_py.py"],
    deps = [
        "//cyber/python/cyber_py3:cyber"
    ],
)
```

#### 3.编译

容器终端下，输入命令：

```
bazel build cyber/demo_py/...
```

#### 4.执行

容器终端下，输入命令：

```
source cyber/setup.bash
```

```
./bazel-bin/cyber/demo_py/demo00_helloworld_py
```

终端输出文本：hello world!

---



