const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Click = sequelize.define('Click', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  linkId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'link_id',
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    field: 'ip_address',
  },
  userAgent: {
    type: DataTypes.TEXT,
    field: 'user_agent',
  },
  referrer: {
    type: DataTypes.TEXT,
  },
  country: {
    type: DataTypes.STRING(2),
  },
}, {
  tableName: 'clicks',
  underscored: true,
  updatedAt: false,
  createdAt: 'clicked_at',
});

module.exports = Click;
