# 快速搭建 Serverless 在线图片处理应用

## 简介

首先介绍下在本文出现的几个比较重要的概念：

> **函数计算（Function Compute）**：函数计算是一个事件驱动的服务，通过函数计算，用户无需管理服务器等运行情况，只需编写代码并上传。函数计算准备计算资源，并以弹性伸缩的方式运行用户代码，而用户只需根据实际代码运行所消耗的资源进行付费。函数计算更多信息[参考](https://help.aliyun.com/product/50980.html)。
> **ImageMagick**：ImageMagick 是一个用于查看、编辑位图文件以及进行图像格式转换的开放源代码软件套装。它可以读取、编辑超过100种图象格式。。参见维基百科[词条](https://zh.wikipedia.org/wiki/ImageMagick)

![](https://data-analysis.cn-shanghai.log.aliyuncs.com/logstores/article-logs/track_ua.gif?APIVersion=0.6.0&title=%E5%BF%AB%E9%80%9F%E6%90%AD%E5%BB%BA%20Serverless%20%E5%9C%A8%E7%BA%BF%E5%9B%BE%E7%89%87%E5%A4%84%E7%90%86%E5%BA%94%E7%94%A8&src=article&author=%E5%80%9A%E8%B4%A4)

ImageMagick 是图片处理的利器，借助 ImageMagick 可以轻松实现图片的裁剪和缩放。虽然很多语言都封装了 ImageMagick 的调用库，但是把图片处理功能和核心业务功能放在同一个服务内，在软件架构上往往不适合。有如下两方面的原因：

一方面，图片处理依赖外部的 bin，已经编译好的二级制不具备可移植性，给打包发布带来了麻烦。另一方面，图片处理往往是比较耗费计算资源的，对于大多数业务系统来说图片处理属于边缘业务，而非核心业务，所以为整个服务预留较多的计算资源是不划算的。更好的选择是把图片处理类业务以微服务的形式切分出来，部署在具备弹性的底层服务之上。对于此类技术需求， Serverless 是非常切合的。

本文重点介绍如何快速地在函数计算平台上部署一个弹性高可用的图片处理服务，然后在此基础上轻松的定制化。

## 快速开始

下面我们借助于函数计算的应用中心，快速地将图片转换服务给部署出来。

1. 打开函数计算 [Image Resizer 应用详情页](https://statistics.functioncompute.com/?title=%E5%BF%AB%E9%80%9F%E6%90%AD%E5%BB%BA%20Serverless%20%E5%9C%A8%E7%BA%BF%E5%9B%BE%E7%89%87%E5%A4%84%E7%90%86%E5%BA%94%E7%94%A8&src=article&author=%E5%80%9A%E8%B4%A4&url=https://fc.console.aliyun.com/fc/applications/cn-shanghai/template/Image-Resizer#intro)。如果您尚未开通函数计算服务可能需要先，开通服务是免费的，另外函数计算有每月免费额度，试用服务不会产生费用。

    ![image.png](https://i.loli.net/2019/12/11/c2jbSnyhtNXxs4A.png)

2. 滚动到[Image Resizer 应用详情页](https://statistics.functioncompute.com/?title=%E5%BF%AB%E9%80%9F%E6%90%AD%E5%BB%BA%20Serverless%20%E5%9C%A8%E7%BA%BF%E5%9B%BE%E7%89%87%E5%A4%84%E7%90%86%E5%BA%94%E7%94%A8&src=article&author=%E5%80%9A%E8%B4%A4&url=https://fc.console.aliyun.com/fc/applications/cn-shanghai/template/Image-Resizer#intro)的最底部，点击“立即部署”按钮。

    ![image.png](https://i.loli.net/2019/12/11/2KOmces5uJa1gx9.png)

3. 填写应用名称：`my-image-resizer`，然后点击“部署”按钮。

    ![image.png](https://i.loli.net/2019/12/11/9sbQJHvKlSAPL2m.png)

4. 拷贝 HttpTriggerEndpoint 里的网址。

    ![image.png](https://i.loli.net/2019/12/11/CTGUJ7qlBVwympH.png)

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

![](https://img.alicdn.com/tfs/TB1Z9fHqX67gK0jSZPfXXahhFXa-1920-1080.jpg)

FC 函数接受到 HTTP 请求之后，执行如下三个步骤：

1. 把 url 指向的图片下载下来
2. 使用 imagemagick 进行图片转换
3. 将图片通过 http 协议返回给客户端

上面我们通过了函数计算的应用中心快速上线了一个图片转换的服务。函数计算是按照调用次数收费的，所以上述服务即使保持在线也不会产生费用。而又因为函数计算每月有免费的额度，所以日常开发的调用也不会产生费用。

## 定制化开发

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
