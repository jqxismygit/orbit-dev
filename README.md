# orbit-dev


## 使用

安装依赖。

```bash
# 安装依赖
$ npm i

$ cd app
$ npm i
$ cd ../

# rebuild 生产依赖
$ npm run rebuild
```

启动本地调试。

```bash
$ npm run dev
```

你也可以分开运行 `npm run dev:renderer` 和 `npm run dev:main`。

打包。

```bash
$ npm run pack

# 不打 dmg、exe 包，本地验证时用
$ npm run pack:dir

# 不重复做 webpack 层的构建和 rebuild，本地验证打包流程用
$ npm run pack:dirOnly
```