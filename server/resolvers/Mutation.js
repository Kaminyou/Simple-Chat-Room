const Mutation = {

    addChat: async (_, { sender, receiver, body },{ Chat, pubsub }, info) =>{
      const chat = new Chat({sender, receiver, body});
      await chat.save();
      pubsub.publish(`Name ${sender}`, {
        user: {
          mutation: 'CREATED',
          data: chat
        }
      })

      pubsub.publish(`Name ${receiver}`, {
        user: {
          mutation: 'CREATED',
          data: chat
        }
      })
      return chat;
    },
    deleteChatByName: async (_, {name}, {Chat, pubsub}, info) => {
      const chat = await Chat.deleteMany({$or:[{"sender":name}, {"receiver":name}]});
      pubsub.publish(`Name ${name}`, {
        user: {
          mutation: 'DELETED',
          data: {
            id: '-1',
            sender: 'ALL DELETED',
            receiver: 'ALL DELETED',
            body: 'ALL DELETED'
          }
        }
      })
    return `Deleted ${name}'s chats`;
    },
}

module.exports = Mutation