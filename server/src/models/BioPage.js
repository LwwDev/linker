const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BioPage = sequelize.define('BioPage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    field: 'user_id',
  },
  title: {
    type: DataTypes.STRING,
    defaultValue: 'My Links',
  },
  bioText: {
    type: DataTypes.TEXT,
    field: 'bio_text',
  },
  theme: {
    type: DataTypes.STRING(20),
    defaultValue: 'default',
  },
  links: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
}, {
  tableName: 'bio_pages',
  underscored: true,
});

module.exports = BioPage;
