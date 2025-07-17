const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 要转换的图片列表
const images = [
  'songless-unlimited1.png',
  'songless-unlimited2.png',
  'songless-unlimited3.png',
  'songless-unlimited4.png'
];

// 源目录和目标目录
const sourceDir = path.join(__dirname, '../public/imgs/features');
const targetDir = path.join(__dirname, '../public/imgs/features');

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 转换每个图片
async function convertImages() {
  console.log('开始转换图片为WebP格式...');
  
  for (const image of images) {
    const sourcePath = path.join(sourceDir, image);
    const targetPath = path.join(targetDir, image.replace('.png', '.webp'));
    
    console.log(`转换: ${sourcePath} -> ${targetPath}`);
    
    try {
      await sharp(sourcePath)
        .webp({ quality: 85 }) // 设置WebP质量为85%
        .toFile(targetPath);
      
      console.log(`成功转换: ${image} -> ${image.replace('.png', '.webp')}`);
    } catch (error) {
      console.error(`转换 ${image} 失败:`, error);
    }
  }
  
  console.log('图片转换完成！');
}

convertImages().catch(err => {
  console.error('转换过程中发生错误:', err);
  process.exit(1);
}); 