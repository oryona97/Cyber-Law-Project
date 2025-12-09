const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conversation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'conversations',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  topic_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'topics',
      key: 'id'
    }
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('new', 'assigned', 'contacted', 'closed'),
    defaultValue: 'new'
  },
  secretary_id: {
    type: DataTypes.INTEGER,
    allowNull: true // Assuming system user ID
  },
  lawyer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'lawyers',
      key: 'id'
    }
  }
}, {
  tableName: 'leads',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Lead;
