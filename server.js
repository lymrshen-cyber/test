const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

// 使用 cors 中间件允许跨域请求
app.use(cors());

// 提供静态文件服务（前端文件）
app.use(express.static('main'));

// 设置文件存储引擎
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 文件将被保存在 'uploads/' 目录下
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // 定义文件名，防止重名
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// 初始化 multer，并指定存储配置
const upload = multer({ storage: storage });

// 确保 uploads 目录存在
const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// 设置处理上传的路由
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: '请上传一个视频文件。' });
    }

    console.log('视频文件已接收:', req.file.filename);

    // 返回成功响应
    res.status(200).send({
        message: `视频 ${req.file.filename} 上传成功！`,
        fileInfo: {
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size
        }
    });
});

// 处理根路径请求，返回 index.html（这里假设你的前端文件放在 'public' 文件夹里）
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器正在 http://localhost:${port} 运行`);
});

