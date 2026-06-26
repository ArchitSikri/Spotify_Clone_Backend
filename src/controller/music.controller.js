const musicModel = require("../models/music.model");
const jwt = require("jsonwebtoken");
const {uploadFile} = require("../services/storage.service")
const albumModel = require("../models/album.model")

async function createMusic(req , res){ 

        const {title}=req.body;
        const file = req.file;

        if(!file){
            return res.status(400).json({ message: "File is required" });
        }

        const result = await uploadFile(file.buffer.toString('base64'));

        const music = await musicModel.create({
            uri : result.url,
            title,
            artist: req.user.id,
        });

        res.status(201).json({
           message: "music created",
           music : {
            artist: music.artist,
            uri : music.uri,
            title : music.title,
            id : music._id
          }
        })
 

}

async function createAlbum(req,res) {

        const { title , musics} = req.body;

        const album = await albumModel.create({
            title,
            artist : req.user.id,
            music : musics,    
        })

        res.status(201).json({
            message: "Album created successfully",
            album : {
                id :album._id,
                title : album.title,
                artist : album.artist,
                music : album.music,
            }
        })
}

async function getallmusics(req,res) {
    const musics = await musicModel.find().populate("artist","username email")
    res.status(200).json({
        message : "all musics are fetched",
        musics : musics,
        
    })
}

async function getallalbums(req,res){
    const albums = await albumModel.find().select("title artist").populate("artist","username")

    return res.status(200).jsom({
        message : "album fetched",
        albums : albums,
    })
}

async function getallalbumbyid(req,res){
    const albumId = req.params.albumId;

    const album = await albumModel.findById(albumId).populate("artist","username ").populate("music")

    return res.status(200).jsom({
        message : "album fetched",
        album : album,
    })

}

module.exports = {createMusic , createAlbum, getallmusics, getallalbums,getallalbumbyid}