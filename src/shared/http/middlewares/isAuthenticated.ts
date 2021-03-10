import auth from "@config/auth";
import AppError from "@shared/errors/AppError";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface ITokenPayload{
  patati?: string,
  iat: number,
  exp: number,
  sub: string
}

function isAuthenticated(req: Request, res: Response, next: NextFunction){
  const token = req.headers.authorization
  if(!token){
    throw new AppError('No JWT Token was sent', 401)
  }
  const decodedToken = verify(token, auth.jwt.secret) as ITokenPayload
  if(!decodedToken){
    throw new AppError('Invalid JWT Token', 403)
  }
  console.log('decodedToken', decodedToken)

  //usando src/@types/Express/index.d.ts
  //precisa setar typeroots no tsconfig.json ficando assim:
  // "typeRoots": [
  //   "@types",
  //   "./node_modules/@types"
  // ],                       /* List of folders to include type definitions from. */
  // req.user.id = decodedToken.sub // parace não funcionar, quebra nessa linha

  //usando objeto locals disponivel do response pra
  //passar dados entre as requisições
  //esse tá funcionando diretão sem precisar configurar nada
  res.locals.userId = decodedToken.sub
  next()
}
export default isAuthenticated
