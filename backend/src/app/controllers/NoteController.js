import * as Yup from 'yup';
import { ptShort } from 'yup-locale-pt';
import { Op } from 'sequelize';

import Note from '../models/Note';

Yup.setLocale(ptShort);

class NoteController {
  async index(req, res) {
    const { id: user_id } = req.userData;

    const notes = await Note.findAll({
      where: {
        [Op.or]: [{ owner_user_id: user_id }],
      },
      include: [
        {
          association: 'users',
          attributes: ['name', 'id', 'email'],
          through: { attributes: [] },
        },
        {
          association: 'owner_user',
          attributes: ['name', 'email'],
        },
      ],
    });
    return res.status(200).json(notes);
  }

  async store(req, res) {
    try {
      const { users, ...data } = req.body;
      data.owner_user_id = req.userData.id;
      const note = await Note.create(data);
      if (users && users.length > 0) {
        await note.addUser(users);
      }
      return res.status(200).json(note);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async delete(req, res) {
    const { note_id } = req.body;
    const { id: user_id } = req.userData;
    const note = await Note.findOne({ where: { note_id } });
    // if (user_id == note.owner_user_id) {
    //   await
    // }

    return res.status(200).json(note);
  }
}

export default new NoteController();
