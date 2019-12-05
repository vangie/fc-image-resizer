## Introduction

This is an online image conversion service. The client sends the image url,
expected width and height to the function.The function will convert the image and return the result to the client through the HTTP protocol. The client will view (or download) the converted image through the browser.

![image_resizer](https://yqfile.alicdn.com/3ed38b55e075aa7b0d89fde7b9a46c785103cf7b.gif)

## Usage

```bash
curl 'http://localhost:8000/2016-08-15/proxy/ResizeService/ResizeFunction?width=300&height=100&url=https://file01.dysucai.com/d/file/lan20191114/pb2qtf3cewu.jpg' --output resized.jpg
```

Please replace the above string `http: // localhost: 8000 /` with the deployed address of your application.

## Architecture & Design

This is a single function application with Http Trigger. The Http Trigger exposes the service as an GET method. The client passes three request parameters: url, width, and height.

* url - Indicates the source image address that needs to be processed
* width - Indicates the width of the cropped or scaled picture
* height - Indicates the cropped picture width. When this parameter is missing, it means that the picture is adjusted by scaled.

The architecture diagram of the application is as follows:

![_001_jpeg](https://yqfile.alicdn.com/3bb06af5d6162bba4669928687d6afd5a56433b5.jpeg)

After the FC function receives the HTTP request, it performs the following three steps:

1. Download the image from the url
2. Convert image by Imagemagick
3. Responses the picture to the client via the http protocol

Source code: https://github.com/vangie/fc-image-resizer