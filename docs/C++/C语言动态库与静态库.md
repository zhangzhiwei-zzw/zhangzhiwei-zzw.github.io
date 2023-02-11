# C语言动态库与静态库

## 一、动态编译与静态编译

动态编译使用的是动态库文件进行编译，默认使用的是动态编译方法。

```shell
gcc hello.c -o hello
```

静态编译使用的是静态库文件进行的编译

```shell
gcc -static hello.c -o hello
```

静态编译要把静态库文件打包编译到可执行程序中，动态编译不会把动态库文件打包编译到可执行程序中，它们只是编译链接关系。

## 二、制作静态库

首先看一个例子，有一下三个c语言文件，mylib.c、mylib.h、mytest.c。mylib.h做函数的声明，mylib.c做函数的定义，mytest.c做功能的测试。

mylib.c

```c
int max(int x,int y)
{
        return x>y?x:y;
}
int min(int x,int y)
{
        return x<y?x:y;
}
```

mylib.h

```c
#ifndef __MYLIB_H__
#define __MYLIB_H__
extern int max(int x,int y);
extern int min(int x,int y);
#endif
```

mytest.c

```c
#include<stdio.h>
#include "mylib.h"

int main(int argc,char *argv[])
{
        int a=10,b=20,max_num,min_num;
        max_num=max(a,b);
        min_num=min(a,b);
        printf("max_num=%d\n",max_num);
        printf("min_num=%d\n",min_num);
        return 0;
}
```

下面我们想让mylib.c打包为一个库文件。过程如下，首先我们让想打包的文件生成.o文件

```c
gcc -c mylib.c -o mylib.o
```

然后将这个.o文件做成一个静态库，注意：静态库起名的时候必须以lib开头以.a结尾。

```c
ar rc libmylib.a mylib.o
```

制作好静态库之后，我们可以编译程序了，这时候就可以不使用mylib.c文件了。编译程序有三种方法如下：

**方法一**

这几个文件都在同一个目录下面，就可以不用这么麻烦，直接使用下面的命令就可以完成编译。

```c
gcc -static mytest.c libmylib.a -o mytest
```

**方法二**

可以指定头文件及库文件路径，比如我们可以将libmylib.a和mylib.h移动到/home/test文件夹下，那么可以使用的命令如下：

```c
gcc -static mytest.c -o mytest -L/home/test -lmylib -I/home/test
```

下面对其中的参数做一些解释：

* -L是指定库文件的路径
* -l是指定找哪个库，指定的只要库文件lib后面.a前面的部分
* -I是指定头文件的路径

**方法三**

可以将库文件和头文件存放到系统默认指定的路径下。库文件默认路径是/lib或者是/usr/lib。头文件默认路径是/usr/include。所以可以执行下面两条命令。

```shell
sudo mv libmylib.a /usr/lib
sudo mv mylib.h /usr/include
```

然后就可以执行编译程序命令。

```shell
gcc -static mytest.c -o mytest -lmylib
```

-l是指定的要找哪个库。



## 三、制作动态库

还是上面代码的例子，生成一个mylib.c的动态库文件。

1、首先是将要加入动态库的源文件编译为与位置无关的目标文件。

```shell
gcc -fPIC -c mylib.c
```

这时候就会生成一个与位置无关的目标文件，关于为什么会加上-fPIC的选项，可以参考这个[博客](https://blog.csdn.net/itworld123/article/details/117587091)。

2、然后第二步是将第一步生成的目标文件打包到动态库文件 。

```shell
gcc -shared -o libmylib.so mylib.o
```

3、然后是动态库链接生成可执行文件

```shell
gcc mytest.c libmylib.so -o mytest
```

但是这时候执行./mytest会报错，错误代码如下：

> error while loading shared libraries: libmylib.so: cannot open shared object file: No such file or directory

因为系统找不到自定义的库文件在那，可以有两种方法解决这个问题。

**方法一**

库文件、头文件均在当前目录下，通过添加环境变量

```shell
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:./
```

由于所有的库文件都在当前目录下，所有将当前路径添加到环境变量中。然后在使用命令进行编译：

```shell
gcc mytest.c libmylib.so -o mytest
```

这时候程序可以正常运行。

**方法二**

库函数、头文件假设均在/home文件夹下面，这个时候还需要添加环境变量

```shell
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:./
```

然后通过以下命令进行编译：

```shell
gcc mytest.c -o mytest -L/home -lmylib -I/home
```

然后执行可以通过。

**方法三**

将指定库函数和头文件均在系统路径下：

```shell
sudo cp libmylib.so /usr/lib
sudo cp mylib.h /usr/include
```

然后进行编译

```shell
gcc mytest.c -o mytest -lmylib
```

这个时候会显示编译通过，不需要添加环境变量。