const ChatModel=(sequelize, DataTypes)=>{


  const Chat = sequelize.define(
      'Chat',
      {
        chatName: {
          type: DataTypes.STRING,
          allowNull: true, // Change to true if it's optional
          trim: true,
        },
        isGroupChat: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        timestamps: true,
      // You can specify the table name if it's different from the model name
      }
    );


    return Chat

}




export default ChatModel;
