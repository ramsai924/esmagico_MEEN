const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    path : {
        type: Schema.Types.ObjectId,
        ref: "folder"
    },
    type : {
        type : String,
        default : "file"
    }
})
fileSchema.index({ name : 1 , path : 1});

const fileModel = mongoose.model("file",fileSchema)

module.exports = fileModel;