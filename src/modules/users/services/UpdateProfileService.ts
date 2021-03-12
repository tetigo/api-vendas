import AppError from "@shared/errors/AppError";
import { compare, hash } from "bcryptjs";
import { appendFile } from "node:fs";
import { getCustomRepository } from "typeorm";
import User from "../typeorm/entities/users";
import UsersRepository from "../typeorm/repositories/UsersRepository";

interface IRequest {
    user_id: string,
    name: string,
    email: string,
    password?: string,
    old_password?: string
}

class UpdateProfileService {
    public async execute({ user_id, name, email, password, old_password }: IRequest): Promise<User> {
        const userRepository = getCustomRepository(UsersRepository)
        const user = await userRepository.findById(user_id)
        if (!user) {
            throw new AppError('User not found')
        }
        const emailExists = await userRepository.findByEmail(email) as User
        if(emailExists && emailExists.id !== user.id){
            throw new AppError('Email already exists')
        } 
        if(password && !old_password){
            throw new AppError('Old password is required')
        }
        if(old_password){
            const isOK = await compare(old_password, user.password)
            if(!isOK){
                throw new AppError('Wrong Old Password')
            }
        }
        user.name = name
        user.email = email
        if(password) user.password = await hash(password, 8)
        
        await userRepository.save(user)
        return user
    }
}
export default UpdateProfileService