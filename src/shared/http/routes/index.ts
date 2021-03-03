import productsRouter from '@modules/products/routes/products.routes'
import sessionsRouter from '@modules/users/routes/sessionsRoutes'
import usersRouter from '@modules/users/routes/usersRoutes'
import {Router} from 'express'


const routes = Router()

routes.use('/products', productsRouter)
routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)

export default routes
