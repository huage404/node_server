const http = require('http');
const path = require('path');
const chalk = require('chalk');


// 引用配置文件
const router = require('./router');
const { hostname, port, root } = require('./config/defaultConfig');


// 创建一个 http 服务
const server = http.createServer((req, res) => {

    // 获取请求文件路径
    const filePath = path.join(root, req.url);
    router(req, res , filePath)

})

server.listen( port, hostname, () => {
    const text = `http://${hostname}:${port}`
    console.info(`Server started at ${chalk.green(text)}`)
})