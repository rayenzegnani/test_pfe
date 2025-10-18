const express = require('express');
const router=express.Router();
const { registerUser, loginUser } = require('../handlers/auth-handler');

router.post('/register', async (req, res) => {
    let model=req.body;
    if(model.nom&&model.email&&model.password){
        await registerUser(model);
        res.status(201).json({ message: 'User registered successfully' });
    }else{
        res.status(400).json({ error: 'Missing required fields' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        if (!result) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json(result);
    } catch (err) {
        console.error('POST /auth/login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;