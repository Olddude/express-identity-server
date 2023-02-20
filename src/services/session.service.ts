import SessionRepository from '../repositories/session.repository';

class SessionService {
  static async findById(id: string) {
    const user = await SessionRepository.findOne({id}).exec();
    return user;
  }

  static async findAll() {
    const users = await SessionRepository.find({}).exec();
    return users;
  }
}

export default SessionService;
