const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const Handlebars = require('handlebars');


// 使用 promisify 将异步 API 转换为 Promise
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

// 引用配置文件
const mime = require('../helper/mime');
const compress = require('../helper/compress');
const conf = require('../config/defaultConfig');
const range = require('../helper/range')

// 使用模板文件
const tplPath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());


module.exports = async function router(req, res, filePath) {
    try {
        const stats = await stat(filePath);
        // 判断是否是文件
        if (stats.isFile()) {

            const contentType = mime(filePath)
            res.setHeader('Content-Type', contentType);
            let rs;

            console.log(req.headers)

            const {code , start , end} = range(stats.size, req , res);

            console.log(code , start , end)

            if(code === 200){
                res.statusCode = 200;
                rs = fs.createReadStream(filePath);
            }else{
                res.statusCode = 216;
                rs = fs.createReadStream(filePath, { start , end });
            }
            if (filePath.match(conf.compress)) {
                rs = compress(rs, req, res)
            }
            rs.pipe(res)
        } else if (stats.isDirectory()) {
            // 如果是目录
            const files = await readdir(filePath)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
            const dir = path.relative(conf.root, filePath)
            const data = {
                title: path.basename(filePath),
                dir: dir ? `/${dir}` : '',
                files
            }
            res.end(template(data))
        }
    } catch (err) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain;charset=utf-8');
        res.end(`文件不存在: err: ${err}`);
        return;
    }
}

