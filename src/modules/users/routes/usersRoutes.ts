import {celebrate, Joi, Segments,} from 'celebrate'
import {Router} from 'express'
import UsersController from '../typeorm/controllers/UsersController'
const usersRouter = Router()
const usersController = new UsersController()

usersRouter.get('/', usersController.index)
usersRouter.post('/', 
    celebrate({
        [Segments.BODY]:{
            name: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required()
        }
    }) ,
    usersController.create)

export default usersRouter