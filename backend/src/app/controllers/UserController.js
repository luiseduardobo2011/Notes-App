import * as Yup from 'yup';
import { ptShort } from 'yup-locale-pt';

import User from '../models/User';

Yup.setLocale(ptShort);

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      try {
        await schema.validate(req.body);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: error.message,
          field: error.params.path,
        });
      }
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'Email já está em uso.' });
    }

    const { id, name, email } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string(),
      password: Yup.string().when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.min(6).required() : field
      ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password
          ? field
              .required()
              .oneOf(
                [Yup.ref('password')],
                'Confirmação de senha deve ser igual a senha.'
              )
          : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      try {
        await schema.validate(req.body);
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: error.message,
          field: error.params.path,
        });
      }
    }

    const { email, oldPassword, password } = req.body;

    const user = await User.findByPk(req.userData.id);

    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });
      if (userExists) {
        return res.status(401).json({
          success: false,
          error: 'Email em uso.',
          field: 'email',
        });
      }
    }

    if (password && !oldPassword) {
      return res.status(401).json({
        success: false,
        error: 'Obrigatório.',
        field: 'oldPassword',
      });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({
        success: false,
        error: 'Senha atual e nova senha não conferem.',
        field: ['oldPassword', 'password'],
      });
    }

    const { id, name } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }
}

export default new UserController();
