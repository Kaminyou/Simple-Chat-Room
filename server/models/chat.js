const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Creating a schema, sort of like working with an ORM
const ChatSchema = new Schema({
	sender: {
		type: String,
		required: [true, 'Sender field is required.']
	},
	receiver: {
		type: String,
		required: [true, 'Receiver field is required']
	},
	body: {
		type: String,
		required: [true, 'Body field is required.']
	}
})

// Creating a table within database with the defined schema
const Chat = mongoose.model('chat', ChatSchema)

// Exporting table for querying and mutating
module.exports = Chat
