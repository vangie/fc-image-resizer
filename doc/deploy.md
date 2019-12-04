## 部署

应用模板会基于 [资源编排（ROS）](https://ros.console.aliyun.com/) 进行部署，请确保您已经开通了资源编排服务。

如果当前登录的帐号是子账号，则该子账号需要拥有资源编排的相关权限。

## 资源
- 函数计算服务资源
  - 名称生成规则：FnFSampleFCService-<RandomSuffix>
- 函数计算函数资源
  - 名称生成规则：FnFSampleFCFunction--<RandomSuffix>
  - 运行环境：nodejs10
  - 函数入口：index.handler
