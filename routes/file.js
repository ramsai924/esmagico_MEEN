const express = require("express");
const multer = require("multer")
const path = require("path")
const Folder = require("../models/folder")
const File = require("../models/file")
const fs = require('fs')
const app = express()

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename : function(req,file,cb){
        cb(null,file.originalname.split(".")[0].slice(0,8) + "-" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage }).single('name')

app.get("/:id",async (req,res) => {
    try {
        const allfolders = await Folder.find({})
        const folder = await Folder.findById({ _id: req.params.id }).populate({ path: "files", model: "file", populate: { path: "path", model: "folder"}})
        const movedFolders = allfolders.filter((val) => {
            return val.path === folder.name;
        })
        let folderStructure = []
        function recurse(present){
            allfolders.forEach((fo) => {
                if (present.path === fo.name){
                    folderStructure.push(fo)
                    recurse(fo)
                }
            })
        }
        recurse(folder)

        console.log(folderStructure)
        res.render("folderView", { folder, movedFolders, allfolders, folderStructure})
    } catch (error) {
        console.log(error)
    }
})

app.post("/uploadfile", upload, async (req,res) => {
    try {
        console.log(req.headers.referer)
        const file = new File({
            name : req.file.filename,
            path: req.body.folderid
        })
        const fileUpload = await file.save()
        Folder.findByIdAndUpdate({ _id: req.body.folderid }, { $push: { "files": fileUpload._id } },{ new: true, runValidators: true } , (err) => {
            if(err) throw err;
            return res.redirect(req.headers.referer)
        })
        
    } catch (error) {
        console.error(error)
    }
})

app.get("/deleteFile/:id",async (req,res) => {
    try {
        
        const deleteFile = await File.findByIdAndDelete({ _id : req.params.id })
        fs.unlink(`./public/uploads/${deleteFile.name}`,() => {
            console.log("file removed")
        })
        Folder.findByIdAndUpdate({ _id : deleteFile.path} , { $pull : { "files" : req.params.id }} , (err) => {
            if(err) throw err;
            res.redirect(`/folder/${deleteFile.path}`)
        })
    } catch (error) {
        console.error(error)
    }
})


app.post("/moveFile/:id", async (req, res) => {
    try {
        if (req.body.fileToMove === ""){
            res.redirect(`/folder/${req.body.currentFolder}`)
        }else{
            const fileUpdate = await File.findByIdAndUpdate({ _id: req.params.id }, { path: req.body.fileToMove })
            const pushFile = await Folder.findByIdAndUpdate({ _id: req.body.fileToMove }, { $push: { "files": fileUpdate._id } })
            const deleteFile = await Folder.findByIdAndUpdate({ _id: req.body.currentFolder }, { $pull: { "files": fileUpdate._id } })
            res.redirect(`/folder/${req.body.currentFolder}`)
        }
    } catch (error) {
        console.error(error)
    }
})

app.get("/downloadFile/:name",async (req,res) => {
    try {
        fs.access(`./public/uploads/${req.params.name}`, fs.constants.F_OK , (err) => {
            if(err){
                res.send("file not exits")
            }else{
                res.download(`./public/uploads/${req.params.name}`)
            }
        })
        
    } catch (error) {
        console.log(error)
    }
})

module.exports = app;