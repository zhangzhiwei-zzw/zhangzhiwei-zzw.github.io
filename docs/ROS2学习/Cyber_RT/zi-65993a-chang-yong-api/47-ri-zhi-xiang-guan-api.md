## 4.7 日志相关API

### C++部分

cyber 的日志是基于 glog 的。

使用日志需要倒入相关头文件:

```
#include "cyber/common/log.h"
#include "cyber/init.h"
```

不过在`#include cyber/cyber.h`时，该头文件本身已经包含了上述两个头文件，所以无需自己显示声明了。

日志初始化:

```
apollo::cyber::cyber::Init(argv[0]);
```

该实现会初始化日志模块\(PS:HelloWorld案例中，没有执行初始化语句，虽然日志输出了，不过控制台给出了警告\)。

日志API:

```
AINFO << "INFO log";
AWARN << "WARNlog";
AERROR << "ERROR log";
AFATAL << "FATAL log";
```

输出一些常见级别的日志信息。

**日志配置**

在 cyber 中提供了日志输出的相关配置文件，该文件是 cyber/setup.bash，打开文件，开发者可自定义内容如下:

```
export GLOG_log_dir=/apollo/data/log
export GLOG_alsologtostderr=0
export GLOG_colorlogtostderr=1
export GLOG_minloglevel=0
```

GLOG\_log\_dir: 输出日志的保存目录；

GLOG\_alsologtostderr:是否输出在控制台，0为 false，1为true；

GLOG\_colorlogtostderr:不同级别的日志是否以不同颜色区分，0统一颜色，1设置不同颜色\(info 为白色，warning为黄色，error与fatal为红色\)。

GLOG\_minloglevel:输出日志的最低级别,取值为\[0,3\],超出此范围会编译失败。

* 0:输出全部;

* 1:输出警告以及以上;

* 2:输出error与fatal;

* 3:之输出fatal。

默认情况下，同一模块的不同级别日志写入到统一文件。

---



#### 



