## 4.3 服务相关API

### C++部分

#### 1.服务端

服务端创建：

```
template <typename Request, typename Response>
auto Node::CreateService(
    const std::string& service_name,
    const typename Service<Request, Response>::ServiceCallback&
        service_callback)-> std::shared_ptr<Service<Request, Response>>
```

参数：

* Request 请求数据类型

* Response 响应数据类型

* service\_name 关联请求与响应的服务名称

* service\_callback 处理请求的回调函数

返回值：指向服务对象的共享指针

#### 2.客户端

##### 2-1.创建客户端

```
template <typename Request, typename Response>
auto Node::CreateClient(const std::string& service_name)
    -> std::shared_ptr<Client<Request, Response>>
```

参数：

* Request 请求数据类型

* Response 响应数据类型

* service\_name: 关联请求与响应的服务名称

返回值：指向客户端对象的共享指针

##### 2-2.等待服务

```
  template <typename RatioT = std::milli>
  bool WaitForService(std::chrono::duration<int64_t, RatioT> timeout =
                          std::chrono::duration<int64_t, RatioT>(-1))
```

参数：

* RatioT 时间单位

* timeout 超时时间

返回值：服务是否启动。

##### 2-2.发送请求

```
template <typename Request, typename Response>
typename Client<Request, Response>::SharedResponse
Client<Request, Response>::SendRequest(SharedRequest request,
                                       const std::chrono::seconds& timeout_s)
```

参数：

* Request 请求数据类型

* Response 响应数据类型

* request 请求对象的共享指针

返回值：指向响应对象的共享指针

---

### Python部分

#### 1.服务端

服务端创建：

```
   ##
    # @brief create client for the c/s.
    #
    # @param name the service name.
    # @param req_data_type the request message type.
    # @param res_data_type the response message type.
    # @param callback function to call (fn(data)) when data is received. If
    # args is set, the function must accept the args as a second argument,
    # i.e. fn(data, args)
    # @param args additional arguments to pass to the callback.
    #
    # @return return the service object.
    def create_service(self, name, req_data_type, res_data_type, callback,
                       args=None)
```

```
    def spin(self):
        """
        spin for every 0.002s.
        """
        while not _CYBER.py_is_shutdown():
            time.sleep(0.002)
```

#### 2.客户端

##### 2-1.创建客户端

```
    ##
    # @brief create client for the c/s.
    #
    # @param name the service name.
    # @param request_data_type the request message type.
    # @param response_data_type the response message type.
    #
    # @return the client object.
    def create_client(self, name, request_data_type, response_data_type)
```

##### 2-2.发送请求

```
    ##
    # @brief send request message to service.
    #
    # @param data is a message type.
    #
    # @return None or response from service.
    def send_request(self, data):
```



