
const MessageModel=(sequelize, DataTypes)=>{

    const Message = sequelize.define(
        'Message',
        {
          senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          content: {
            type: DataTypes.STRING,
            trim: true,
          },
          chatId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
        },
        {
          timestamps: true,
       
        }
      );

     return Message
}



export default MessageModel;
