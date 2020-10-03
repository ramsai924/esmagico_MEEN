const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const folderSchema = Schema({
    name : {
        type : String,
        required : true
    },
    path : {
        type : String,
        default : "home"
    },
    type : {
        type : String,
        default : "folder"
    },
    files : {
        type: [Schema.Types.ObjectId],
        ref: "file"
    }
})
folderSchema.index({ name: 1 , files : 1,path : 1});
const folderModel = mongoose.model("folder",folderSchema);

module.exports = folderModel;