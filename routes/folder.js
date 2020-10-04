const express = require("express");
const mongoose = require("mongoose")
const Folder = require("../models/folder")
const File = require("../models/file")
const fs = require('fs')
const app = express();

//Get files on home page
app.get("/",async (req,res) => {
    try {
        const findFolder = await Folder.find({})
        const folders = findFolder.filter((val) => {
            return val.path == "home"
        })
        const files = await File.find({ homepath : "home"})
        console.log(files)
        res.render("home", { folders, files })
    } catch (error) {
        console.error(error)
    }
})

//create folder route
app.post("/createfolder",async (req,res) => {
    try {
        Folder.create(req.body , (err) => {
            if(err) throw err;
            res.redirect(req.headers.referer)
        });
       
    } catch (error) {
        console.error(error)
    }
})

//Edit folder
app.post("/editFolder/:id",async (req,res) => {
    try {
        const allFolders = await Folder.find({})
        const presentFolder = await Folder.findById({ _id: req.params.id })
        allFolders.forEach(async (folder) => {
            if (folder.path === presentFolder.name){
                const update = await Folder.findByIdAndUpdate({ _id: folder._id }, { path : req.body.name }, { new: true, runValidators: true })
            }
           
        })
        Folder.findByIdAndUpdate({ _id: req.params.id }, { name: req.body.name }, { new: true, runValidators: true },(err) => {
            if(err) throw err;
            res.redirect(req.headers.referer)
        })
    } catch (error) {
       console.log(error) 
    }
})

//Delete folder
app.get("/deleteFolder/:id",async (req,res) => {
    try {
        var paramId = req.params.id;

        async function recursiveDeletion(id){
            const allFolders = await Folder.find({})
            const folder = await Folder.findByIdAndDelete({ _id: id }).populate({ path: "files", model: "file" })
            removeFiles(folder.files);
 
            allFolders.forEach(async (fol) => {
                if (fol.path === folder.name) {
                    recursiveDeletion(fol._id)
                }
            })
        }
        recursiveDeletion(paramId)
        
        res.redirect(req.headers.referer)
    } catch (error) {
        console.log(error)
    }
})

//Move folder to another folder
app.post("/moveFolder/:id", async (req,res) => {
    try {
       if(req.body.path == ""){
            res.redirect("/")
       }else{
           const move = await Folder.findByIdAndUpdate({ _id: req.params.id }, { path: req.body.path })
           res.redirect("/")
       }
    } catch (error) {
        console.error(error)
    }
})

//Function to remove files from DB and from app uploads 
async function removeFiles(arr){
   try {
       arr.forEach((file) => {
           fs.unlink(`./public/uploads/${file.name}`, (err) => {
               if (err) throw err;
           })
           File.findByIdAndDelete({ _id: file._id }, (err) => {
               if (err) throw err;
           })
       });
   } catch (error) {
      console.log(error) 
   }
}

module.exports = app;