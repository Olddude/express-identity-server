import { Request, Response } from 'express';

import IndexModel from '../models/index.model';

class IndexController {
  static async getIndex(req: Request, res: Response) {
    const session = req.session;
    if (session) {
      const indexModel = new IndexModel('title', 'content');
      res.render('index.view.ejs', indexModel);
    } else {
      res.redirect('/login');
    }
  }
}

export default IndexController;
