import db from "../models/index.js";



const Chat=db.chatInfo;
const User=db.authinfom;
const Message=db.messageInfo;

export const accessChat = async (req, res) => {
  const { userId } = req.body;



  if (!userId) {
  
    return res.sendStatus(400);
  }

  try {
    // Check if a chat exists with the given criteria
    const isChat = await Chat.findOne({
      where: {
        isGroupChat: false,
        id: {
          [db.Sequelize.Op.and]: [
            { [db.Sequelize.Op.in]: [req.userId] },
            { [db.Sequelize.Op.in]: [userId] },
          ],
        },
      },
      include: [
        {
          model: User,
          as: 'users',
          attributes: { exclude: ['password'] },
        },
        {
          model: Message,
          as: 'latestMessage',
        },
      ],
    });

    if (isChat) {
    
      return res.send(isChat);
    }

    // Create a new chat if it doesn't exist
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
    };

    // Create the chat
    const createdChat = await Chat.create(chatData);

    // Add users to the chat
    await createdChat.addUsers([req.userId, userId]);

    // Fetch the full chat including users
    const fullChat = await Chat.findByPk(createdChat.id, {
      include: [
        {
          model: User,
          as: 'users',
          attributes: { exclude: ['password'] },
        },
      ],
    });

    console.log('Chat created successfully:', fullChat);
    res.status(200).json(fullChat);
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: error.message });
  }
};

  
  // add get all message
export const getChats= async (req, res) => {
  try {
   // const userId = req.userId; // Assuming 'req.user.id' contains the user's ID

    // Find all chats where the user is involved

  
    const results = await Chat.findAll({
       
      include: [
        {
          model: User,
          as: 'users',
          attributes: { exclude: ['password'] },
            where:{
              id:req.userId
             },
          
        },
        {
          model: User,
          as: 'groupAdmin',
          attributes: { exclude: ['password'] },
        },
        {
          model: Message,
          as: 'latestMessage',
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['name', 'pic', 'email'],
            },
          ],
        },
      ],
      order: [['updatedAt', 'DESC']], // Order by 'updatedAt' in descending order
    });

    let chatIds = results.map((chat) => chat.id);
 

    const data = await Chat.findAll({

    
        where: {
          id: chatIds, // Filter by the specific chatIds
        },
    
     
      include: [
        {
          model: User,
          as: 'users',
          attributes: { exclude: ['password'] },
        },
        {
          model: User,
          as: 'groupAdmin',
          attributes: { exclude: ['password'] },
        },
        {
          model: Message,
          as: 'latestMessage',
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['name', 'pic', 'email'],
            },
          ],
        },
      ],
      order: [['updatedAt', 'DESC']], // Order by 'updatedAt' in descending order
    });



   res.status(200).send(data);

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Bad Request' });
  }
};


export const createGroupChat = async (req, res) => {

    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please Fill all the fields" });
    }
  

 
    const users = JSON.parse(req.body.users);
  
    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
  
    users.push(req.userId); 
  
    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        isGroupChat: true,
        groupAdminId: req.userId,
      });
  
      await groupChat.addUsers(users);
  
      const fullGroupChat = await Chat.findByPk(groupChat.id, {
        include: [
          {
            model: User,
            as: 'users',
            attributes: { exclude: ['password'] },
          },
          {
            model: User,
            as: 'groupAdmin',
            attributes: { exclude: ['password'] },
          },
        ],
      });
  
      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  };
  

 export const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;
  
    try {
      const [updatedCount] = await Chat.update(
        {
          chatName: chatName,
        },
        {
          where: { id: chatId },
        }
      );
  
      if (updatedCount === 0) {
        res.status(404);
        throw new Error("Chat Not Found");
      } else {
        const updatedChat = await Chat.findByPk(chatId, {
          include: [
            {
              model: User,
              as: 'users',
              attributes: { exclude: ['password'] },
            },
            {
              model: User,
              as: 'groupAdmin',
              attributes: { exclude: ['password'] },
            },
          ],
        });
  
        res.json(updatedChat);
      }
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  };


  export const removeFromGroup = async (req, res) => {
    
    const { chatId, userId } = req.body;
  
    try {
      // Fetch the chat by chatId
      const chat = await Chat.findByPk(chatId);
  
      if (!chat) {
        res.status(404);
        throw new Error("Chat Not Found");
      }
  
      // Check if the requester is an admin
      const isRequesterAdmin = req.useId === chat.groupAdminId;
  
     if (!isRequesterAdmin) {
       res.status(403); // Forbidden
       throw new Error("You are not authorized to remove users from this chat.");
      }
  
      // Remove the user from the chat
      await chat.removeUser(userId);
  
      // If there are no users left in the chat, you can delete the chat
      const remainingUsers = await chat.getUsers();
      if (remainingUsers.length === 0) {
        await chat.destroy(); // Delete the chat
        res.status(204).send(); // No Content response
      } else {
        // Fetch the updated chat
        const updatedChat = await Chat.findByPk(chatId, {
          include: [
            {
              model: User,
              as: 'users',
              attributes: { exclude: ['password'] },
            },
            {
              model: User,
              as: 'groupAdmin',
              attributes: { exclude: ['password'] },
            },
          ],
        });
  
        res.json(updatedChat);
      }
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  };
  


  export const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;
  
    try {
      // Fetch the chat by chatId
      const chat = await Chat.findByPk(chatId);
  
      if (!chat) {
        res.status(404);
        throw new Error("Chat Not Found");
      }
  
      // Check if the requester is an admin (You need to implement this check)
      const isRequesterAdmin = req.userId=== chat.groupAdminId;
  
      if (!isRequesterAdmin) {
        res.status(403); // Forbidden
        throw new Error("You are not authorized to add users to this chat.");
      }
  
      // Add the user to the chat
      await chat.addUser(userId);
  
      // Fetch the updated chat
      const updatedChat = await Chat.findByPk(chatId, {
        include: [
          {
            model: User,
            as: 'users',
            attributes: { exclude: ['password'] },
          },
          {
            model: User,
            as: 'groupAdmin',
            attributes: { exclude: ['password'] },
          },
        ],
      });
  
      res.json(updatedChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  };
  