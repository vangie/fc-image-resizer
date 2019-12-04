## 应用简介

这是一个在线的图片转换服务，客户端把图片地址、目标宽度和高度，发送给函数，函数负责进行图片转换并把结果通过 HTTP 协议返回给客户端，客户端通过浏览器会看到（或者下载到）转换后的图片。

![image_resizer](https://yqfile.alicdn.com/3ed38b55e075aa7b0d89fde7b9a46c785103cf7b.gif)

## 调用示例

```bash
curl 'http://localhost:8000/2016-08-15/proxy/ResizeService/ResizeFunction?width=300&height=100&url=https://file01.dysucai.com/d/file/lan20191114/pb2qtf3cewu.jpg' --output resized.jpg
```

请将上面 `http://localhost:8000/` 替换为该应用部署后的地址。

## 工作原理

这是一个单函数结合 Http Trigger 的应用。Http Trigger 以 HTTP GET 方法对外暴露服务，客户端传递三个请求参数：url、width 和 height。其中

* url 表示需要进行处理的源图片地址
* width 表示裁剪或缩放后的图片宽度
* height 表示裁剪的图片宽度。该参数缺失时，表示采用缩放的方式调整图片。

该应用的架构图如下：

![_001_jpeg](https://yqfile.alicdn.com/3bb06af5d6162bba4669928687d6afd5a56433b5.jpeg)

FC 函数接受到 HTTP 请求之后，执行如下三个步骤：

1. 把 url 指向的图片下载下来
2. 使用 imagemagick 进行图片转换
3. 将图片通过 http 协议返回给客户端

项目源码：https://github.com/vangie/fc-image-resizer