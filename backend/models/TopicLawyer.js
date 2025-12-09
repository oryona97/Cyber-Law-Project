const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TopicLawyer = sequelize.define('TopicLawyer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  topic_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'topics',
      key: 'id'
    }
  },
  lawyer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'lawyers',
      key: 'id'
    }
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'topic_lawyers',
  timestamps: false
});

module.exports = TopicLawyer;
