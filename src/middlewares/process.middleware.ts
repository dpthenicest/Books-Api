import multer from 'multer';
import util from 'util';

interface MulterFile extends Express.Multer.File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

const checkFileType = (file: MulterFile, cb: (error: Error | null, acceptFile: boolean) => void) => {
  if (file.fieldname === "cover_image") {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  } else {
    cb(null, true);
  }
};

const processFile = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req: Express.Request, file: MulterFile, cb: (error: any, acceptFile: boolean) => void) => {
    checkFileType(file, cb as (error: Error | null, acceptFile: boolean) => void);
  },
}).fields([
  { name: 'cover_image', maxCount: 1 },
]);

const processFileMiddleware = util.promisify(processFile) as (req: Express.Request, res: Express.Response) => Promise<void>;

export default processFileMiddleware;
