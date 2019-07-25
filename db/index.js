const Sequelize = require('sequelize');
const config = require('config');

const sequelize = new Sequelize(config.db);

class Form extends Sequelize.Model { };
Form.init({
  name: { type: Sequelize.STRING, allowNull: false },
  domain: { type: Sequelize.STRING, allowNull: false },
  fields_count: { type: Sequelize.INTEGER, allowNull: false },
  fields: {
    type: Sequelize.STRING(2000), allowNull: false,
    get() {
      return JSON.parse(this.getDataValue('fields'));
    },
    set(value) {
      this.setDataValue('fields', JSON.stringify(value));
    }
  },
}, {
    sequelize, modelName: 'form', indexes: [
      {
        unique: false,
        fields: ['domain']
      }
    ]
  });


class Fill extends Sequelize.Model { };
Fill.init({
  formId: { type: Sequelize.INTEGER, allowNull: false },
  domain: { type: Sequelize.STRING, allowNull: false },
  fields: {
    type: Sequelize.STRING(2000), allowNull: false,
    get() {
      return JSON.parse(this.getDataValue('fields'));
    },
    set(value) {
      this.setDataValue('fields', JSON.stringify(value));
    }
  },
}, {
    sequelize, modelName: 'fill', indexes: [
      {
        unique: false,
        fields: ['domain', 'formId']
      }
    ]
  });

module.exports = {
  db: sequelize,
  Form,
  Fill,
};
