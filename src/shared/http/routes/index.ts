import customersRoutes from '@modules/customers/routes/CustomersRoutes'
import ordersRoutes from '@modules/orders/routes/orders.routes'
import productsRouter from '@modules/products/routes/products.routes'
import passwordRouter from '@modules/users/routes/passwordRoutes'
import profileRouter from '@modules/users/routes/profileRoutes'
import sessionsRouter from '@modules/users/routes/sessionsRoutes'
import usersRouter from '@modules/users/routes/usersRoutes'
import {Router} from 'express'


const routes = Router()

routes.use('/products', productsRouter)
routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)
routes.use('/password', passwordRouter)
routes.use('/profile', profileRouter)
routes.use('/customers', customersRoutes)
routes.use('/orders', ordersRoutes)

export default routes
