const { User, validateUser, validateLogin } = require('../models/User');
const express = require('express');
const router = express.Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

router.post('/', async (req, res) => {
   
    const { error } = validateUser(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

   
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).send('That user already exists!');
    } else {
       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        const result = await user.save();
        const { password, ...data } = await result.toJSON();

        res.send(data);
    }
});
router.post('/login', async (req, res) => {
    
    const { error } = validateLogin(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(400).send('User not found');
    }
    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(400).send('invalid credentials');
    }

    const token = jwt.sign({ _id: user._id }, "secert")
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });
    
    res.send('Login successful.');
});
router.get('/user', async (req, res) => {
    try {
        const cookie = req.cookies['jwt'];
        if (!cookie) {
            return res.status(400).send('JWT cookie not provided');
        }

        const claim = jwt.verify(cookie, "secert");
        if (!claim) {
            return res.status(400).send('JWT verification failed');
        }

        const user = await User.findOne({ _id: claim._id });
        if (!user) {
            return res.status(400).send('User not found');
        }

        const { password, ...data } = await user.toJSON();
        res.send(data);
    } catch (error) {
      
        console.error(error);
        return res.status(400).send('JWT verification error');
    }
});


router.post('/logout', async (req, res) => {

    res.cookie('jwt', '', { maxAge: 0 });
    res.send("sucess");
});

module.exports = router;