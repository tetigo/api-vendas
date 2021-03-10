import AppError from "@shared/errors/AppError"
import { getCustomRepository } from "typeorm"
import UsersRepository from "../typeorm/repositories/UsersRepository"
import UsersTokensRepository from "../typeorm/repositories/UsersTokensRepository"

interface IRequest {
    email: string
}

class SendForgotPasswordEmailService {
    public async execute({ email }: IRequest): Promise<void> {
        const userRepository = getCustomRepository(UsersRepository)
        const userTokensRepository = getCustomRepository(UsersTokensRepository)

        const user = await userRepository.findByEmail(email)
        if (!user) {
            throw new AppError('User does not exists')
        }
        //@ts-ignore
        const userToken = await userTokensRepository.generate(user.id)

        console.log('generated_token--->>', userToken)


    }
}
export default SendForgotPasswordEmailService