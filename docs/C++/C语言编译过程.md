# C语言编译过程

以最简单的c语言代码为例，hello.c代码如下：

```c
#include<stdio.h>
int main()
{
    printf("hello world!\n");
    return 0;
}
```

## 1、预编译

将.c中的头文件展开、宏展开，生成的文件是.i文件。例如hello.c文件，生成过程是：

```shell
gcc -E hello.c -o hello.i
```

预处理的过程是将头文件展开、替换，如果有宏，也会进行替换。这一步不进行语法检查。

## 2、编译

将预处理的.i文件生成.s的汇编文件。会进行语法检查。

```shell
gcc -S hello.i -o hello.s
```

## 3、汇编

将.s汇编文件生成.o的目标文件。

```shell
gcc -c hello.s -o hello.o 
```

## 4、链接

将.o文件链接成目标文件，也就是可执行程序

```shell
gcc hello.o -o hello
```

这一步中如果不加-o默认输出的可执行程序时a.out。这四步是将整个编译过程展开来看的，通常可以直接使用gcc hello.c，直接生成结果a.out。
