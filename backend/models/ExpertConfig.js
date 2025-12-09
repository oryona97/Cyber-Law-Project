const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ExpertConfig = sequelize.define('ExpertConfig', {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'CyberLaw Expert'
  },
  system_prompt: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  max_depth: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  disclaimer_text: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'expert_configs',
  timestamps: false
});

module.exports = ExpertConfig;
