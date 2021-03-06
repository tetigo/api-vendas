import 'reflect-metadata' //precisa ser o primeiro a ser importado
import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import "express-async-errors" //precisa ser logo apos express
import cors from 'cors'
import routes from './routes'
import {errors} from 'celebrate'
import {pagination} from 'typeorm-pagination'
//esse uso de @ no path foi criado ligacao no tsconfig.json
import AppError from '@shared/errors/AppError'
import '@shared/typeorm' // faz conexão com banco automaticamente
import upload from '@config/upload'
import rateLimiter from '@shared/http/middlewares/rateLimiter'

const app = express()

//logo apos instanciar express para nada acontecer caso tenha excedido o limite de requisições por segundo
app.use(rateLimiter)

//logo após instanciar o express
//no serviço criamos querybuilder.paginate e interface
//depois na consulta concatenamos na query_params ( ?page=1&per_page=15 )
//vem configurado por padrao com 15 por pagina
app.use(pagination)
app.use(cors())
app.use(express.json())
app.use('/files', express.static(upload.directory))
app.use(routes)

app.use(errors()) //erros lançados pelo Joi na validação com celebrate

app.use((error: Error, req: Request, res: Response, next: NextFunction)=>{
  if(error instanceof AppError){
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }else{
    return res.status(500).json({
      status: 'error',
      message: `Internal Server Error\n${error.message}`
    })
  }
})

app.listen(3333, ()=>{
  console.log('Server started on port 3333')
})

