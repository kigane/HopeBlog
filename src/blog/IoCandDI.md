## IoC(Inversion of Control)
- control：类的非主要责任
- dependency：A类的任务没有B类就完成不了，即A依赖B。


## DIP Definition
- High-level modules should not depend on low-level modules. Both should depend on the abstraction.
- Abstractions should not depend on details. Details should depend on abstractions.
- 一句话：加接口。
- 面向接口编程

## DI
- Constructor Injection：通过构造函数把实现接口的具体类的对象传给A
- Property Injection：用Setter传
- Method Injection：在创建一个接口，专门用来把具体类的对象传给A。(不用构造函数，而是用接口函数)

## IOC Container
- Register: The container must know which dependency to instantiate when it encounters a particular type. This process is called registration. Basically, it must include some way to register type-mapping.
- Resolve: When using the IoC container, we don't need to create objects manually. The container does it for us. This is called resolution. The container must include some methods to resolve the specified type; the container creates an object of the specified type, injects the required dependencies if any and returns the object.
- Dispose: The container must manage the lifetime of the dependent objects. Most IoC containers include different lifetimemanagers to manage an object's lifecycle and dispose it.

简单的IoC容器，内部保存一个字典，以类型为key，实例为value。包含一个Register()方法和Get()方法。