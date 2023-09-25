## 4.6 时间相关API

### C++部分

#### 1. Time

time是一个用来管理时间的类；可用于当前时间获取、耗时计算、时间转换等。

```
static const Time MAX;
static const Time MIN;
Time() {}
explicit Time(uint64_t nanoseconds);
explicit Time(int nanoseconds);
explicit Time(double seconds);
Time(uint32_t seconds, uint32_t nanoseconds);
Time(const Time& other);
static Time Now();
static Time MonoTime();
static void SleepUntil(const Time& time);
double ToSecond() const;
uint64_t ToNanosecond() const;
std::string ToString() const;
bool IsZero() const;
```

#### 2.Duration

持续时间相关接口，用于表示时间间隔，可以按照指定的纳秒或者秒进行初始化。

```
Duration() {}
Duration(int64_t nanoseconds);
Duration(int nanoseconds);
Duration(double seconds);
Duration(uint32_t seconds, uint32_t nanoseconds);
Duration(const Rate& rate);
Duration(const Duration& other);
double ToSecond() const;
int64_t ToNanosecond() const;
bool IsZero() const;
void Sleep() const;
```

#### 3.Rate

频率接口一般用于休眠操作\(会自动将频率换算成休眠时间\)。

```
Rate(double frequency);
Rate(uint64_t nanoseconds);
Rate(const Duration&);
void Sleep();
void Reset();
Duration CycleTime() const;
Duration ExpectedCycleTime() const { return expected_cycle_time_; }
```

#### 4.Timer

定时器可用于创建定时任务以周期性的运行，或只运行一次

```
Timer(uint32_t period, std::function<void()> callback, bool oneshot);
Timer(TimerOption opt);
void SetTimerOption(TimerOption opt);
void Start();
void Stop();
```

---

### Python部分

#### 1.Time

```
class Time(object):
    @staticmethod
    def now():
        time_now = Time(_CYBER_TIME.PyTime_now())
        return time_now

    @staticmethod
    def mono_time():
        mono_time = Time(_CYBER_TIME.PyTime_mono_time())
        return mono_time

    def to_sec(self):
        return _CYBER_TIME.PyTime_to_sec(self.time)

    def to_nsec(self):
        return _CYBER_TIME.PyTime_to_nsec(self.time)

    def sleep_until(self, nanoseconds):
        return _CYBER_TIME.PyTime_sleep_until(self.time, nanoseconds)
```

#### 2.Timer

```
class Timer(object):

    def set_option(self, period, callback, oneshot=0):
        '''
        period The period of the timer, unit is ms
        callback The tasks that the timer needs to perform
        oneshot 1: perform the callback only after the first timing cycle
                0:perform the callback every timed period
        '''


    def start(self):


    def stop(self):
```

#### 3.Duration

```
class Duration(object):

    """
    Class for cyber Duration wrapper.
    """

    def __init__(self, other):
        if isinstance(other, int):
            self.nanoseconds_ = other
        elif isinstance(other, float):
            self.nanoseconds_ = other * 1000000000
        elif isinstance(other, Duration):
            self.nanoseconds_ = other.nanoseconds_
        self.duration_ = _CYBER_TIME.new_PyDuration(int(self.nanoseconds_))

    def __del__(self):
        _CYBER_TIME.delete_PyDuration(self.duration_)

    def sleep(self):
        """
        sleep for the amount of time specified by the duration.
        """
        _CYBER_TIME.PyDuration_sleep(self.duration_)

    def __str__(self):
        return str(self.nanoseconds_)

    def to_sec(self):
        """
        convert to second.
        """
        return float(self.nanoseconds_) / 1000000000

    def to_nsec(self):
        """
        convert to nanosecond.
        """
        return self.nanoseconds_

    def iszero(self):
        return self.nanoseconds_ == 0

    def __add__(self, other):
        return Duration(self.nanoseconds_ + other.nanoseconds_)

    def __radd__(self, other):
        return Duration(self.nanoseconds_ + other.nanoseconds_)

    def __sub__(self, other):
        return Duration(self.nanoseconds_ - other.nanoseconds_)

    def __lt__(self, other):
        return self.nanoseconds_ < other.nanoseconds_

    def __gt__(self, other):
        return self.nanoseconds_ > other.nanoseconds_

    def __le__(self, other):
        return self.nanoseconds_ <= other.nanoseconds_

    def __ge__(self, other):
        return self.nanoseconds_ >= other.nanoseconds_

    def __eq__(self, other):
        return self.nanoseconds_ == other.nanoseconds_

    def __ne__(self, other):
        return self.nanoseconds_ != other.nanoseconds_
```

#### 4.Rate

```
class Rate(object):

    """
    Class for cyber Rate wrapper. Help run loops at a desired frequency.
    """

    ##
    # @brief Constructor, creates a Rate.
    #
    # @param other float means frequency the desired rate to run at in Hz.
    # int means the expected_cycle_time.
    def __init__(self, other):
        if isinstance(other, int):
            self.rate_ = _CYBER_TIME.new_PyRate(other)
        elif isinstance(other, float):
            self.rate_ = _CYBER_TIME.new_PyRate(int(1.0 / other))
        elif isinstance(other, Duration):
            self.rate_ = _CYBER_TIME.new_PyRate(other.to_nsec())

    def __del__(self):
        _CYBER_TIME.delete_PyRate(self.rate_)

    def __str__(self):
        return "cycle_time = %s, exp_cycle_time = %s" % (str(self.get_cycle_time()), str(self.get_expected_cycle_time()))

    def sleep(self):
        """
        Sleeps for any leftover time in a cycle.
        """
        _CYBER_TIME.PyRate_sleep(self.rate_)

    def reset(self):
        """
        Sets the start time for the rate to now.
        """
        _CYBER_TIME.PyRate_PyRate_reset(self.rate_)

    def get_cycle_time(self):
        """
        Get the actual run time of a cycle from start to sleep.
        """
        return Duration(_CYBER_TIME.PyRate_get_cycle_time(self.rate_))

    def get_expected_cycle_time(self):
        """
        Get the expected cycle time.
        """
        return Duration(_CYBER_TIME.PyRate_get_expected_cycle_time(self.rate_))
```



