import { Request, Response } from 'express';

import LoginModel from '../models/login.model';

class LoginController {
  static async postLoginApi(req: Request, res: Response) {
    res.redirect('/users');
  }

  static async getLoginHtml(req: Request, res: Response) {
    const loginModel = new LoginModel('', '');
    res.render('login.view.ejs', loginModel);
  }
}

export default LoginController;
