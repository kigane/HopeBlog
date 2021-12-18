---
icon: page
title: PyQt5记录
author: Leonhardt
category: Python
tag:
  - PyQt5
sidebarDepth: 1
sticky: false
star: false
time: 2021-12-14
---

## QtDesigner
- 设计界面，产生一个xxx.ui文件
- `pyuic5 -x -o yyy.py xxx.ui`
    - -o后面为输出文件名
    - -x表示在py文件中生成测试代码

## 正确使用ui文件
- 使用类继承，而非直接在生成的py文件上修改。
- 或直接用uic模块得到需要的类

<CodeGroup>
<CodeGroupItem title="编译后导入">

```python
# 引入生成的类
from ui.login import Ui_Form
from PyQt5 import QtWidgets as qtw

# 通过继承取得类属性
class LoginWindow(qtw.QWidget, Ui_Form):
    def __init__(self):
        super(LoginWindow, self).__init__()
        # 调用类中定义的方法，准备好 ui
        self.setupUi(self)
```

</CodeGroupItem>

<CodeGroupItem title="使用uic模块">

```python
from PyQt5 import uic
Ui_Form, BaseClass = uic.loadUiType('login.ui')

# 通过继承取得类属性
class LoginWindow(BaseClass, Ui_Form):
    def __init__(self):
        super(LoginWindow, self).__init__()
        # 调用类中定义的方法，准备好 ui
        self.setupUi(self)
```

</CodeGroupItem>
</CodeGroup>

注意到，生成的py文件中，UI类是object的子类，而非QWiget的子类。这是出于在大型项目中，经常会修改界面的考虑，通过提供setupUi方法实现界面外观，易于修改(Mixin)。但缺点是继承后，不能直观地看到有哪些属性，属性的类型也被隐藏了，编程会变得不方便。

## 基本的Qt程序
```python
import sys
from PyQt5 import QtWidgets as qtw
from PyQt5 import QtCore as qtc
from PyQt5 import QtGui as qtg

class MainWindow(qtw.QWidget):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Your code will go here

        # Your code ends here
        self.show()


if __name__ == '__main__':
    # 接受命令行参数
    app = qtw.QApplication(sys.argv) 
    w = MainWindow()
    # 给程序一个退出状态
    sys.exit(app.exec_()) 
```

## 基本布局
- qtw.QHBoxLayout()
    - layout.addWidget(widget)
    - 所有组件横着放
- qtw.VHBoxLayout()
    - layout.addWidget(widget)
    - 所有组件竖着放
- qtw.GridLayout()
    - layout.addWidget(widget, row, col)
    - 把组件放入相应网格中
- qtw.FormLayout()
    - layout.addRow('widget_label', widget)
    - 会产生适合不同平台的表格
    - 要构造表格组件时，推荐用该布局
- 布局可以嵌套，即上面的widget也可以是layout。
- 也可以用一个QWidget作为布局组件
    - w.setLayout(qtw.QHBoxLayout())
    - w.layout().addWidget(widget)

## Signal & Slot
### 基本用法
signal是Qt组件的属性，可以和slot连接，当signal触发时，执行slot。slot可以是任何python callable。

Qt组件有一些定义好的signal和slot。具体看文档。定义好的信号，可以在组件的构造函数中用关键词参数指定，效果和手动连接相同，写法更简单。

### signal可以携带数据
- 例如textChanged signal连接的slot的第一个参数是当前文本。
- 如果信号携带了数据，可用装饰器`@qtc.pyqtSlot(str)`声明，这会提升一点速度，用于多线程时更安全，此外可以让你确定参数类型，如果在装饰器中声明的参数类型和信号实际携带的类型不符，则会报错。

### 自定义signal
```python
my_signal = qtc.pyqtSignal(str) # 携带一个字符串参数的信号
my_signal.emit('some content') # 在某个地方触发信号，并传入数据
my_signal.connect(some_callable) # 连接信号与槽

def some_callable(str):
    pass
```
自定义信号+携带数据=不同窗口之间传递数据

## QWidget
### signals
- customContextMenuRequested(QPoint)
- windowIconChanged(QIcon)
- windowTitleChanged(QString)

### slots
- close()
- hide() == setVisible(false)
- lower() 将Widget放到父Widget堆栈的底部
- raise() 将Widget放到父Widget堆栈的顶部
- repaint() 可能会导致无限递归。除了做动画，其他情况update()更好。
- setDisabled(bool) 禁止输入
- setEnabled(bool) 
- setFocus() 获得焦点
- setHidden(bool) =  setVisible(!bool).
- setStyleSheet(QString)
- setVisible(bool)
- setWindowModified(bool) 设置窗口有没有未保存的变化
- setWindowTitle(QString)
- show()
- showFullScreen()
- showMaximized()
- showMinimized()
- showNormal()
- update()
- adjustSize() 调整到初始设定的大小

## QMainWindow
- Central Widget
    - 选择一个组件
- MenuBar
    - QMenuBar(): menu = self.menuBar()
    - QMenu('name'): file_menu = menu.addMenu('File')
    - QAction('name', callable, shortcut): save_act = file_menu.addAction('Save', self.save)
        - 第二个参数triggered=xx,设置和triggered信号绑定的槽
        - 第三个参数shortcut=xx,设置快捷键，预定义在qtg.QKeySequence中，或直接用字符串'Ctrl+t'
        - enabled=bool 初始是否可用
        - checkable=bool 是否可打√
        - act.setEnabled()
        - act.isChecked()
- StatusBar
    - self.statusBar().showMessage(msg, last_time)
    - last_time单位ms
- ToolBar
    - edit_toolbar = self.addToolBar('Edit') 增加一个工具栏
    - edit_toolbar.addAction(qtg.QIcon(qtg.QPixmap('action.svg')), 'action_name', callable) 
    - edit_toolbar.addAction('copy', self.textedit.copy)
    - 有图标的时候不显示文字，只有未设置图标或图标缺失时显示文字
- Dockable widget
    - search_dock = qtw.QDockWidget('Search')
    - self.addDockWidget(qtc.Qt.RightDockWidgetArea,search_dock) 添加到主窗口并设置停靠位置
    - search_dock.setFeatures(
            qtw.QDockWidget.DockWidgetClosable |
            qtw.QDockWidget.DockWidgetMovable |
            qtw.QDockWidget.DockWidgetFloatable
        ) 设置特性
    - search_dock.setWidget(widget) 在停靠窗口中添加自定义组件

## 图片和图标
### QPixmap
用于在屏幕上展示图像
- size()-> QSize, width(), height(), rect()->QRect(x,y,w,h):左上+宽高
- hasAlphaChannel()
- depth()->bits per pixel,bpp
- toImage() -> QImage
- fromImage()
- copy(), scaled(size, aspect_ratio_mode), scaledToWidth(), scaledToHeight()
- transformed(QTransform, mode) 
    - Qtransfrom(m11, m12, m21, m22, dx=0, dy=0)
    - mode有两个，默认的0是快速变换，1是使用了双线性插值的变换
- scroll(dx,dy,(x,y,w,h)) 复制图像的部分并移动dx,dy。原图仍在，并会被遮挡。

### QBitmap
单bit特化的QPixmap

### QImage
对I/O有和像素级处理有优化。
- 读写
    - 构造函数
    - load()
    - loadFromData()
    - static fromData()
    - save()
- 几何信息
    - size(), width(), height(), dotsPerMeterX(), dotsPerMeterY(), rect()
    - valid() 判断给定坐标是否在图像rect范围内
    - offset(), setOffset() 通过相对于其他图像定位时，设置图像相对于其他图像偏移的像素数。
- 颜色
    - pixel(pos) 返回某像素点的QRgb值
    - pixelIndex(pos) + color() = pixel(pos)
    - colorCount(), colorTable() 图像用到的颜色列表
    - isGrayscale()
- 文本
    - text(key)
    - setText(key, text)
    - textKeys() 获取图像的text key
- 低级信息
    - depth() 每像素占用比特数
    - bitPlaneCount() 每像素实际使用的比特数
    - format()
    - bytesPerLine()
    - sizeInBytes()

### QPicture
一种绘制设备，可记录和重放QPainter命令

### QIcon(QPixmap)
图标

## 文件位置处理
```python
import os
BASE_DIR = os.path.dirname(__file__)
img_path = os.path.join(BASE_DIR, path)
```

## QSS