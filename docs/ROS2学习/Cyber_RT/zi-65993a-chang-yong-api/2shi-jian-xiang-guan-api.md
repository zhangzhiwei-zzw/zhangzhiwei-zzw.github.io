## 4.2 话题相关API

### C++部分

#### 1.话题发布方

##### 1-1.发布方创建

writer是CyberRT中用来发送消息的基本工具。 每个写入器对应一个具有特定数据类型的通道。 写入器是由节点类中的CreateWriter接口创建的。 接口如下所示：

```
//create writer with specific channel name and message type
auto CreateWriter(const std::string& channel_name)
    -> std::shared_ptr<transport::Writer<MessageT>>;
```

参数：

* Channel\_name:要写入的通道名

* MessageT:要写出的消息的类型

返回值：指向Writer对象的共享指针

##### 1-2.发布消息

发布消息函数：

```
template <typename MessageT>
bool Writer<MessageT>::Write(const std::shared_ptr<MessageT>& msg_ptr)
```

参数：

* msg\_ptr 被发送的消息
* MessageT:要写出的消息的类型

返回值：bool值，是否发送消息成功。

#### 2.话题订阅方

阅读器是网络中接收信息的基本设备。 Reader必须在创建回调函数时绑定到回调函数。 当新消息到达通道时，将调用回调。 阅读器是由节点类的CreateReader接口创建的。 接口如下所示：

```
template <typename MessageT>
auto CreateReader(const std::string& channel_name, const std::function<void(const std::shared_ptr<MessageT>&)>& reader_func)
    -> std::shared_ptr<Reader<MessageT>>;
```

参数：

* MessageT:要读取的消息类型

* Channel\_name:要接收的通道名

* Reader\_func:处理消息的回调函数

返回值：指向Reader对象的共享指针

---

### Python部分

#### 1.话题发布方

##### 1-1.发布方创建

```
def create_writer(self, name, data_type, qos_depth=1):
        """
        create a topic writer for send message to topic.
        @param self
        @param name str: topic name
        @param data_type proto: message class for serialization
        """

   def create_reader(self, name, data_type, callback, args=None):
        """
        create a topic reader for receive message from topic.
        @param self
        @param name str: topic name
        @param data_type proto: message class for serialization
        @callback fn: function to call (fn(data)) when data is
                   received. If args is set, the function must
                   accept the args as a second argument,
                   i.e. fn(data, args)
        @args any: additional arguments to pass to the callback
```

##### 1-2.发布消息

```
##
    # @brief write message.
    #
    # @param data is a message type.
    #
    # @return Success is 0, otherwise False.
    def write(self, data):
        """
        writer message string
        """
        return _CYBER.PyWriter_write(self.writer, data.SerializeToString())
```

#### 2.话题订阅方

```
    ##
    # @brief create a channel reader for receive message from another channel.
    #
    # @param name the channel name to read.
    # @param data_type  message class for serialization
    # @param callback function to call (fn(data)) when data is received. If
    # args is set, the function must accept the args as a second argument,
    # i.e. fn(data, args)
    # @param args additional arguments to pass to the callback
    #
    # @return return the writer object.
    def create_reader(self, name, data_type, callback, args=None):
        """
        create a channel reader for receive message from another channel.
        """
```

```
    def spin(self):
        """
        spin for every 0.002s.
        """
        while not _CYBER.py_is_shutdown():
            time.sleep(0.002)
```



