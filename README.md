# TurnUp自动化Mint脚本

## 🛠 使用说明

### Step 1: 首先安装 nodejs

先去 Nodejs 官网下载安装自己电脑操作系统对应的版本

```bash
https://nodejs.org/en
```

然后看一下安装的版本，是否安装成功

```bash
node -v
npm -v
```

如果你更喜欢使用 yarn 则安装 yarn
```bash
npm i -g yarn
```

### Step 2: 下载脚本源代码
先用 git clone 源代码到本地
```bash
git clone https://github.com/ywqonly/turnUpAutoRun.git

cd turnUpAutoRun
```
如果是 Windows 电脑没有安装 git，先去下面网站下载安装 git 软件
```bash
https://gitforwindows.org
```

### Step 3: 重命名当前目录下的 config.js.example 为 config.js 文件
```bash
cp config.js.example config.js
```

### Step 4: 修改当前目录下的 config.js 配置文件
```javascript
const config = {
    // 定时执行规则，默认5分钟一次，其他规则可以参考：https://juejin.cn/post/7163608389233147918
    corn: "0 */5 * * * *",
	// 需要执行的token，用电脑登录之后，按F12，取userinfo接口传的token
    tokens: ["1","2","3"]
}
```

### Step 5: 安装依赖包
```bash
npm i
```
or
```bash
yarn install
```

### Step 6: 运行脚本程序
```shell
node index.js
```
or
```shell
yarn start
```
or
```shell
npm run start
```
