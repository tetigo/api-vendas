import { compare } from "bcryptjs";
import AppError from "@shared/errors/AppError"
import { getCustomRepository } from "typeorm"
import User from "../typeorm/entities/users"
import UsersRepository from "../typeorm/repositories/UsersRepository"
import { sign } from "jsonwebtoken";
import authConfig from "@config/auth";

interface IRequest {
  email: string,
  password: string
}

interface IResponse {
  user: User,
  token: string
}

class CreateSessionService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersRepository = getCustomRepository(UsersRepository)
    const user = await usersRepository.findByEmail(email)
    if (!user) {
      throw new AppError('Invalid Combination of Email/Password1', 401)
    }
    const isValidPass = await compare(password, user.password)
    if (!isValidPass) {
      throw new AppError('Invalid Combination of Email/Password2', 403)
    }
    const token = sign({ patati: 'patata' }, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    })
    return { user, token }
  }
}
export default CreateSessionService
