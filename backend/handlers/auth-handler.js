const User=require('../db/user');
const bcrypt = require('bcrypt');
async function registerUser(model){
    const hashedPassword = await bcrypt.hash(model.password, 10);
    let newUser=new User({
        username:model.username,
        email:model.email,
        password:hashedPassword,
    });
    await newUser.save();
    
}
async function loginUser(email, password){
    // cherche l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) return null;

    // compare les mots de passe
    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    // renvoie l'utilisateur sans le champ password
    const userObj = user.toObject ? user.toObject() : JSON.parse(JSON.stringify(user));
    delete userObj.password;
    return userObj;
}
function logout(token){
    if (!token) return false;
    tokenBlacklist.add(token);
    return true;
}

function isTokenBlacklisted(token){
    return token && tokenBlacklist.has(token);
}


module.exports={registerUser, loginUser, logout, isTokenBlacklisted};