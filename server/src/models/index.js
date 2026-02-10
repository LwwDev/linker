const sequelize = require('../config/database');
const User = require('./User');
const Link = require('./Link');
const Click = require('./Click');
const BioPage = require('./BioPage');

User.hasMany(Link, { foreignKey: 'user_id', as: 'links' });
Link.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Link.hasMany(Click, { foreignKey: 'link_id', as: 'clicks' });
Click.belongsTo(Link, { foreignKey: 'link_id', as: 'link' });

User.hasOne(BioPage, { foreignKey: 'user_id', as: 'bioPage' });
BioPage.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = { sequelize, User, Link, Click, BioPage };
