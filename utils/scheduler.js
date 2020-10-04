var schedule = require('node-schedule');
const Folder = require("../models/folder");
const File = require("../models/file");

var rule = new schedule.RecurrenceRule();
rule.hour  = new schedule.Range(0, 23); // runs process every hour one time

var DeleteTxt = schedule.scheduleJob(rule, async function () {
   try {
       const files = await File.find({});
       const txtFiles = files.filter((file) => {
           return file.name.split(".")[1] === "txt";
       })
       txtFiles.forEach(async (txtFile) =>{
           if(txtFile.path){
                const folderFile = await File.findByIdAndDelete({ _id: txtFile._id })
                const deleteFromFolder = await Folder.findByIdAndUpdate({ _id: folderFile.path }, { $pull: { "files": folderFile._id }})
                console.log("txt file deleted from folders")
           }else{
               const homepageFile = await File.findByIdAndDelete({ _id: txtFile._id })
               console.log("txt file deleted from homepage")
           }
       })
   } catch (error) {
       console.log(error)
   }
});

