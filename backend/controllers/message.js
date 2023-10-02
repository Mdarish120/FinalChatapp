import db from "../models/index.js";



const Chat=db.chatInfo;
const User=db.authinfom;
const Message=db.messageInfo;


export const sendMessage = async (req, res) => {
    try {
      const { content, chatId } = req.body;
  
      if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
      }
  
      // Create a new message
      try {
        const newMessage = await Message.create({
          senderId: req.userId, // Assuming req.user._id contains the sender's ID
          content: content,
          chatId: chatId,
        });
  
        const message = await Message.findByPk(newMessage.id, {
            include: [
              {
                model: User,
                as: 'sender',
                attributes: ['name', 'pic'],
              },
              {
                model: Chat,
                as: 'chat',
                include: [
                  {
                    model: User,
                    as: 'users',
                    attributes: ['name', 'pic', 'email'],
                  },
                ],
              },
            ],
          });
        // Update the latestMessage in the Chat model
        await Chat.update(
          { latestMessageId: message.id },
          {
            where: { id: chatId }, // Assuming chatId is the Chat's ID
          }
        );

        
  
        res.json(message);
      } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const allMessages = async (req, res) => {
    try {
      const { chatId } = req.params;

      console.log(`getAll Mesaage ${chatId}`)
  
      // Retrieve all messages for a specific chat using Sequelize
      const messages = await Message.findAll({
        where: { chatId }, // Assuming chatId is the parameter from the URL
        include: [
          {
            model: User,
            as: 'sender',
            attributes: ['name', 'pic', 'email'],
          },
          {
            model: Chat,
            as: 'chat',
            include: [
              {
                model: User,
                as: 'users',
                attributes: ['name', 'pic', 'email'],
              },
            ],
          },
        ],
      });
  
      res.json(messages);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  };
  