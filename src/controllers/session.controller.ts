import { Request, Response } from 'express';

import SessionService from '../services/session.service';

class SessionController {
  static async getSessions(req: Request, res: Response) {
    const sessions = await SessionService.findAll();
    res.render('session.view.ejs', {sessions});
  }
}

export default SessionController;
