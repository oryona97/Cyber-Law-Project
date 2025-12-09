const { sequelize } = require('../config/database');

const User = require('./User');
const Topic = require('./Topic');
const ExpertConfig = require('./ExpertConfig');
const Conversation = require('./Conversation');
const Message = require('./Message');
const Lawyer = require('./Lawyer');
const TopicLawyer = require('./TopicLawyer');
const Lead = require('./Lead');

// Associations

// Topic <-> ExpertConfig
Topic.hasOne(ExpertConfig, { foreignKey: 'topic_id', as: 'expertConfig' });
ExpertConfig.belongsTo(Topic, { foreignKey: 'topic_id' });

// User <-> Conversation
User.hasMany(Conversation, { foreignKey: 'user_id' });
Conversation.belongsTo(User, { foreignKey: 'user_id' });

// Topic <-> Conversation
Topic.hasMany(Conversation, { foreignKey: 'topic_id' });
Conversation.belongsTo(Topic, { foreignKey: 'topic_id' });

// Conversation <-> Message
Conversation.hasMany(Message, { foreignKey: 'conversation_id' });
Message.belongsTo(Conversation, { foreignKey: 'conversation_id' });

// Lawyer <-> Topic (Many-to-Many through TopicLawyer)
Lawyer.belongsToMany(Topic, { through: TopicLawyer, foreignKey: 'lawyer_id' });
Topic.belongsToMany(Lawyer, { through: TopicLawyer, foreignKey: 'topic_id' });

// Lead relationships
Conversation.hasOne(Lead, { foreignKey: 'conversation_id' });
Lead.belongsTo(Conversation, { foreignKey: 'conversation_id' });

User.hasMany(Lead, { foreignKey: 'user_id' });
Lead.belongsTo(User, { foreignKey: 'user_id' });

Topic.hasMany(Lead, { foreignKey: 'topic_id' });
Lead.belongsTo(Topic, { foreignKey: 'topic_id' });

Lawyer.hasMany(Lead, { foreignKey: 'lawyer_id' });
Lead.belongsTo(Lawyer, { foreignKey: 'lawyer_id' });

module.exports = {
  sequelize,
  User,
  Topic,
  ExpertConfig,
  Conversation,
  Message,
  Lawyer,
  TopicLawyer,
  Lead
};
