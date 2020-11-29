import Sequelize, { Model } from 'sequelize';

class Note extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        text: Sequelize.TEXT,
        private: Sequelize.BOOLEAN,
        finished: Sequelize.BOOLEAN,
        deadline: Sequelize.DATE,
        finished_at: Sequelize.DATE,
      },
      {
        sequelize,
        tableName: 'notes',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'owner_user_id',
      as: 'owner_user',
    });
    this.belongsToMany(models.User, {
      foreignKey: 'note_id',
      through: 'note_user',
      as: 'users',
    });
  }
}
export default Note;
