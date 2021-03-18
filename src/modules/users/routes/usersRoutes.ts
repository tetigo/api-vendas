import { celebrate, Joi, Segments, } from 'celebrate'
import { NextFunction, Router, Request, Response } from 'express'
import UsersController from '../controllers/UsersController'
import isAuthenticated from '../../../shared/http/middlewares/isAuthenticated'
import uploadConfig from '@config/upload'
import multer from 'multer'
import UserAvatarController from '../controllers/UserAvatarController'

const usersRouter = Router()
const usersController = new UsersController()
const userAvatarController = new UserAvatarController()
const upload = multer(uploadConfig)

usersRouter.get('/', isAuthenticated, usersController.index)

// const userPostSchema={
//   body:{
//     name: Joi.string().required(),
//     email: Joi.string().email().required(),
//     password: Joi.string().required()
//   }
// }
usersRouter.post('/',
  // celebrate(userPostSchema),
  celebrate({
    [Segments.BODY]:{
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  }),
  usersController.create)


usersRouter.patch(
  '/avatar',
  isAuthenticated,
  upload.single('avatar'),
  function teste(req: Request, res: Response, next: NextFunction){
    console.log('reqqqqqq', req.file)
    // res.locals.userId = 'd7b826dd-32e4-43cf-9df6-d2de9c1a3dd9'
    console.log(res.locals.userId)
    next()
  },
  userAvatarController.update,
  )

export default usersRouter
