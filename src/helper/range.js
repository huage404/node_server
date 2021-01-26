module.exports = (totalSize, req, res) => {


    // 获取请求的 range
    const range = req.headers['range'];

    // 如果请求中不带 range ，则不使用 range
    if(range){
        const sizes = range.match(/bytes=(\b*)-(\b*)/);
        const end = sizes[2] || totalSize - 1;
        const start = sizes[1] || totalSize - end;
    
        if (start > end || start < 0 || end > totalSize) {
            return { code: 200 }
        }
    
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Range', `bytes ${start}-${end}/${totalSize}`);
        res.setHeader('Content-Length', end - start)
    
        return {
            code: 206,
            start: parseInt(start),
            end: parseInt(end)
        }
    }else{
        return { code: 200 }
    }    
}