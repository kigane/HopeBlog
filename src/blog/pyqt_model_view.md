---
title: PyQt5的Model/View组件
author: Leonhardt
category: Python
tag:
  - PyQt5
sidebarDepth: 1
sticky: false
star: false
time: 2021-12-15
---

## 总览
几种View的样式

![图片](/assets/img/pyqt_model_view.png)

## Model
在PyQt5中，所有数据模型类都从QAbstractItemModel继承而来，所有的数据都是以表格的层次结构组织的，视图组件通过这种规则来存取数据。如下图右侧  
![图片](/assets/img/pyqt_view_index.png)

### 模型索引--QModelIndex。
- 通过数据模型存取的每个Item都有一个模型索引，视图组件和代理都要通过索引来获取数据
- 一个模型索引由三个部分组成
    - 行号 index.row()
    - 列号 index.column()
    - 父项的模型索引 index.parent()
    - 数据 index.data()
    - 创建索引：model.index(row, col, QModelIndex())
    - 通常顶层节点用QModelIndex()表示

### Item Roles
![图片](/assets/img/qt_item_roles.png)
每一个数据可以有多种角色，有不同用途，如(qtc.Qt.ItemDataRole.)
- DisplayRole: 显示的字符串
- DecorationRole: 装饰显示
- ToolTipRole: 鼠标提示消息
- FontRole: 是字体样式
- BackgroundRole: 是背景设置
- TextAlignmentRole: 是对齐设置
- CheckStateRole: 是数据前加check状态
- UserRole: 自定义数据

### Model的使用
Model需要继承QAbstractItemModel或其某个子类。通过实现虚函数来处理数据的存取。
### 继承QAbstractItemModel
- 信号
    - dataChanged(topleft_index, botright_index, role)
    - 行列插入，移动，删除，及其准备阶段动有相应信号
- rowCount(self, index): 返回需要显示的行数
- columnCount(self, index): 返回需要显示的列数，第二个参数感觉没啥用
- **data(self, index, role)**=**: 取数据的核心方法
    - index 表示正要取的数据的索引
    - role 通过index判断哪些数据单元需要作哪些设置
    - 同一个index会访问多次，比如通过DisplayRole取字符串，通过FontRole取该字符串的字体设置......
    - C++中用switch语句处理大量分支，但python没有switch语句。
    - 最后返回一个qtc.QVariant()
- **headerData(self, section, orientation, role)**
    - section是索引
    - orientation表示行或列
    - role同上
- flags(self, index) 设置显示单元的特性。如让单元格可编辑。见qtc.Qt.ItemFlag。
- **setData(self, index, value, role)**
    - index为索引
    - value为输入值
    - role同上

### QStandardItemModel
处理层级数据的容器，数据项必须为QStandardItem，它能够保留文本，字体，复选框或画笔等数据项的所有标准属性。
- 信号: itemChanged(QStandardItem) 任何一项数据改变时触发
- 要创建List或Tree
    - 先创建QStandardItemModel()
    - 使用appendRow(item)|appendRow(item_list)添加数据
    - 用item(row, col)获取数据
- 要创建Table
    - 先创建QStandardItemModel(row_count, col_count)
    - 使用setItem()存放数据
    - 用item(row, col)获取数据
- 改变模型显示的数据数使用setRowCount(), setColumnCount()
- 插入insertRow(), insertColumn()
- 删除removeRow(), removeColumn()
- 设置表头使用setHorizontalHeaderLabels(header_list), setVerticalHeaderLabels(header_list)
- 查找数据项使用findItems(text, flag)
- 排序使用sort(column, order)
    - 按某列排序
    - Qt::AscendingOrder, Qt::DescendingOrder
- 删除所有数据使用clear()

信号与槽使用QModelIndex，所以需要item和index的相互转化。
- itemFromIndex()
- indexFromItem() 相当于 QStandardItem::index()

![find_flag](/assets/img/pyqt_find_flag.png)

### QStandardItem
Item通常包括文本，图标和checkbox。
- 背景刷子用setBackground()
- 字体用setFont()
- 文本颜色用setForeground()
- Item的特性用setFlags()设置，初始为enabled, editable, selectable, checkable, 且可拖动。
    - checkable的Item可以用setCheckState()设置状态
- 可以用setData(val, role)完成以上设置
- 每个项目都可以具有一个二维子项表。这样可以构建项目的层次结构。典型的层次结构是树，在这种情况下，子表是一个具有单列（列表）的表。
    - 子表操作类似QStandardItemModel
    - 设置数据使用setChild(row, col, item)
    - 获取数据使用child(row, col)
    - sortChildren(col, order)

## View
View为视图组件，负责数据的显示。需要通过setModel()方法和相应的数据模型关联起来。

```python
table_view = qtw.QTableView()
my_model = MyModel()
table_view.setModel(my_model)

# 隐藏标题栏
# table_view.horizontalHeader().hide()
# table_view.verticalHeader().hide()
```

视图用一个单独的选择模型管理Item选择问题。
- 可用SelectsModel()方法获取该选择模型，以便将插槽连接到selectionChanged(selected, deselected)信号。
- 获取被选中的索引: treeView.selectionModel().currentIndex()
- 可用SelectsModel()方法获取选择模型，再用setSelectionModel()方法为多个View设置同一个选择模型，以实现选择在多个视图中的同步。

## Delegate
Delegate用于处理每一个Item，并实际将其绘制出来。  
View有一个setItemDelegate()方法，用于替换默认的Delegate。自定义的Delegate可以从继承QStyledItemDelegate(继承自QAbstractItemDelegate)。

## 示例
::: details Table View

```python
import sys
from PyQt5 import QtWidgets as qtw
from PyQt5 import QtCore as qtc
from PyQt5 import QtGui as qtg

class MyModel(qtc.QAbstractTableModel):
    editCompleted = qtc.pyqtSignal(str)

    def __init__(self):
        super().__init__()
        self.cnt = 0
        self.timer = qtc.QTimer()
        self.timer.setInterval(1000) # ms
        self.timer.timeout.connect(self.time_hit)
        self.timer.start()
        self.editCompleted.connect(self.show)
    
    @qtc.pyqtSlot(str)
    def show(self, str):
        print(str)
    
    def time_hit(self):
        # topright = qtc.QAbstractItemModel.createIndex(self, 0, 2)
        topright = self.index(0, 2, qtc.QModelIndex()) # 顶层节点用qtc.QModelIndex()表示
        # 发送数据改变信号，从新读取指定矩形局域数据
        self.dataChanged.emit(topright, topright, [qtc.Qt.DisplayRole])
    
    def rowCount(self, index):
        return 2
    
    def columnCount(self, index):
        return 3

    # 设置表格内容和样式
    def data(self, index, role):
        row = index.row()
        col = index.column()
        self.cnt += 1
        # print(f'Rows: {row+1}, Columns: {col+1}, Role: {role}, Count: {self.cnt}')
        if role == qtc.Qt.ItemDataRole.DisplayRole:
            if row == 0 and col == 0:
                return 'Left<--'
            if row == 0 and col == 2:
                return qtc.QTime.currentTime().toString()
            return f'Rows{row+1}, Columns{col+1}'
        elif role == qtc.Qt.ItemDataRole.FontRole:
            if row == 0 and col == 1:
                fnt = qtg.QFont('Open Sans', 16)
                fnt.setBold(True)
                return fnt
        elif role == qtc.Qt.ItemDataRole.BackgroundRole:
            if row == 1 and col == 1:
                return qtg.QBrush(qtc.Qt.GlobalColor.cyan)
        elif role == qtc.Qt.ItemDataRole.CheckStateRole:
            if row == 1 and col == 0:
                return qtc.Qt.CheckState.Checked
        elif role == qtc.Qt.ItemDataRole.TextAlignmentRole:
            if row == 0 and col == 1:
                return int(qtc.Qt.AlignmentFlag.AlignRight | qtc.Qt.AlignmentFlag.AlignVCenter)
        
        return qtc.QVariant()

    # 设置表格 Header
    # 有了这个方法，默认的Header就不会生成了。所以，如果两个方向的都要，则两个方向都要有数据
    def headerData(self, section, orientation, role):
        if (role == qtc.Qt.ItemDataRole.DisplayRole 
            and orientation == qtc.Qt.Horizontal):
            header_rows = ['first', 'second', 'third']
            return header_rows[section]

        return qtc.QVariant()

    # 设置Item的特性。这里让其可编辑
    def flags(self, index):
        return qtc.Qt.ItemFlag.ItemIsEditable | super().flags(index)

    # 编辑数据
    def setData(self, index, value, role):
        if role == qtc.Qt.ItemDataRole.EditRole:
            if not self.checkIndex(index):
                return False
        self.editCompleted.emit(value)
        return True

class TableView(qtw.QMainWindow):
    def __init__(self):
        super().__init__()
        table_view = qtw.QTableView()
        # 隐藏标题栏
        # table_view.horizontalHeader().hide()
        # table_view.verticalHeader().hide()
        my_model = MyModel()
        table_view.setModel(my_model)
        self.setCentralWidget(table_view)
        self.setWindowTitle("Table View App")
        self.resize(800, 600)
        self.show()


if __name__ == '__main__':
    app = qtw.QApplication(sys.argv)
    w = TableView()
    sys.exit(app.exec_())
```

:::
