import Sequelize from 'sequelize';

import User from '../app/models/User';
import Note from '../app/models/Note';

import databaseConfig from '../config/database';

const models = [User, Note];
class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
