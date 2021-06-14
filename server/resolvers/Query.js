const Query = {
    getChat: (parent, args, { Chat }, info)=> Chat.find(),
    getChatByName: async (parent, { name }, { Chat }, info) => {
        var result = await Chat.find({$or:[{"sender":name}, {"receiver":name}]});
        return result;
    }
}
module.exports = Query