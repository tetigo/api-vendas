import { celebrate, Joi, Segments, } from 'celebrate'
import { Router } from 'express'
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
  userAvatarController.update,
  )

export default usersRouter
