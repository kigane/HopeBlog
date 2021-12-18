---
icon: page
title: PyQt5 Image Viewer示例
author: Leonhardt
category: Python
tag:
  - PyQt5
sidebarDepth: 1
sticky: false
star: false
time: 2021-12-15
---

## 用Label显示图片
```python
self.imageLabel = QLabel()
# 定义组件调色板中的刷子用于呈现背景
self.imageLabel.setBackgroundRole(QPalette.Base)
self.imageLabel.setSizePolicy(QSizePolicy.Ignored, QSizePolicy.Ignored)
# 将缩放PIXMAP以填充可用空间。
self.imageLabel.setScaledContents(True)

# QLabel的pixmap属性用于设置图像
image = QImage(fileName)
self.imageLabel.setPixmap(QPixmap.fromImage(image))
```
- QSizePolicy::Fixed：固定尺寸不能变
- QSizePolicy::Minimum：可以放大
- QSizePolicy::Maximum：可以缩小
- QSizePolicy::Preferred：可以放大也可以缩小
- QSizePolicy::Expanding：自动放大和缩小
- QSizePolicy::MinimumExpanding：至少为给定尺寸，可以自动放大
- QSizePolicy::Ignored：忽略给定尺寸。组件的大小不受限制。

## 打开文件--QFileDialog
### static 成员
- getExistingDirectory() -> dirpath
- getExistingDirectoryUrl() -> QUrl('file:///F:/xxx/xx')
- getOpenFileName() -> filepath, filter_str
- getOpenFileNames()-> filepath_list, filter_str
- getOpenFileUrl()
- getOpenFileUrls()
- getSaveFileName() -> filepath, filter_str 只返回一个用户输入的文件名，并没有真的创建文件
- getSaveFileUrl()
- 参数说明
    - caption='Dialog Title'
    - directory='F:/' 初始路径
    - `filter='Images (*.png *.xpm *.jpg);;Text files (*.txt);;All Files (*)' ` 过滤器。多个过滤器用两个分号隔开。

### signals
- currentChanged(QString)： 当前文件改变了。参数为新文件名。
- currentUrlChanged(QUrl)：当前文件改变了。参数为新文件URL。
- directoryEntered(QString)：用户进入某个目录
- directoryUrlEntered(QUrl)
- fileSelected(QString)：选择文件变化时。参数为选中的文件。
- filterSelected(QString)
- urlSelected(QUrl)
- `urlsSelected(QList<QUrl>)`
- filesSelected(QStringList)：用户选择过滤器时。

## ScrollArea
```python
# 检查Action是否被勾选
fitToWindow = self.fitToWindowAct.isChecked() 
# WidgetResizable为false，scrollArea拥有Widget的大小
# 为True，则scrollArea会调整Widget大小以尽量避免滚动条，或更充分利用空间。
self.scrollArea.setWidgetResizable(fitToWindow)
```
- self.scrollArea.horizontalScrollBar() 获取水平滚动条
- self.scrollArea.verticalScrollBar()
- scrollBar.value()
- scrollBar.setValue() 设置滚动条的位置

## QPainter
```python
self.printer = QPrinter()

dialog = QPrintDialog(self.printer, self)
if dialog.exec_():
    painter = QPainter(self.printer)
    rect = painter.viewport()
    size = self.imageLabel.pixmap().size()
    size.scale(rect.size(), Qt.KeepAspectRatio)
    painter.setViewport(rect.x(), rect.y(),
                        size.width(), size.height())
    painter.setWindow(self.imageLabel.pixmap().rect())
    painter.drawPixmap(0, 0, self.imageLabel.pixmap())
```

## 代码
[查看完整代码](https://gist.github.com/acbetter/32c575803ec361c3e82064e60db4e3e0)