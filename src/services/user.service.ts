import createLogger from '../logger';
import UserRepository from '../repositories/user.repository';

class UserService {
  static async findById(id: string) {
    const user = await UserRepository.findOne({id}).exec();
    return user;
  }

  static async findByUsernameAndPassword(email: string, passwordHash: string) {
    const user = await UserRepository.findOne({email, passwordHash});
    return user;
  }

  static async findAll() {
    const users = await UserRepository.find({}).exec();
    return users;
  }

  static async createOne() {
    const logger = await createLogger(this.createOne.name);
    try {
      const user = await UserRepository.create({
        email: 'john.doe@localhost.com',
        username: 'john_doe',
        passwordHash: 'password',
        firstname: 'John',
        lastname: 'Doe',
      });
      return user;
    } catch (error) {
      logger.error(error);
    }
  }
}

export default UserService;
