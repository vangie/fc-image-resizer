# Serverless 图片转换工具

## 前言

首先介绍下在本文出现的几个比较重要的概念：

> **函数计算（Function Compute）**：函数计算是一个事件驱动的服务，通过函数计算，用户无需管理服务器等运行情况，只需编写代码并上传。函数计算准备计算资源，并以弹性伸缩的方式运行用户代码，而用户只需根据实际代码运行所消耗的资源进行付费。l函数计算更多信息[参考](https://help.aliyun.com/product/50980.html)。
> **ImageMagick**：ImageMagick是一个用于查看、编辑位图文件以及进行图像格式转换的开放源代码[1]软件套装。它可以读取、编辑超过100种图象格式。。参见维基百科[词条](https://zh.wikipedia.org/wiki/ImageMagick)

## 快速开始

下面我们借助于函数计算的应用中心，快速地将图片转换服务给部署出来。

1. 打开函数计算 [Image Resizer 应用详情页](https://fc.console.aliyun.com/fc/applications/cn-shanghai/template/Image-Resizer#intro)。如果您尚未开通函数计算服务可能需要先开通服务，开通服务是免费的，另外函数计算有每月免费额度，试用服务不会产生费用。

    ![1576055536110-8a8eb2d2-1bf3-4b29-81f9-d9e65d8e2302.png](https://i.loli.net/2019/12/11/O38RLZyUjNqpYcD.png)

2. 滚动到[Image Resizer 应用详情页](https://fc.console.aliyun.com/fc/applications/cn-shanghai/template/Image-Resizer#intro)的最底部，点击“立即部署”按钮。

    ![74C59B41-B64B-4102-86A9-2E53460FC599.png](https://i.loli.net/2019/12/11/SawH8Cum7d12sov.png)

3. 填写应用名称：`my-image-resizer`，然后点击“部署”按钮。

    ![00FCA92D-FA89-4D3E-9C35-0E3AB3EBF860.png](https://i.loli.net/2019/12/11/hgGADHKePvbsoFR.png)

4. 拷贝 HttpTriggerEndpoint 里的网址。

    ![20191211160652.jpg](https://i.loli.net/2019/12/11/lKw2JXou4dQR3xz.jpg)

5. 在浏览器里打开上面的网址，或者通过 curl 进行调用。注意：由于没有绑定域名，所以应用中心会默认下载而不是直接在浏览器里打开图片。

    ```bash
    curl 'https://xxxxx.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/my-image-resizer-ResizeService-5A40B5A8B981/my-image-resizer-ResizeFunction-3E71C57C0094/' --output resized.jpg
    ```

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

上面我们通过了函数计算的应用中心快速上线了一个图片转换的服务。函数计算是按照调用次数收费的，所以上述服务即使保持在线也不会产生费用。而又因为函数计算每月有免费的额度，所以日常开发的调用也不会产生费用。

## 二次开发

### 依赖工具

本项目是在 MacOS 下开发的，涉及到的工具是平台无关的，对于 Linux 和 Windows 桌面系统应该也同样适用。在开始本例之前请确保如下工具已经正确的安装，更新到最新版本，并进行正确的配置。

* [Docker](https://www.docker.com/)
* [Funcraft](https://github.com/aliyun/fun)

Fun 工具依赖于 docker 来模拟本地环境。

对于 MacOS 用户可以使用 [homebrew](https://brew.sh/) 进行安装：

```bash
brew cask install docker
brew tap vangie/formula
brew install fun
```

Windows 和 Linux 用户安装请参考：

1. https://github.com/aliyun/fun/blob/master/docs/usage/installation.md

安装好后，记得先执行 `fun config` 初始化一下配置。

**注意**, 如果你已经安装过了 funcraft，确保 funcraft 的版本在 3.1.3 以上。

```bash
$ fun --version
3.1.3
```

### 初始化

```bash
git clone https://github.com/vangie/fc-image-resizer
cd fc-image-resizer
```

### 安装依赖

```bash
npm install
```

### 本地运行

```bash
$ fun local start
using template: .fun/build/artifacts/template.yml
HttpTrigger httpTrigger of ResizeService/ResizeFunction was registered
        url: http://localhost:8000/2016-08-15/proxy/ResizeService/ResizeFunction
        methods: [ 'GET' ]
        authType: ANONYMOUS


function compute app listening on port 8000!
```

然后使用浏览器或者 curl 调试网址 http://localhost:8000/2016-08-15/proxy/ResizeService/ResizeFunction

### 部署

```bash
fun deploy
```

为了获得更好的开发体验，建议安装 [Aliyun Serverless VSCode Extension](https://marketplace.visualstudio.com/items?itemName=aliyun.aliyun-serverless)

## 参考链接

1. [Funcraft](https://github.com/alibaba/funcraft)
2. [Aliyun Serverless VSCode Extension](https://github.com/alibaba/serverless-vscode)