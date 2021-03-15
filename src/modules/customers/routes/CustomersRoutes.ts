import isAuthenticated from '@shared/http/middlewares/isAuthenticated'
import { celebrate, Joi } from 'celebrate'
import Router from 'express'
import CustomersController from '../controllers/CustomersController'

const customersRoutes = Router()
const customersController = new CustomersController()

customersRoutes.use(isAuthenticated)

customersRoutes.get('/', customersController.index)

customersRoutes.get('/:id',
    celebrate({
        params: { id: Joi.string().uuid().required() }
    }),
    customersController.show)

customersRoutes.post('/',
    celebrate({
        body: {
            name: Joi.string().required(),
            email: Joi.string().email().required()
        }
    }),
    customersController.create)

customersRoutes.put('/:id',
    celebrate({
        params: { id: Joi.string().uuid().required() },
        body: {
            name: Joi.string().optional(),
            email: Joi.string().email().optional()
        }
    }),
    customersController.update)

customersRoutes.delete('/:id',
    celebrate({
        params: { id: Joi.string().uuid().required() }
    }),
    customersController.delete)

export default customersRoutes