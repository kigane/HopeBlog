---
title: C/C++ 文件 IO
lang: zh-CN
sidebarDepth: 2
---

## C
### 读写
C提供两种访问文件的途径：二进制模式和文本模式。二进制模式中打开的文件一个字节都不会变，而文本模式中打开的文件中的行末尾和文件末尾会被映射为C模式(行尾:\n, 文件末尾: EOF)。

模式串
* r 读
* w 写。如果文件不存在，会创建新文件。如果文件存在，会先删除文件内容。
* a 写，添加。如果文件不存在，会创建新文件。
* `+` 后缀，表示以更新模式打开，可读可写。但有一些规则
    * 从读模式转换到写模式前，需要先调用一个文件定位函数，或遇到EOF
    * 从写模式转换到读模式前，必须先调用fflush函数
* b 后缀，表示以二进制模式打开
* x 后缀，C11

stdio.h头文件中包含stdin,stdout,stderr三个标准流文件的文件指针。

* FILE *fopen(const char *filename, const char *mode);
* int fclose(FILE *stream);
* FILE *freopen(const char *filename, const char *mode, FILE *stream); // 将stream流重定向到文件。常用：freopen("foo", "w", stdout);
---
* int putc(int c, FILE *stream); // 向stream写入一个字符c，用int而非char是因为EOF是一个负的整数常量。
* int fputc(int c, FILE *stream); // 功能同putc。但putc是宏，fputc是函数。通常putc更快。
* int putchar(int c); // 将一个字符放入stdout
* int fputs(const char *s, FILE *stream); // 向stream写入一行字符c。不会自动加换行符
* int puts(const char *s); // 将一行字符放入stdout。会自动加换行符。
---
* int getc(FILE *stream); // 从stream读入一个字符。宏
* int fgetc(FILE *stream); // 从stream读入一个字符。函数
* int getchar(void) // 从stdin读入一个字符
* int ungetc(int c, FILE *stream); // 将一个字符放回stream。只有第一次调用保证会成功。
* char *fgets(char *s, int n, FILE *stream); // 从stream读入一行字符c。最多读取n-1个。不会丢弃换行符，但可能没读到。
* char *gets(char *s); // 从stdin读入一行字符。自动丢弃换行符。
注意：以上get函数在遇到问题时行为一样。遇到文件末尾，返回EOF，并设置流的文件末尾指示器。遇到读错误，返回EOF，并设置流的错误指示器。可用`int feof(FILE *fp),int ferror(FILE *fp)`函数区分这两种情况。

---
主要用于二进制流
* size_t fwrite(const void *ptr, size_t size, size_t elnum, FILE *stream); // 把内存中的数组复制给流。ptr为数组地址，size为数组元素的大小(B)，elnum为数组元素数量。stream为写入的流。返回实际写入的**元素**数量
* size_t fread(void *ptr, size_t size, size_t elnum, FILE *stream); // 读入。返回值为实际读入的元素数量，应等于elnum
* 不一定非得是数组，结构体也行。
* 示例1: fwrite(arr, sizeof(a[0]), sizeof(a)/sizeof(a[0]), fp); // 写数组
* 示例2: fwrite(&s, sizeof(s), 1, fp); // 写结构体
---
文件定位(适合二进制流)
* int fseek(FILE *stream, long int offset, int whence);
    * whence SEEK_SET, SEEK_CUR, SEEK_END 代表新位置的计算起点。
    * offset 可以为负。和whence共同确定pos。
    * 移动到文件开头 fseek(fp, 0L, SEEK_SET)
    * 移动到文件末尾 fseek(fp, 0L, SEEK_END)
    * 往回移动10个字节 fseek(fp, -10L, SEEK_CUR)
* long int ftell(FILE *stream); // 返回当前pos。错误时，返回-1L，错误码在errno中。0表示文件起始，其他整数表示当前pos所在的字节数。
* void rewind(FILE *stream); // 把pos设为0，且会清除fp的错误指示器。 类似fseek(fp, 0L, SEEK_SET)

* int fgetpos(FILE *stream, fpos_t *pos); // 用于超大文件。fpos_t是一个结构，可储存超过long int可表示的数的位置。
* int fsetpos(FILE *stream, const fpos_t *pos);

### 临时文件
* FILE *tmpfile(void); // "wb+"
* char *tmpnam(char *s); // 写入内容后才生成
    * 参数为NULL时，会自动生成一个文件名，将文件名存储在静态变量中，并返回其指针。
    * 否则，会把文件名复制到程序员提供的字符数组中。L_tmpnam宏为临时文件名的字符数组长度。

### 文件缓冲
* int fflush(FILE *stream); // 强制刷新
* void setbuf(FILE *stream, char *buf); // 等价于(void) setvbuf(stream, NULL, _IONBF, 0) 或 (void) setvbuf(stream, buf, _IOFBF, BUFSIZ)
* int setvbuf(FILE *stream, char *buf, int mode, size_t size);
    * 缓冲mode有三种
        * _IOFBF 满缓冲 缓冲区满时刷新。默认设置
        * _IOLBF 行缓冲 没读/写一行就刷新
        * _IONBF 无缓冲 没有缓冲区
    * buf 是缓冲区。为NULL时，setvbuf会创建一个size大小的缓冲区。
    * size 是缓冲区的大小(Byte)

通常，缓冲是后台发生的，向文件写数据时，数据先放入缓冲区。当缓冲区满或关闭文件时，缓冲区会自动flush(即将数据写入磁盘)。

### 其他文件操作
* int remove(const char *filename);
* int rename(const char *old, const char *new);