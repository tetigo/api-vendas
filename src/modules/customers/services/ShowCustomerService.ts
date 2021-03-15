import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import Customer from "../typeorm/entities/Customer";
import CustomersRepository from "../typeorm/repositories/CustomersRepository";

interface IRequest {
    id: string
}

class ShowCustomerService {
    public async execute({ id }: IRequest): Promise<Customer> {
        const customerRepository = getCustomRepository(CustomersRepository)
        const customer = await customerRepository.findOne(id)
        if (!customer) {
            throw new AppError('Customer does not exists')
        }
        return customer
    }
}
export default ShowCustomerService