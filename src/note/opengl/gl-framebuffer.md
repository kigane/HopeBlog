---
title: 帧缓冲(FrameBuffer)
lang: zh-CN
sidebarDepth: 1
---

默认的帧缓冲是在你创建窗口的时候生成和配置的，包括颜色缓冲，深度缓冲，模板缓冲等。OpenGL支持自定义帧缓冲。将场景渲染到不同的帧缓冲能够让我们在场景中加入类似镜子的东西，或者做出很酷的后期处理效果。

## 创建帧缓冲
```cpp
unsigned int fbo;
glGenFramebuffers(1, &fbo);
glBindFramebuffer(GL_FRAMEBUFFER, fbo);
```
在绑定到GL_FRAMEBUFFER目标之后，所有的读取和写入帧缓冲的操作将会影响当前绑定的帧缓冲。现在的帧缓冲还不能使用，因为它还不完整，一个完整的帧缓冲需要满足以下的条件：

* 附加至少一个缓冲（颜色、深度或模板缓冲）。
* 至少有一个颜色附件(Attachment)。
* 所有的附件都必须是完整的（保留了内存）。
* 每个缓冲都应该有相同的样本数。

我们需要为帧缓冲创建一些附件，并将附件附加到帧缓冲上。在完成所有的条件之后，我们可以以GL_FRAMEBUFFER为参数调用glCheckFramebufferStatus，检查帧缓冲是否完整。
```cpp
if(glCheckFramebufferStatus(GL_FRAMEBUFFER) == GL_FRAMEBUFFER_COMPLETE)
  // 确实完整了
```
之后所有的渲染操作将会渲染到当前绑定帧缓冲的附件中。由于当前帧缓冲不是默认帧缓冲，渲染指令将不会对窗口的视觉输出有任何影响。因此，渲染到一个不同的帧缓冲被叫做离屏渲染(Off-screen Rendering)。要保证所有的渲染操作在主窗口中有视觉效果，我们需要再次激活默认帧缓冲，即将它绑定到0
```cpp
glBindFramebuffer(GL_FRAMEBUFFER, 0);
glDeleteFramebuffers(1, &fbo); // 不要的时候记得删了
```

## 纹理附件
当把一个纹理附加到帧缓冲的时候，所有的渲染指令将会写入到这个纹理中。使用纹理的优点是，所有渲染操作的结果将会被储存在一个纹理图像中，之后可以在着色器中很方便地使用它。
```cpp
unsigned int texture;
glGenTextures(1, &texture);
glBindTexture(GL_TEXTURE_2D, texture);

glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, 800, 600, 0, GL_RGB, GL_UNSIGNED_BYTE, NULL);

glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
```
和普通的纹理区别在于：glTexImage2D的宽高设置为视口的大小，且最后一个参数data设置为NULL。表示仅仅分配了内存而没有填充它。填充会在渲染场景到帧缓冲之后进行。

::: tip 提示
如果你想将你的屏幕渲染到一个更小或更大的纹理上，需要在渲染场景到帧缓冲之前使用纹理的新维度作为参数再次调用glViewport，否则只有一小部分的纹理或屏幕会被渲染到这个纹理上。
:::

```cpp
glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, texture, 0);
```
glFramebufferTexture2D
* target：帧缓冲的目标
* attachment：我们想要附加的附件类型。当前我们正在附加一个颜色附件。注意最后的0意味着我们可以附加多个颜色附件。
* textarget：你希望附加的纹理类型
* texture：要附加的纹理本身
* level：多级渐远纹理的级别。我们将它保留为0。

对于深度缓冲：附件类型设置为GL_DEPTH_ATTACHMENT。纹理的内部格式变为GL_DEPTH_COMPONENT。

对于模板缓冲：附件类型设置为GL_STENCIL_ATTACHMENT，并将纹理的内部格式设定为GL_STENCIL_INDEX。

也可以将深度缓冲和模板缓冲附加为一个单独的纹理。纹理的每32位数值将包含24位的深度信息和8位的模板信息。附件类型使用GL_DEPTH_STENCIL_ATTACHMENT，纹理的内部格式使用GL_UNSIGNED_INT_24_8。例如

```cpp
glTexImage2D(
  GL_TEXTURE_2D, 0, GL_DEPTH24_STENCIL8, 800, 600, 0, 
  GL_DEPTH_STENCIL, GL_UNSIGNED_INT_24_8, NULL
);

glFramebufferTexture2D(GL_FRAMEBUFFER, GL_DEPTH_STENCIL_ATTACHMENT, GL_TEXTURE_2D, texture, 0);
```

## 渲染缓冲对象(Renderbuffer Object)附件
和纹理图像一样，渲染缓冲对象是一个真正的缓冲，即一系列的字节、整数、像素等。渲染缓冲对象直接将所有的渲染数据储存到它的缓冲中，不会做任何针对纹理格式的转换，所以更快(因为使用原生格式，所以交换缓冲这样的操作很快)。然而，渲染缓冲对象通常都是只写的，所以你不能读取它们（比如使用纹理访问）。当然还是能够使用glReadPixels来读取它，这会从当前绑定的帧缓冲中返回特定区域的像素，而非附件本身。

由于渲染缓冲对象通常都是只写的，所以经常用于深度和模板附件，因为大部分时间我们都不需要从深度和模板缓冲中读取值，只关心深度和模板测试能否通过。当**不需要从缓冲中采样的时候**，通常都会选择渲染缓冲对象。

```cpp
unsigned int rbo;
glGenRenderbuffers(1, &rbo);
glBindRenderbuffer(GL_RENDERBUFFER, rbo);
// 创建一个深度和模板渲染缓冲对象
glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH24_STENCIL8, 800, 600);
// 附加
glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_STENCIL_ATTACHMENT, GL_RENDERBUFFER, rbo);
```

## 渲染到纹理
要想绘制场景到一个纹理上，我们需要采取以下的步骤：
1. 将新的帧缓冲绑定为激活的帧缓冲，和往常一样渲染场景
2. 绑定默认的帧缓冲
3. 绘制一个横跨整个屏幕的四边形，将帧缓冲的颜色缓冲作为它的纹理。

## 后期处理
既然整个场景都被渲染到了一个纹理上，我们可以简单地通过修改纹理数据创建出一些非常有意思的效果。

### 反相
我们现在能够访问渲染输出的每个颜色，所以在片段着色器中返回这些颜色的反相(Inversion)并不是很难。我们将会从屏幕纹理中取颜色值，然后用1.0减去它，对它进行反相：
```glsl
void main()
{
    FragColor = vec4(vec3(1.0 - texture(screenTexture, TexCoords)), 1.0);
}
```

### 灰度
移除场景中除了黑白灰以外所有的颜色，让整个图像灰度化(Grayscale)。很简单的实现方式是，取所有的颜色分量，将它们平均化：
```glsl
void main()
{
    FragColor = texture(screenTexture, TexCoords);
    float average = (FragColor.r + FragColor.g + FragColor.b) / 3.0;
    FragColor = vec4(average, average, average, 1.0);
}
```

但人眼会对绿色更加敏感一些，而对蓝色不那么敏感，所以为了获取物理上更精确的效果，我们需要使用加权的通道：

```glsl
void main()
{
    FragColor = texture(screenTexture, TexCoords);
    float average = 0.2126 * FragColor.r + 0.7152 * FragColor.g + 0.0722 * FragColor.b;
    FragColor = vec4(average, average, average, 1.0);
}
```

### 核效果
在一个纹理图像上做后期处理的另外一个好处是，我们可以从纹理的其它地方采样颜色值。比如说我们可以在当前纹理坐标的周围取一小块区域，对当前纹理值周围的多个纹理值进行采样。

核(Kernel)（或卷积矩阵(Convolution Matrix)）是一个类矩阵的数值数组，它的中心为当前的像素，它会用它的核值乘以周围的像素值，并将结果相加变成一个值。所以，基本上我们是在对当前像素周围的纹理坐标添加一个小的偏移量，并根据核将结果合并。

::: tip 提示
大部分核将所有的权重加起来之后都应该会等于1，如果它们加起来不等于1，这就意味着最终的纹理颜色将会比原纹理值更亮或者更暗了。
:::

例如：
```glsl
const float offset = 1.0 / 300.0;  

void main()
{
    vec2 offsets[9] = vec2[](
        vec2(-offset,  offset), // 左上
        vec2( 0.0f,    offset), // 正上
        vec2( offset,  offset), // 右上
        vec2(-offset,  0.0f),   // 左
        vec2( 0.0f,    0.0f),   // 中
        vec2( offset,  0.0f),   // 右
        vec2(-offset, -offset), // 左下
        vec2( 0.0f,   -offset), // 正下
        vec2( offset, -offset)  // 右下
    );

    float kernel[9] = float[](
        -1, -1, -1,
        -1,  9, -1,
        -1, -1, -1
    );

    vec3 sampleTex[9];
    for(int i = 0; i < 9; i++)
    {
        sampleTex[i] = vec3(texture(screenTexture, TexCoords.st + offsets[i]));
    }
    vec3 col = vec3(0.0);
    for(int i = 0; i < 9; i++)
        col += sampleTex[i] * kernel[i];

    FragColor = vec4(col, 1.0);
}
```

### 常见的核

```glsl
// 锐化
float kernel[9] = float[](
        -1, -1, -1,
        -1,  9, -1,
        -1, -1, -1
    );

// 模糊
float kernel[9] = float[](
    1.0 / 16, 2.0 / 16, 1.0 / 16,
    2.0 / 16, 4.0 / 16, 2.0 / 16,
    1.0 / 16, 2.0 / 16, 1.0 / 16  
);

// 边缘检测(Edge-detection)
float kernel[9] = float[](
        1,  1,  1,
        1, -8,  1,
        1,  1,  1
    );
```

::: tip 提示
注意，核在对屏幕纹理的边缘进行采样的时候，由于还会对中心像素周围的8个像素进行采样，其实会取到纹理之外的像素。由于环绕方式默认是GL_REPEAT，所以在没有设置的情况下取到的是屏幕另一边的像素，而另一边的像素本不应该对中心像素产生影响，这就可能会在屏幕边缘产生很奇怪的条纹。为了消除这一问题，我们可以将屏幕纹理的环绕方式都设置为GL_CLAMP_TO_EDGE。这样子在取到纹理外的像素时，就能够重复边缘的像素来更精确地估计最终的值了。
:::