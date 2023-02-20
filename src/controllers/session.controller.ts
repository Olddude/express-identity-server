import { Request, Response } from 'express';

import SessionService from '../services/session.service';

/**
 * Controller for managing user accounts.
 */
class SessionController {
  /**
   * Route handler for GET /users.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   */
  static async getSessions(req: Request, res: Response) {
    const sessions = await SessionService.findAll();
    res.render('session.view.ejs', {sessions});
  }
}

export default SessionController;
