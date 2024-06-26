const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    text:{
        type:String,
        required: true
    },
    complete:{
        type : Boolean ,
        default: false
    },
    dueDate:{
        type: Date,
        required: true,
        default: Date.now()
    },
    description: {
        type: String
    },
    timestamp:{
        type: String,
        default: Date.now()
    },
    userId: {
        type:String,
        required: true
    }
})

const Todo = mongoose.model("Todo", TodoSchema)

module.exports = Todo