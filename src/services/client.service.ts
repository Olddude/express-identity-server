import createLogger from '../logger';
import ClientRepository from '../repositories/client.repository';

class ClientService {
  static async findById(id: string) {
    const client = await ClientRepository.findOne({id}).exec();
    return client;
  }

  static async findByIdSecretAndScope(id: string, secret: string, scope: string) {
    const client = await ClientRepository.findOne({id, secret, scope});
    return client;
  }

  static async findAll() {
    const users = await ClientRepository.find({}).exec();
    return users;
  }

  static async createOne() {
    const logger = await createLogger(
      `${ClientService.name}.${this.createOne.name}`,
    );
    try {
      const client = await ClientRepository.create({
        id: 'default',
        secret: 'default',
        scope: 'default',
      });
      return client;
    } catch (error) {
      logger.error(error);
    }
  }
}

export default ClientService;
