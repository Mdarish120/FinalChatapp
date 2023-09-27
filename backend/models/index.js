import * as dbConfig from "../utils/db.js";
import userModel from "./user.js";
import chatModel from "./chat.js";
import messageModel from "./message.js";



import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,

  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,


    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);


sequelize.authenticate()
.then(() => {
    console.log('connected..')
})
.catch(err => {
    console.log('Error'+ err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize


db.authinfom = userModel(sequelize, DataTypes);
db.chatInfo=chatModel(sequelize,DataTypes);
db.messageInfo=messageModel(sequelize,DataTypes);


db.messageInfo.belongsTo(db.authinfom, { as: 'sender', foreignKey: 'senderId' });
db.messageInfo.belongsTo(db.chatInfo, { as: 'chat', foreignKey: 'chatId' });
db.messageInfo.belongsToMany(db.authinfom, { through: 'MessageReadBy', as: 'readBy' });


// Define associations to other models
db.chatInfo.belongsTo(db.authinfom, { as: 'groupAdmin', foreignKey: 'groupAdminId' });
db.chatInfo.belongsTo(db.messageInfo, { as: 'latestMessage', foreignKey: 'latestMessageId' });
db.chatInfo.belongsToMany(db.authinfom, { through: 'ChatUser', as: 'users' });

db.sequelize.sync({ force: false})
.then(() => {
    console.log('yes re-sync done!')
})

export default db;