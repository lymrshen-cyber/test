const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path'); // 新增：用于处理文件路径
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());

// --- Cloudinary 配置 ---
cloudinary.config({
    cloud_name: 'dxic8oxo1',
    api_key: '944367769497383',
    api_secret: 'YOsDt0hkVGHexId_AaEtl3a7FIc'
});

// Multer 配置，将文件存储在内存中
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// 新增：为根 URL (/) 提供 index.html 文件服务
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 上传图片的路由
app.post('/upload', upload.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: '请上传一个文件。' });
    }

    try {
        const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: 'webcam-captures',
            public_id: `capture-${Date.now()}`
        });

        console.log('图片已成功上传到 Cloudinary:', result.url);

        res.status(200).send({
            message: '图片上传成功！',
            fileInfo: {
                url: result.secure_url,
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


