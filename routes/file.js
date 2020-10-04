const express = require("express");
const multer = require("multer")
const path = require("path")
const Folder = require("../models/folder")
const File = require("../models/file")
const fs = require('fs')
const app = express()

//multer middileware to upload files
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename : function(req,file,cb){
        cb(null,file.originalname.split(".")[0].slice(0,8) + "-" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage }).single('name')

//get files in folder view section
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
        res.render("folderView", { folder, movedFolders, allfolders, folderStructure})
    } catch (error) {
        console.log(error)
    }
})

//upload files
app.post("/uploadfile", upload, async (req,res) => {
    try {
        if(req.body.filePath === "home"){
            const file = new File({
                name: req.file.filename,
                homepath: req.body.filePath,
            })
            const fileUpload = await file.save()
            return res.redirect("/")
        }else{
            const file = new File({
                name: req.file.filename,
                path: req.body.folderid
            })
            const fileUpload = await file.save()
            Folder.findByIdAndUpdate({ _id: req.body.folderid }, { $push: { "files": fileUpload._id } }, { new: true, runValidators: true }, (err) => {
                if (err) throw err;
                return res.redirect(req.headers.referer)
            })
        }
        
    } catch (error) {
        console.error(error)
    }
})

//Delete files 
app.get("/deleteFile/:id",async (req,res) => {
    try {
        const findPath = await File.findById({ _id: req.params.id})
        if(findPath.homepath === "home"){
            const deleteFile = await File.findByIdAndDelete({ _id: req.params.id })
            fs.unlink(`./public/uploads/${deleteFile.name}`, () => {
                console.log("file removed")
            })
            return res.redirect("/")
        }else{
            const deleteFile = await File.findByIdAndDelete({ _id: req.params.id })
            fs.unlink(`./public/uploads/${deleteFile.name}`, () => {
                console.log("file removed")
            })
            Folder.findByIdAndUpdate({ _id: deleteFile.path }, { $pull: { "files": req.params.id } }, (err) => {
                if (err) throw err;
                return res.redirect(`/folder/${deleteFile.path}`)
            })
        }
    } catch (error) {
        console.error(error)
    }
})

//Move file from home to folder and folder to home
app.post("/moveFile/:id", async (req, res) => {
    try {
        const findFile = await File.findOne({ _id : req.params.id })
        console.log(findFile)
        if (req.body.fileToMove === ""){
            return res.redirect(`/folder/${req.body.currentFolder}`)
        } else if (req.body.fileToMove === "home"){
            const movetoHome = await File.findByIdAndUpdate({ _id: req.params.id }, { $unset : { path: "" }, homepath: "home" })
            const movetoFileHome = await Folder.findByIdAndUpdate({ _id: findFile.path }, { $pull: { "files": findFile._id } })
            return res.redirect("/")
        }else if(findFile.homepath === "home"){
            const homefileUpdate = await File.findByIdAndUpdate({ _id: req.params.id }, { path: req.body.fileToMove ,homepath : "folder" })
            const homepushFile = await Folder.findByIdAndUpdate({ _id: req.body.fileToMove }, { $push: { "files": homefileUpdate._id } })
            return res.redirect("/")
        }else{
            const fileUpdate = await File.findByIdAndUpdate({ _id: req.params.id }, { path: req.body.fileToMove })
            const pushFile = await Folder.findByIdAndUpdate({ _id: req.body.fileToMove }, { $push: { "files": fileUpdate._id } })
            const deleteFile = await Folder.findByIdAndUpdate({ _id: req.body.currentFolder }, { $pull: { "files": fileUpdate._id } })
            return res.redirect(`/folder/${req.body.currentFolder}`)
        }
    } catch (error) {
        console.error(error)
    }
})

//Download files
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