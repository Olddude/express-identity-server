import { Request, Response } from 'express';

import UserService from '../services/user.service';

class UserController {
  static async getUsers(req: Request, res: Response) {
    const users = await UserService.findAll();
    res.render('user.view.ejs', {users});
  }
}

export default UserController;
