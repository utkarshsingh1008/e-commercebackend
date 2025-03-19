
import multer from "multer";
import sharp from "sharp";
import path from "path";

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * le9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
    Math;
  },
});
const multerFilter = (req, file, cb){
    if (file.mimetype.startWith('image')){
     cb(null, true)
    }
    else{
        cb({
            message:"Unsupported file"
        },
    false)
    }
}
const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: 200000 },
});
const productResizeImg =async(req, res, next)=>{
if(!req.file) return next();
await primice.all(
  req.files.map(async(file)=>{
  await sharp(file.path).resize(300,300).toFormat('jpeg').jpeg({quality:90}).toFile(`public/images/products/${file.filename}`)
  })
)
}
const blocgResizeImg =async(req, res, next)=>{
  if(!req.file) return next();
  await primice.all(
    req.files.map(async(file)=>{
    await sharp(file.path).resize(300,300).toFormat('jpeg').jpeg({quality:90}).toFile(`public/images/blogs/${file.filename}`)
    }))}

export  {uploadPhoto ,productResizeImg, blocgResizeImg}