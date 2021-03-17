import { getCustomRepository } from "typeorm";
import Customer from "../typeorm/entities/Customer";
import CustomersRepository from "../typeorm/repositories/CustomersRepository";

//copiei a interface do retorno do paginate()
interface IPaginateCustomer{
    from: number | any;
    to: number | any;
    per_page: number | any;
    total: number | any;
    current_page: number | any;
    prev_page?: number | null;
    next_page?: number | null;
    data: Array<Customer | object | any> | any;
}

class ListCustomerService {
    //alteracao para usar o pagination
    public async execute(): Promise<IPaginateCustomer> {
        const customerRepository = getCustomRepository(CustomersRepository)
    //     const customers = await customerRepository.find()
        const customers = await customerRepository.createQueryBuilder().paginate()
        return customers as IPaginateCustomer
    }
}
export default ListCustomerService
