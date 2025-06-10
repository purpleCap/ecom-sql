import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

interface MulterFile {
    path: string;
    filename: string;
}

const multerStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'))
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
    }
});

const multerFilter = (_: any, file: any, cb: Function) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb({
            message: "Unsupported file format"
        }, false)
    }
}

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 2000000}
});

const productImgResize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!req.files) return next();
    
        const files = req.files as MulterFile[];
        const outputDir = path.join(__dirname, '../public/images');
        console.log("OUTDIR", outputDir);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
    
        await Promise.all(
            files.map(async (file) => {
                await sharp(file.path)
                .resize(300, 300)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`${outputDir}/products/${file.filename}`);
                fs.unlinkSync(`${outputDir}/products/${file.filename}`);
            })
        );
        next();
    } catch(err) {
        console.log(err)
        next(err);
    }
}

const blogImgResize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!req.files) return next();
    
        const files = req.files as MulterFile[];
        const outputDir = path.join(__dirname, '../public/images');
        console.log("OUTDIR", outputDir);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        await Promise.all(
            files?.map(async (file) => {
                await sharp(file.path)
                .resize(300, 300)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`${outputDir}/blogs/${file.filename}`);
                fs.unlinkSync(`${outputDir}/blogs/${file.filename}`);
            })
        );
        next();
    } catch(err) {
        console.log(err);
        next(err);
    }
}

export { uploadPhoto, productImgResize, blogImgResize };