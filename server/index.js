// https://www.digitalocean.com/community/tutorials/how-to-build-a-graphql-server-in-node-js-using-graphql-yoga-and-mongodb
const { GraphQLServer, PubSub } = require('graphql-yoga');
const mongoose = require('mongoose');
const Chat = require('./models/chat');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');
require('dotenv-defaults').config();
if (!process.env.MONGO_URL) {
    console.error('Missing MONGO_URL!!!')
    process.exit(1)
  }
//mongoose.connect("mongodb://localhost:27017/UserApp");
mongoose.connect(process.env.MONGO_URL);

const pubsub = new PubSub();

const server = new GraphQLServer({ 
    typeDefs:'./src/schema.graphql', 
    resolvers: {
        Query, 
        Mutation,
        Subscription
    },
    context: {
        Chat,
        pubsub
    }
})
mongoose.connection.once("open", function(){
    server.start(() => console.log('Server is running on localhost:4000'))
});