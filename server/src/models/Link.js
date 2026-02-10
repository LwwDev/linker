const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Link = sequelize.define('Link', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
  },
  originalUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'original_url',
    validate: { isUrl: true },
  },
  shortCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    field: 'short_code',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
}, {
  tableName: 'links',
  underscored: true,
});

module.exports = Link;
