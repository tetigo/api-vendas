import {Router} from 'express'

const routes = Router()

routes.get('/', (rq, res)=>{
  return res.json({message: 'Hi Dev!'})
})

export default routes
