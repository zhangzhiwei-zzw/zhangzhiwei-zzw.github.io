# C/C++回调函数
首先看一下回调函数的解释：回调函数就是一个通过函数指针调用的函数。如果你把函数的指针（地址）作为参数传递给另一个函数，当这个指针被用来调用其所指向的函数时，我们就说这是回调函数。回调函数不是由该函数的实现方直接调用，而是在特定的事件或条件发生时由另外的一方调用的，用于对该事件或条件进行响应。这段解释比较官方。个人可以简单的理解为：**一个通过函数指针调用的函数。如果你把函数的指针（地址）作为参数传递给另一个函数，回调函数不是由该函数的实现方直接调用，而是在特定的事件或条件发生时由另外的一方调用的，用于对该事件或条件进行响应。**如果代码立即被执行就称为同步回调，如果过后再执行，则称之为异步回调。
## 入门案例
```C
int Callback_1(int a)   ///< 回调函数1
{
    printf("Hello, this is Callback_1: a = %d ", a);
    return 0;
}

int Callback_2(int b)  ///< 回调函数2
{
    printf("Hello, this is Callback_2: b = %d ", b);
    return 0;
}

int Callback_3(int c)   ///< 回调函数3
{
    printf("Hello, this is Callback_3: c = %d ", c);
    return 0;
}

int Handle(int x, int (*Callback)(int)) ///< 注意这里用到的函数指针定义
{
    Callback(x);
}

int main()
{
    Handle(4, Callback_1);
    Handle(5, Callback_2);
    Handle(6, Callback_3);
    return 0;
}
```
在这个入门案例中，Callback_1、2、3就是回调函数，handle函数的第二个参数就是函数指针，也就是通过函数指针来调用。纯C语言通过函数指针来进行回调函数的调用，C++则可以通过引用、Lambda等多种方式来进行，下面进行具体的介绍。
## 函数指针
首先函数指针也是一种指针，只不过指向的是函数（C语言中没有对象）。然后通过这个指针就可以调用。
```C
int Func(int x);   /*声明一个函数*/
int (*p) (int x);  /*定义一个函数指针*/
p = Func;          /*将Func函数的首地址赋给指针变量p*/
p = &Func;          /*将Func函数的首地址赋给指针变量p*/
```
经过上述后，指针变量 p 就指向函数 Func() 代码的首地址了。下面看一个具体的例子。
```C
int Max(int x, int y)  //定义Max函数
{
    if (x > y){
        return x;
    }else{
      return y;
    }
}
int main()
{
  int(*p)(int, int);  //定义一个函数指针
  p = Max;  //把函数Max赋给指针变量p, 使p指向Max函数
  int c= (*p)(1,2);//通过函数指针调用Max函数
  printf("%d",c);  
  return 0;
}
```
p指向Max函数之后，然后用p调用Max函数，返回两个数中的最大值。特别注意的是，因为函数名本身就可以表示该函数地址（指针），因此在获取函数指针时，可以直接用函数名，也可以取函数的地址。
>p = Max可以改成 p = &Max;
>c = (*p)(a, b) 可以改成 c = p(a, b)

所以函数指针的通常写法是
> 函数返回值类型 (* 指针变量名) (函数参数列表);

在这里指针变量名也可以叫做函数名，
但是通常可以用typedef进行描述
> typedef 函数返回值类型 (* 指针变量名) (函数参数列表);

**最后需要注意的是，指向函数的指针变量没有 ++ 和 -- 运算。**
## C++类的静态函数作为回调函数
前面函数指针的方式作为回调函数的一种方式，可以同时用于C和C++，下面介绍另外的一些方式，因为C++引入了对象的概念，可以使用类的成员和静态函数作为回调函数。
```C++
class ProgramA {
 public:
  void FunA1() { printf("I'am ProgramA.FunA1() and be called..\n"); }

  static void FunA2() { printf("I'am ProgramA.FunA2() and be called..\n"); }
};
class ProgramB {
 public:
  void FunB1(void (*callback)()) {
    printf("I'am ProgramB.FunB1() and be called..\n");
    callback();
  }
};
int main(int argc, char **argv) {
  ProgramA PA;
  PA.FunA1();

  ProgramB PB;
  PB.FunB1(ProgramA::FunA2);
}
```
在类B中调用类A中的静态函数作为回调函数，从而实现了回调。**但这种实现有一个很明显的缺点：static 函数不能访问非static 成员变量或函数，会严重限制回调函数可以实现的功能。**
## 类的非静态函数作为回调函数
这种方式比较麻烦，可以先看一下下面的例子。
```C++
class ProgramA {
 public:
  void FunA1() { printf("I'am ProgramA.FunA1() and be called..\n"); }

  void FunA2() { printf("I'am ProgramA.FunA2() and be called..\n"); }
};

class ProgramB {
 public:
  void FunB1(void (ProgramA::*callback)(), void *context) {
    printf("I'am ProgramB.FunB1() and be called..\n");
    ((ProgramA *)context->*callback)();
  }
};
int main(int argc, char **argv) {
  ProgramA PA;
  PA.FunA1();

  ProgramB PB;
  PB.FunB1(&ProgramA::FunA2, &PA);  // 此处都要加&
}
```
功能总体与上面一个相同，但是，类的静态函数本身不属于该类，所以和普通函数作为回调函数类似。这种方式存在一些不足，，也就我预先还要知道回调函数所属的类定义，当ProgramB想独立封装时就不好用了。(违背了一些设计模式的原则)

## Lambda表达式作为回调函数
Lambda本身就是一种匿名函数，是一种函数的简写形式(此处参考上一篇博客Lambda表达式)
```C++
#include <iostream>
#include<functional>
void func1(int a,std::function<void(int)> func2){
  func2(a);
}
int main(int argc, char **argv) {
  auto fun3 = [](int a){
    std::cout<<a<<std::endl;
  };
  func1(3,fun3);
}
```
这种方式也较为简单，但要注意在C++11版本才开始引入Lambda表达式，在一些较为老旧的编译器上可能无法通过。

## std::funtion和std::bind的使用
这种方式也是适用于C++，要引入**functional**的头文件。存储、复制、和调用操作，这些目标实体包括普通函数、Lambda表达式、函数指针、以及其它函数对象等。std::bind()函数的意义就像它的函数名一样，是用来绑定函数调用的某些参数的。
```C++
#include <iostream>

#include <functional> // fucntion/bind

class ProgramA {
 public:
  void FunA1() { printf("I'am ProgramA.FunA1() and be called..\n"); }

  void FunA2() { printf("I'am ProgramA.FunA2() and be called..\n"); }

  static void FunA3() { printf("I'am ProgramA.FunA3() and be called..\n"); }
};

class ProgramB {
  typedef std::function<void ()> CallbackFun;
 public:
   void FunB1(CallbackFun callback) {
    printf("I'am ProgramB.FunB2() and be called..\n");
    callback();
  }
};

void normFun() { printf("I'am normFun() and be called..\n"); }

int main(int argc, char **argv) {
  ProgramA PA;
  PA.FunA1();

  printf("\n");
  ProgramB PB;
  PB.FunB1(normFun);
  printf("\n");
  PB.FunB1(ProgramA::FunA3);
  printf("\n");
  PB.FunB1(std::bind(&ProgramA::FunA2, &PA));
}
```
主要看最后一行，通过std::bind函数绑定了对象与对应的函数，这种方式比上面的通过类的成员函数进行回调更为简单方便。下面看一下如果有参数的话，需要引入占位符std::placeholders::_1来进行回调。
```C++

#include <iostream>
#include <functional>
using namespace std;
 
int TestFunc(int a, char c, float f)
{
    cout << a << endl;
    cout << c << endl;
    cout << f << endl;
 
    return a;
}
 
int main()
{
    auto bindFunc1 = bind(TestFunc, std::placeholders::_1, 'A', 100.1);
    bindFunc1(10);
 
    cout << "=================================\n";
 
    auto bindFunc2 = bind(TestFunc, std::placeholders::_2, std::placeholders::_1, 100.1);
    bindFunc2('B', 10);
 
    cout << "=================================\n";
 
    auto bindFunc3 = bind(TestFunc, std::placeholders::_2, std::placeholders::_3, std::placeholders::_1);
    bindFunc3(100.1, 30, 'C');
 
    return 0;
}
```
上述例子中引入了占位符std::placeholders::_1，可以有多个，通过下划线加数字来实现，从而实现有参数的回调。这个bind函数中的重载通常第一个是函数的指针，第二个是调用对象的指针，后面跟上参数占位符。