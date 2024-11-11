import { CustomInjectable } from 'src/common/dependecy-injection/injectable';
import { User, UserAttributes } from 'src/users/domain/entities/user.entity';
import { UserRepository } from 'src/users/domain/repository/user.repository';
import { v4 as uuidv4 } from 'uuid';


@CustomInjectable()
export class InMemoryUserRepository implements UserRepository {
    
    async update(user: User): Promise<void> {
        throw new Error('Method not implemented.');
    }
    private userInMemory: UserAttributes[] = [];

    async login(id: string): Promise<User | null> {
        throw new Error('Method not implemented.');
    }
    
    async create(user: User): Promise<User> {
        /* const id = uuidv4();
        const model = new User({userId, ...user});
        this.userInMemory.push(model.toValue());
        return model; */
        return null;
    }

    async getById(id: string): Promise<User | null> {
        /* const user = this.userInMemory.find((user)=>user.id===id);
        return user? new User(user): null; */
        return null;
    }
}