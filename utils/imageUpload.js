const multer = require('multer');

const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');


//chage all require to import
// import multer from 'multer';
// import sharp from 'sharp';
// import ffmpeg from 'fluent-ffmpeg';
// import imagemin from 'imagemin';
// import imageminJpegtran from 'imagemin-jpegtran';
// import imageminPngquant from 'imagemin-pngquant';



let imagesPath = 'public/IMAGES';
let videosPath = 'public/VIDEOS';
let audiosPath = 'public/AUDIOS';
let documentsPath = 'public/DOCUMENTS';



const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'video/mp4': 'mp4',
    'video/ogg': 'ogg',
    'video/webm': 'webm',
    'audio/mpeg': 'mp3',
    'text/plain': 'txt'
};



const storage = multer.diskStorage({
    destination: (req, file, callback) => {

        const extension = MIME_TYPES[file.mimetype];

        if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif' || extension === 'svg') {
            callback(null, imagesPath);
        } else if (extension === 'mp4' || extension === 'ogg' || extension === 'webm') {
            callback(null, videosPath);
        } else if (extension === 'mp3') {
            callback(null, audiosPath);
        } else if (extension === 'txt') {
            callback(null, documentsPath);
        }
        
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

const filter = (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif' || extension === 'svg' || extension === 'mp4' || extension === 'ogg' || extension === 'webm' || extension === 'mp3' || extension === 'txt') {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

//upload mulple
const upload = multer({
    storage: storage,
    //dont set any limits
    limits: {
        //allow any file size
        fileSize: 1024 * 1024 * 1024
    },
    fileFilter: filter
});


// step 1 = resize an image before uploading
// step 2 = resize a video before uploading
// step 3 = compress an image before uploading
// step 4 = then save to multer storage

// step 1
const resizeImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }
        const extension = MIME_TYPES[req.file.mimetype];
        const fileName = req.file.filename.split('.')[0];
        const filePath = req.file.destination + '/' + fileName + '.' + extension;
        await sharp(req.file.path)
            .resize(500, 500)
            .toFile(filePath);
        next();
    } catch (error) {
        console.log(error);
    }
};

// step 2

const resizeVideo = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }
        const extension = MIME_TYPES[req.file.mimetype];
        const fileName = req.file.filename.split('.')[0];
        const filePath = req.file.destination + '/' + fileName + '.' + extension;
        await ffmpeg(req.file.path)
            .size('500x500')
            .output(filePath)
            .on('end', () => {
                next();
            })
            .on('error', (err) => {
                console.log(err);
            })
            .run();
    } catch (error) {
        console.log(error);
    }
};

// step 3

const compressImage = async (req, res, next) => {

    try {
        if (!req.file) {
            return next();
        }
        const extension = MIME_TYPES[req.file.mimetype];
        const fileName = req.file.filename.split('.')[0];
        const filePath = req.file.destination + '/' + fileName + '.' + extension;
        await imagemin([req.file.path], {
            destination: req.file.destination,
            plugins: [
                imageminJpegtran(),
                imageminPngquant({
                    quality: [0.6, 0.8]
                })
            ]
        });
        next();
    } catch (error) {
        console.log(error);
    }
};

module.exports = upload;
//export default upload(resizeImage(resizeVideo(compressImage)));

//upload,
// resizeImage,
// resizeVideo,
// compressImage

