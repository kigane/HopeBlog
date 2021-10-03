---
title: Hazel
lang: zh-CN
sidebarDepth: 1
---

## EventSystem
* EntryPoint.h -- Game Main Loop
    * app = CreateApplicaiton();
    * app->run();
    * delete app;
* Application.h
    * Application(name)
        * 创建窗口，设置回调
        * 渲染初始化
        * 创建ImGui层
    * OnEvent(e)
        * Dispatch Event=>function
        * Layer->OnEvent(e) 传播机制
    * Run() 更新Layers和Window
* Event.h
    * 创建事件 Event
    * 分发事件 EventDispatcher
    * 具体事件继承Event

一个窗口事件发生，有glfwWindow捕获，产生glfw事件。通过在创建窗口时，设置的各种事件回调函数(glfwSetWindowSizeCallback(window,callback))，将glfw事件转化为Hazel事件，并用Application::OnEvent回调函数处理。

## precompiled header
当项目中cpp文件多了以后，每个cpp文件编译时都需要解析其include的头文件，其中有些头文件可能被多个cpp文件所引用，但每个编译单元(cpp文件)都要独立解析各自的头文件，效率比较低。  
因此，对于这些常用的，通常不会有修改的头文件(例如，iostream,vector,string....)，可以预先编译好，变成一个二进制文件。在后续cpp文件编译，链接时，可以直接查找这个编译好的二进制文件，效率高。

怎么做？
* 建立一个pch.h头文件，将需要预编译的头文件包含进来
* MSVC需要建立一个pch.cpp，内容仅需include "pch.h"即可。
* VS2019相关设置
    * C/C++->precompiled headers->Precompiled Header 设为 Use
    * C/C++->precompiled headers->Precompiled Header File 设为 pch.h
* premake设置(proejct下)
    * pchheader "pch.h"
    * pchsource "src/pch.cpp"

PS: 如果pch.h中的头文件有任何一个改动，整个pch.h都需要重新编译。所以，不要将可能经常改动的头文件放入预编译头。

## Layers
* Layer & LayerStack
* LayerStack是Layer的wrapper(一个vector\<Layer\>)，主要用于设定渲染顺序，以及事件的传播顺序(和渲染顺序相反)，将不同Layer的渲染和事件处理隔离开。
* OnUpdate() 在每一帧渲染时调用
* OnEvent() 在反向传播事件

## InputSystem
