import AppError from "@shared/errors/AppError"
import { getCustomRepository } from "typeorm"
import User from "../typeorm/entities/users"
import UsersRepository from "../typeorm/repositories/UsersRepository"

import path from 'path'
import uploadConfig from '@config/upload'
import fs from "fs"

interface IRequest {
  user_id: string,
  avatar_filename: string,
}

//pra usar esse serviço, o usuario já foi autenticado, então já possui user_id
class UpdateUserAvatarService {
  public async execute({ user_id, avatar_filename }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository)


    console.log('avatar_filename', avatar_filename)
    console.log('directory', uploadConfig.directory)
    console.log('path', path.join(uploadConfig.directory, avatar_filename))
    console.log('user', user_id)

    let user = await usersRepository.findById(user_id)
    if (!user) {
      throw new AppError('User not found')
    }

    console.log('user.avatar', user.avatar)

    if (user.avatar !== undefined && user.avatar !== null) {
      try {
        const userAvatarFilepath = path.join(uploadConfig.directory, user.avatar)
        const existsAvatar = await fs.promises.stat(userAvatarFilepath)
        if (existsAvatar !== undefined) {
          console.log('existavatar', existsAvatar)
          await fs.promises.unlink(userAvatarFilepath)
        } else {
          user.avatar = ''
        }
      } catch (error) {
        user.avatar = ''
      }
    }
    user.avatar = avatar_filename
    await usersRepository.save(user)
    return user
  }
}
export default UpdateUserAvatarService
