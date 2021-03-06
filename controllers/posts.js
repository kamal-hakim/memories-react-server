const mongoose = require('mongoose');
const PostMessage = require('../models/postMessage.js');

module.exports.getPosts = async function (req, res) {
    try {
        const postMesasges = await PostMessage.find();        
        res.status(200).json(postMesasges);
    } catch (error) {
        res.status(404).json(error);
    }
}

module.exports.createPost = async function (req, res) {
    const post = req.body;
    const newPost = new PostMessage({...post, creator: req.userId });

    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(404).json(error);
    }
}

module.exports.updatePost = async function (req, res) {
    try {        
        const { id: _id } = req.params;
        const post = req.body;        
        if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that ID');
        const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, {new: true});        
        res.json(updatedPost);
    } catch (error) {
        res.status(404).json(error);
    }
}

module.exports.deletePost = async function (req, res) {
    try {
        const { id: _id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that ID');
        const deletedCount = await PostMessage.findByIdAndRemove( _id );
        res.status(201).json(deletedCount);
    } catch (error) {
        res.status(404).json(error);
    }
}

module.exports.likePost = async function (req, res) {    
    try {
        const { id: _id } = req.params;        

        if(!req.userId) return res.json({ message: 'Unauthenticated' });
        if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that ID');
        const post = await PostMessage.findById(_id);
        const index = post.likes.findIndex(id => id === String(req.userId));        
        
        if (index === -1) {
            post.likes.push(req.userId);
        } else {
            post.likes = post.likes.filter(id => id !== String(req.userId));
        }        
        const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {new: true});
        res.json(updatedPost);
    } catch (error) {
        res.status(404).json(error);
    }
}