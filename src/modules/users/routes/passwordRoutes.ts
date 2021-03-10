import isAuthenticated from "@shared/http/middlewares/isAuthenticated"
import { celebrate, Joi, Segments } from "celebrate"
import ForgotPasswordController from "../controllers/ForgotPasswordController"
import ResetPasswordController from "../controllers/ResetPasswordController"
import SendForgotPasswordEmailService from "../services/SendForgotPasswordEmailService"

const {Router} = require('express')

const passwordRouter = new Router()
const forgotPasswordController = new ForgotPasswordController()
const resetPasswordController = new ResetPasswordController()

passwordRouter.post(
    '/forgot',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required()
        }
    }),
    forgotPasswordController.create
)

passwordRouter.post(
    '/reset',
    celebrate({
        [Segments.BODY]: {
            token: Joi.string().uuid().required(),
            password: Joi.string().required(),
            password_confirmation: Joi.string().required().valid(Joi.ref('password')),
        },
    }),
    resetPasswordController.create
)

export default passwordRouter
