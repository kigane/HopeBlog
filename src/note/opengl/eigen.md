---
title: eigen库
lang: zh-CN
sidebarDepth: 1
---

## 基础
eigen库是纯模板库。

### Matrix
* `Matrix<typename Scalar, int RowsAtCompileTime, int ColsAtCompileTime>`
* `typedef Matrix<float, 4, 4> Matrix4f;`
* 成员变量
    * rows()
    * cols()
    * size() = rows() x cols()

### Vector
* 向量定义为特殊的矩阵。
* 默认为列向量，`typedef Matrix<float, 3, 1> Vector3f;`
* 行向量，`typedef Matrix<int, 1, 2> RowVector2i;`

### 特殊值Dynamic
* 矩阵的维度在编译时不能确定时，用Dynamic表示。
* `typedef Matrix<double, Dynamic, Dynamic> MatrixXd;` 行列都未知
* `Matrix<float, 3, Dynamic>` 可以只有一维是未知的

### 构造器
只分配内存，不会初始化。指定大小时先行后列。

### 访问
矩阵和向量都可以使用小括号访问。向量还可以使用中括号访问，因为C++不允许中括号操作符有两个参数，所以矩阵不能用中括号访问。

### comma-initializer
```cpp
Matrix3f m;
m << 1, 2, 3, 4, 5, 6, 7, 8, 9;
/*
  1 2 3
  4 5 6
  7 8 9
*/
```

### 算术运算
* 矩阵维度必须相同，元素类型也必须相同。eigen不会自动做类型转换。
* 矩阵和标量的除法，标量必须是除数。
* eigen在运算时返回的不是Matrix对象，而是"experssion object"，运算符重载中没有实际进行运算，最后赋值时统一进行，以便于计算的优化。
* 转置，共轭，伴随，逆
    * m.transpose()
    * m.transposeInPlace() eigen实现中a=a.transpose()不会正常工作，需要使用该方法。
    * m.conjugate()
    * m.adjoint() For real matrices, conjugate() is a no-operation, and so adjoint() is equivalent to transpose().
    * m.inverse()
* 点积，叉积
    * v.dot(w) 点击可以使用任意维度的向量
    * v.cross(w) 叉积只能用于三维向量
* reduction operations
    * m.sum() 所有元素之和
    * m.prod() 所有元素之积
    * m.mean() 所有元素的均值
    * m.maxCoeff() 矩阵中的最大元素的值
    * m.maxCoeff(&i, &j) 矩阵中的最大元素的位置存储于i,j中。
    * m.minCoeff() 矩阵中的最小元素的值
    * m.minCoeff(&i, &j) 矩阵中的最小元素的位置存储于i,j中。
    * m.trace() 矩阵的迹。对角线元素之和
* Matrix3d.Random() 生成[-1, 1]之间的随机数填充矩阵。对于Dynamic的矩阵，需要制定行列数。

### Array
不同于Matrix用于实现线性代数的运算。Array主要用于做一些逐元素的操作，比如向量的每个元素同时加上某个值，或两个向量逐元素相乘。
* `Array<typename Scalar, int RowsAtCompileTime, int ColsAtCompileTime>`
* `typedef Array<float,Dynamic,1> ArrayXf`
* `typedef Array<float,3,1> Array3f`
* `typedef Array<double,Dynamic,Dynamic> ArrayXXd`
* `typedef Array<double,3,3> Array33d`

### Block
#### Matrix
Block of size (p,q), starting at (i,j)	
* matrix.block(i,j,p,q);
* `matrix.block<p,q>(i,j)`;

#### Vector
Block containing the first n elements *	
* vector.head(n);
* `vector.head<n>()`;
Block containing the last n elements *	
* vector.tail(n);
* `vector.tail<n>()`;
Block containing n elements, starting at position i *	
* vector.segment(i,n);
* `vector.segment<n>(i)`;

## 示例
```cpp
#include <iostream>
#include <Eigen/Eigen>

using namespace std;
using namespace Eigen;

#define printe(x) cout << endl << x << endl;

void test1()
{
    Matrix2i mat;
    mat(0, 0) = 1;
    mat(0, 1) = 2;
    mat(1, 0) = 3;
    mat(1, 1) = 4;
    printe(mat);

    // 矩阵常见初始化操作
    // 方式一
    mat.setZero();  // 全设为0
    printe(mat);

    mat.setOnes(); // 全设为1
    printe(mat);

    mat.setIdentity(); // 单位矩阵
    printe(mat);

    mat.setConstant(7); // 全设为某个值
    printe(mat);

    // 方式二
    mat = MatrixXi::Zero(2, 2);
    printe(mat);

    mat = MatrixXi::Ones(2, 2);
    printe(mat);

    mat = MatrixXi::Identity(2, 2);
    printe(mat);

    mat = MatrixXi::Constant(2, 2, 7);
    printe(mat);
}

void test2()
{
    // block 操作
    Matrix4i mat;
    int k = 1;
    for (int i = 0; i < 4; i++)
    {
        for (int j = 0; j < 4; j++)
        {
            mat(i, j) = k++;
        }
    }
    printe(mat);

    MatrixXi mat_partitions;
    mat_partitions = mat.block(0, 0, 2, 2); // 左上角2x2矩阵
    //mat_partitions = mat.block(1, 1, 2, 2); // 中间2x2矩阵
    printe(mat_partitions);

    mat.block(1, 1, 2, 2) = MatrixXi::Constant(2, 2, 9);
    printe(mat);

    printe(mat.row(0));

    printe(mat.col(0));

    // 使用向量构造对角矩阵
    Vector3i vec;
    vec << 1, 3, 5;
    MatrixXi diag;
    diag = vec.asDiagonal();
    printe(diag);
}

void test3()
{
    Matrix2d A;
    A << 1, 2, 3, 4;
    Matrix2d G;
    G = A.inverse();
    printe(G);
    printe(A * G);
    A.transposeInPlace();
    printe(A);
}

int main()
{ 
    //test1();
    test2();
    //test3();
    cin.get();
}
```