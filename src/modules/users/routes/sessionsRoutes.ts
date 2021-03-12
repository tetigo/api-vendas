import { Router } from "express";
import SessionsController from "../controllers/SessionsController";
import { Joi, Segments, celebrate } from "celebrate";

const sessionsController = new SessionsController()
const sessionsRouter = Router()

sessionsRouter.post('/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  }),
  sessionsController.create)

export default sessionsRouter
