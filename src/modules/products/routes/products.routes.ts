import { Router } from 'express'
import ProductsController from '../controllers/ProductsController'
import { celebrate, Joi, Segments } from 'celebrate'


const productsRouter = Router()
const productsController = new ProductsController()

productsRouter.get('/', productsController.index)

const parameters1 = { [Segments.PARAMS]: { id: Joi.string().uuid().required() } }
productsRouter.get('/:id', celebrate(parameters1), productsController.show)

const parameters2 = {
  [Segments.BODY]: {
    name: Joi.string().required(),
    price: Joi.number().precision(2).required(),
    quantity: Joi.number().required(),
  }
}
productsRouter.post('/', celebrate(parameters2), productsController.create)


const parameters3 = {
  [Segments.BODY]: {
    name: Joi.string().required(),
    price: Joi.number().precision(2).required(),
    quantity: Joi.number().required(),
  },
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required()
  }
}
productsRouter.put('/:id', celebrate(parameters3), productsController.update)


productsRouter.delete('/:id', celebrate(parameters1), productsController.delete)

export default productsRouter
