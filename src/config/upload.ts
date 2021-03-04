//configs do multer
import multer from "multer";
import path from 'path'
import crypto from "crypto";
//__dirname é referente diretorio atual: no caso "config"
//criamos pasta uploads na raiz do projeto então precisamos voltar 2 niveis
// a partir de onde estamos e depois entrar na pasta uploads
const uploadFolderPath = path.resolve(__dirname,'..','..','uploads')

export default {
  directory: uploadFolderPath,
  storage: multer.diskStorage({
    destination: uploadFolderPath,
    filename(request, file, callback){
      const fileHash = crypto.randomBytes(10).toString('hex')
      const fileName = `${fileHash}-${file.originalname}`
      return callback(null,fileName)
    }
  })
}
