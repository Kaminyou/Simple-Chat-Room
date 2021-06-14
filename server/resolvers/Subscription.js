const Subscription = {
    user: {
        subscribe(parent, { name }, { Chat, pubsub }, info) {
          const chat = Chat.find({$or:[{"sender":name}, {"receiver":name}]});
    
          if (!chat) {
            throw new Error('Name not found')
          }
    
          return pubsub.asyncIterator(`Name ${name}`)
        }
    }
  }
  
module.exports = Subscription