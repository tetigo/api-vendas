import AppError from "@shared/errors/AppError"
import { compare, hash } from "bcryptjs"
import { getCustomRepository } from "typeorm"
import UsersRepository from "../typeorm/repositories/UsersRepository"
import UsersTokensRepository from "../typeorm/repositories/UsersTokensRepository"
import { isAfter, addHours } from "date-fns";

interface IRequest {
    token: string,
    password: string
}

class ResetPasswordService {
    public async execute({ token, password }: IRequest): Promise<void> {
        const userRepository = getCustomRepository(UsersRepository)
        const userTokensRepository = await getCustomRepository(UsersTokensRepository)

        const userToken = await userTokensRepository.findByToken(token)
        if (!userToken) {
            throw new AppError('User Token does not exists')
        }
        //@ts-ignore
        const validDateTime = addHours(userToken.created_at, 2)
        if (isAfter(Date.now(), validDateTime)) {
            throw new AppError('Token expired')
        }

        //@ts-ignore
        let user = await userRepository.findById(userToken.user_id)
        if (!user) {
            throw new AppError('User does not exists')
        }
        
        const newPassword = await hash(password, 8)

        //@ts-ignore
        user.password = newPassword
        //@ts-ignore
        await userRepository.save(user)

    }
}
export default ResetPasswordService