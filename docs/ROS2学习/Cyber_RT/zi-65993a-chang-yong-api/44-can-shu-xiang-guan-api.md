## 4.4 参数相关API

### C++部分

Parameter Service用于节点间共享数据，提供set、get、list等基本操作。参数服务基于服务实现，包含服务和客户端，被共享的数据封装为 Parameter 对象。

#### 1.参数对象

构造函数：

```
Parameter();  // Name is empty, type is NOT_SET
explicit Parameter(const Parameter& parameter);
explicit Parameter(const std::string& name);  // Type is NOT_SET
Parameter(const std::string& name, const bool bool_value);
Parameter(const std::string& name, const int int_value);
Parameter(const std::string& name, const int64_t int_value);
Parameter(const std::string& name, const float double_value);
Parameter(const std::string& name, const double double_value);
Parameter(const std::string& name, const std::string& string_value);
Parameter(const std::string& name, const char* string_value);
Parameter(const std::string& name, const std::string& msg_str,
          const std::string& full_name, const std::string& proto_desc);
Parameter(const std::string& name, const google::protobuf::Message& msg);
```

成员函数：

```
inline ParamType type() const;
inline std::string TypeName() const;
inline std::string Descriptor() const;
inline const std::string Name() const;
inline bool AsBool() const;
inline int64_t AsInt64() const;
inline double AsDouble() const;
inline const std::string AsString() const;
std::string DebugString() const;
template <typename Type>
typename std::enable_if<std::is_base_of<google::protobuf::Message, Type>::value, Type>::type
value() const;
template <typename Type>
typename std::enable_if<std::is_integral<Type>::value && !std::is_same<Type, bool>::value, Type>::type
value() const;
template <typename Type>
typename std::enable_if<std::is_floating_point<Type>::value, Type>::type
value() const;
template <typename Type>
typename std::enable_if<std::is_convertible<Type, std::string>::value, const std::string&>::type
value() const;
template <typename Type>
typename std::enable_if<std::is_same<Type, bool>::value, bool>::type
value() const;
```

#### 2.参数服务端

##### 2-1.创建参数服务端

构造函数

```
explicit ParameterService(const std::shared_ptr<Node>& node);
```

参数：

* node 节点的共享指针

##### 2-2.操作参数

**设置参数**

```
void SetParameter(const Parameter& parameter);
```

参数：

* 参数对象

**获取某个参数**

```
bool GetParameter(const std::string& param_name, Parameter* parameter);
```

参数：

* param\_name 要获取的参数名称
* parameter 保存参数的参数对象指针

返回值：获取成功返回true，调用服务失败或超时返回false

**获取所有参数**

```
bool ListParameters(std::vector<Parameter>* parameters);
```

参数：

* parameters 用于保存所获取的所有参数的 vector 指针

返回值：获取成功返回true，调用服务失败或超时返回false

#### 3.参数客户端

##### 2-1.创建参数服务端

构造函数

```
ParameterClient(const std::shared_ptr<Node>& node, const std::string& service_node_name);
```

参数：

* node 节点的共享指针
* service\_node\_name 参数服务端的节点名称

##### 2-2.操作参数

**设置参数**

```
void SetParameter(const Parameter& parameter);
```

参数：

* 参数对象

**获取某个参数**

```
/**
 * @brief Get the Parameter object
 *
 * @param param_name
 * @param parameter the pointer to store
 * @return true
 * @return false call service fail or timeout
 */
bool GetParameter(const std::string& param_name, Parameter* parameter);
```

参数：

* param\_name 要获取的参数名称
* parameter 保存参数的参数对象指针

返回值：获取成功返回true，调用服务失败或超时返回false

**获取所有参数**

```
bool ListParameters(std::vector<Parameter>* parameters);
```

参数：

* parameters 用于保存所获取的所有参数的 vector 指针

返回值：获取成功返回true，调用服务失败或超时返回false

---

### Python部分

#### 1.参数对象

```
class Parameter(object):

    """
    Class for Parameter wrapper.
    """

    def __init__(self, name, value=None)
```

```
    def as_string(self):
        """
        return native value
        """
        return _CYBER_PARAM.PyParameter_as_string(self.param)

    def as_double(self):
        """
        return native value
        """
        return _CYBER_PARAM.PyParameter_as_double(self.param)

    def as_int64(self):
        """
        return native value
        """
        return _CYBER_PARAM.PyParameter_as_int64(self.param)
```

#### 2.参数服务端

##### 2-1.创建参数服务端

##### 2-2.操作参数

```
class ParameterServer(object):

    """
    Class for ParameterServer wrapper.
    """

    ##
    # @brief constructor the ParameterServer by the node object.
    #
    # @param node the node to support the parameter server.
    def __init__(self, node):
        self.param_srv = _CYBER_PARAM.new_PyParameterServer(node.node)

    def __del__(self):
        _CYBER_PARAM.delete_PyParameterServer(self.param_srv)

    def set_parameter(self, param):
        """
        set parameter, param is Parameter.
        """
        return _CYBER_PARAM.PyParameter_srv_set_parameter(self.param_srv, param.param)

    def get_parameter(self, param_name):
        """
        get Parameter by param name param_name.
        """
        return Parameter(_CYBER_PARAM.PyParameter_srv_get_parameter(self.param_srv, param_name))

    def get_paramslist(self):
        """
        get all params of this parameterserver.
        """
        pycapsulelist = _CYBER_PARAM.PyParameter_srv_get_parameter_list(
            self.param_srv)
        param_list = []
        for capsuleobj in pycapsulelist:
            param_list.append(Parameter(capsuleobj))
        return param_list
```

#### 3.参数客户端

```
class ParameterClient(object):

    """
    Class for ParameterClient wrapper.
    """

    ##
    # @brief constructor the ParameterClient by a node and the parameter server node name.
    #
    # @param node a node to create client.
    # @param server_node_name the parameter server's node name.
    def __init__(self, node, server_node_name):
        self.param_clt = _CYBER_PARAM.new_PyParameterClient(
            node.node, server_node_name)

    def __del__(self):
        _CYBER_PARAM.delete_PyParameterClient(self.param_clt)

    def set_parameter(self, param):
        """
        set parameter, param is Parameter.
        """
        return _CYBER_PARAM.PyParameter_clt_set_parameter(self.param_clt, param.param)

    def get_parameter(self, param_name):
        """
        get Parameter by param name param_name.
        """
        return Parameter(_CYBER_PARAM.PyParameter_clt_get_parameter(self.param_clt, param_name))

    def get_paramslist(self):
        """
        get all params of the server_node_name parameterserver.
        """
        pycapsulelist = _CYBER_PARAM.PyParameter_clt_get_parameter_list(
            self.param_clt)
        param_list = []
        for capsuleobj in pycapsulelist:
            param_list.append(Parameter(capsuleobj))
        return param_list
```



