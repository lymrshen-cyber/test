const express = require('express');
const multer = require('multer');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());

// --- Cloudinary 配置 ---
cloudinary.config({
    cloud_name: 'dxic8oxo1', // 替换成你自己的
    api_key: '944367769497383',       // 替换成你自己的
    api_secret: 'YOsDt0hkVGHexId_AaEtl3a7FIc'  // 替换成你自己的
});

// Multer 配置，但这次我们不保存文件，而是将文件作为 Buffer 处理
const upload = multer({
    // memoryStorage 将文件存储在内存中，而不是磁盘上
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 限制文件大小为 5MB
    }
});

// 新的上传路由
app.post('/upload', upload.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: '请上传一个文件。' });
    }

    try {
        // 将 Buffer 转换为 Data URI
        const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        // 上传到 Cloudinary
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: 'webcam-captures', // 可选：指定上传到哪个文件夹
            public_id: `capture-${Date.now()}` // 可选：指定文件名
        });

        console.log('图片已成功上传到 Cloudinary:', result.url);

        res.status(200).send({
            message: '图片上传成功！',
            fileInfo: {
                url: result.secure_url, // 返回安全的 HTTPS 链接
                public_id: result.public_id
            }
        });
    } catch (error) {
        console.error('上传到 Cloudinary 失败:', error);
        res.status(500).send({ message: '文件上传失败。' });
    }
});

app.listen(port, () => {
    console.log(`服务器正在 http://localhost:${port} 运行`);
});