import { Request, Response } from 'express';

import ClientService from '../services/client.service';

class ClientController {
  static async getClients(req: Request, res: Response) {
    const clients = await ClientService.findAll();
    res.render('client.view.ejs', {clients});
  }
}

export default ClientController;
