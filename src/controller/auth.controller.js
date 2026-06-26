const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function registerUser(req, res){
    const { username, email, password, role='user'} = req.body;
    
    const isUserAlreadyExist = await UserModel.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if(isUserAlreadyExist){
        return res.status(409).json({ message: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
        username,
        email,
        password: hash,
        role
    });

    const token = jwt.sign({ 
        id: newUser._id,
        username: newUser.username,
        role: newUser.role },
        process.env.JWT_SECRET
    );

    res.cookie('token', token)

    res.status(201).json({ message: 'User created successfully', user: newUser, token });
}    

async function loginUser(req, res){
    const { username , email, password } = req.body;
    const user = await UserModel.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    if(!user){
        return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
        role: user.role
    }, process.env.JWT_SECRET);

    res.cookie('token', token);

    res.status(200).json({
         message: 'Login successful', 
         user : {
            id : user._id,
            username : user.username,
            email : user.email,
            role : user.role
         }, 
         token });
}

async function logoutuser(req,res){
    res.clearcookies("token")
    return res.status(200).json({
        message : "logget out completed"
    })
}

module.exports = {
    registerUser,
    loginUser,
    logoutuser  
};