## 4.8 record 相关API

### C++部分

#### 1.RecordWriter

写入记录文件接口，用于将消息和频道信息记录到记录文件中。

```
RecordWriter();
bool Open(const std::string& file);
void Close();
bool WriteChannel(const std::string& name, const std::string& type,
                  const std::string& proto_desc);
template <typename MessageT>
bool WriteMessage(const std::string& channel_name, const MessageT& message,
                  const uint64_t time_nanosec,
                  const std::string& proto_desc = "");
bool SetSizeOfFileSegmentation(uint64_t size_kilobytes);
bool SetIntervalOfFileSegmentation(uint64_t time_sec);
```

#### 2.RecordReader

读取记录文件接口用于读取记录文件中的消息和频道信息。

```
RecordReader();
bool Open(const std::string& filename, uint64_t begin_time = 0,
          uint64_t end_time = UINT64_MAX);
void Close();
bool ReadMessage();
bool EndOfFile();
const std::string& CurrentMessageChannelName();
std::shared_ptr<RawMessage> CurrentRawMessage();
uint64_t CurrentMessageTime();
```

---

### Python部分

```
class RecordReader(object):
    """
    Class for cyber RecordReader wrapper.
    """
    def read_messages(self, start_time=0, end_time=18446744073709551615):
        """
        read message from bag file.
        @param self
        @param start_time:
        @param end_time:
        @return: generator of (message, data_type, timestamp)
        """
    def get_messagenumber(self, channel_name):
        """
        return message count.
        """
    def get_messagetype(self, channel_name):
        """
        return message type.
        """
    def get_protodesc(self, channel_name):
        """
        return message protodesc.
        """
    def get_headerstring(self):
        """
        return message header string.
        """
    def reset(self):
        """
        return reset.
        """
        return _CYBER_RECORD.PyRecordReader_Reset(self.record_reader)

     def get_channellist(self):
        """
        return channel list.
        """
        return _CYBER_RECORD.PyRecordReader_GetChannelList(self.record_reader)


class RecordWriter(object):
    """
    Class for cyber RecordWriter wrapper.
    """
    def open(self, path):
        """
        open record file for write.
        """
    def write_channel(self, channel_name, type_name, proto_desc):
        """
        writer channel by channelname,typename,protodesc
        """
    def write_message(self, channel_name, data, time, raw = True):
        """
        writer msg:channelname,data,time,is data raw
        """

    def set_size_fileseg(self, size_kilobytes):
        """
        return filesegment size.
        """

    def set_intervaltime_fileseg(self, time_sec):
        """
        return file interval time.
        """

    def get_messagenumber(self, channel_name):
        """
        return message count.
        """

    def get_messagetype(self, channel_name):
        """
        return message type.
        """

    def get_protodesc(self, channel_name):
        """
        return message protodesc.
        """
```



