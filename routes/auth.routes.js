const Router = require('express');
const router = Router();
const { Tokens, User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const { validate } = require('../validations/user.validation');

sgMail.setApiKey(process.env.SENDGRID_KEY);

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        id:
 *          type: number
 *          description: The auto-generated id of a user. Only for internal use
 *        uuid:
 *          type: string
 *          format: uuid
 *          description: The auto-generated uuid of a user. For client use
 *        email:
 *          type: string
 *          description: The email of the user
 *        password:
 *          type: string
 *          description: The password of the user
 *      example:
 *        id: 1
 *        uuid: 15049b20-8d8a-4b43-bad0-48aa42dd6c40
 *        email: Jhon'@'doe.com
 *        password: 1234
 */
/**
 *  @swagger
 *  tags:
 *     name: Users
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *    summary: signup a new account
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            property:
 *              email:
 *                type: string
 *              password:
 *                type: sting
 *    responses:
 *      200:
 *        description: Successfully sign up
 *        content:
 *          application/json:
 *            schema:
 *                properties:
 *                  uuid:
 *                    type: string
 *                    format: uuid
 *                  email:
 *                     type: string
 *                  password:
 *                     type: string
 *      500:
 *        description: Error
 */

router.post('/signup', async (req, res) => {
    let { email, password} = req.body;
    let val = validate({ email, password });
    try {
        if(!val.result)
          throw new Error(val.error);
        if( await User.findOne({ where: {email}}) )
          throw new Error('Email already exist');
        let hashedPassword = await bcrypt.hash(password, 10);
        let user = await User.create({ email, password: hashedPassword});
        const mail = {
            to: email,
            from: process.env.EMAIL,
            subject: 'Registration complete',
            html: '<h1>Thanks for registering</h1>'
        }
        await sgMail.send(mail);
        delete user.dataValues.id;
        res.json({user});
    } catch (error) {
        res.status(400).json({ error: `${error}` });
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *    summary: log in an recieve the access token and refresh token
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            property:
 *              email:
 *                type: string
 *              password:
 *                type: sting
 *    responses:
 *      200:
 *        description: The access and refresh token
 *        content:
 *          application/json:
 *            schema:
 *                properties:
 *                  accessToken:
 *                     type: string
 *                  refreshToken:
 *                     type: string
 *      500:
 *        description: Error
 */

router.post('/login', async (req,res) =>{
    const { email, password} = req.body;
    let user = await User.findOne({ where: { email}});
    try {
        if(!user) throw new Error('User not found');
        if(!await bcrypt.compare(password, user.password)){
            throw new Error('not allowed');
        }
        const accessToken = jwt.sign({ uuid: user.dataValues.uuid}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 1200});
        const refreshToken = jwt.sign({ uuid: user.dataValues.uuid}, process.env.REFRESH_TOKEN_SECRET);
        await Tokens.create({ refreshToken});
        res.json({
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(500).json({ error: `${error}` });
    }
});
/**
 * @swagger
 * /auth/users:
 *   get:
 *    summary: get all users
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: Array of all users
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                properties:
 *                  uuid:
 *                     type: string
 *                     format: uuid
 *                  email:
 *                     type: string
 *                  password:
 *                     type: string
 *      500:
 *        description: Error
 */
router.get('/users', async (req,res) => {
    try {
        let users = await User.findAll();
        users.forEach(user => {
          delete user.dataValues.id;
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: `${error}` });
    }
});

/**
 * @swagger
 * /auth/refresh_token:
 *   post:
 *    summary: refresh access token
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            property:
 *              refreshToken:
 *                type: string
 *    responses:
 *      200:
 *        description: access token
 *        content:
 *          application/json:
 *            schema:
 *                properties:
 *                  accessToken:
 *                     type: string
 *      500:
 *        description: Error
 */

router.post('/refresh_token', async (req, res) => {
    let refreshToken = req.body.token;
    try {
      if(!refreshToken) throw new Error('Token cannot be null');
      if( await Tokens.findOne({ where: { refreshToken}}) == null) throw new Error('Invalid token');
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, uuid) => {
          if(err) throw new Error(err);
          let accessToken = generateAccessToken(uuid);
          res.json({ accessToken: accessToken});
      })
    } catch (error) {
      res.status(500).json({ error: `${error}`});
    }

});


router.authenticateToken = (req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, uuid) => {
        if(err) return res.sendStatus(403);
        req.uuid = uuid;
        next();
    })
}

function generateAccessToken(user){
    console.log(user);
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s'});
}

module.exports = router;
