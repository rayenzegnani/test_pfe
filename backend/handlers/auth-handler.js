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
module.exports={registerUser};