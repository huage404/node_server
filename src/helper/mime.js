
const path = require('path')

const mimeType = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'text/javascript',
    'json': 'application/json',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'xml': 'text/xml',
    'txt': 'text/plain',
    'md': 'text/plain',
    '*': 'application/octet-stream'
}

module.exports = (filePath)=>{
    let ext = path.extname(filePath).split('.').pop().toLowerCase();

    if(!ext){
        ext = filePath
    }

    return mimeType[ext]
}