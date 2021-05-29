const Router = require('express');
const router = Router();
const { Character, Media} = require('../models');
const auth = require('./auth.routes');
const { validate } = require('../validations/character.validation');
/**
 * @swagger
 * components:
 *  schemas:
 *    Character:
 *      type: object
 *      required:
 *        - image
 *        - name
 *        - age
 *        - weight
 *        - story
 *        - mediaUUID
 *      properties:
 *        uuid:
 *          type: string
 *          format: uuid
 *          description: The auto-generated uuid of a character. For client use
 *        image:
 *          type: string
 *          description: The URL to the image of the character
 *        name:
 *          type: string
 *          description: The name of the character
 *        age:
 *          type: number
 *          description: The age of the character
 *        weight:
 *          type: number
 *          description: The weight of the character
 *        story:
 *          type: string
 *          description: The story of the character
 *        mediaUUID:
 *          type: string
 *          format: uuid
 *          description: The uuid of the media the character belongs to
 *      example:
 *        uuid: 15049b20-8d8a-4b43-bad0-48aa42dd6c40
 *        image: https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FSnow_White_(Disney_character)&psig=AOvVaw2aZfJXnBLGeVASSjz34YeX&ust=1622131663146000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKC0g7_d5_ACFQAAAAAdAAAAABAD
 *        name: Snow White
 *        age: 14
 *        weight: 50.8
 *        story: A beautiful but orphaned princess, Snow White, live with her stepmother, the wicked Queen, who previously relegated her to servitude. The Queen is jealous because she wants to be known as "the fairest in the land" when Snow White's beauty surpasses her own. The Queen's huntsman is ordered to take Snow White into the forest and kill her, but he cannot bring himself to do so because of her innocence and beauty, and instead begs Snow White to run away into the forest and never return to the castle. The forest animals befriend Snow White and take her to a cottage, where seven dwarfs live. The dwarfs grow to love their unexpected visitor, who cleans their house and cooks their meals. But one day while the dwarfs are away at their diamond mine, the Queen arrives at the cottage disguised as an old peddler woman and persuades Snow White to take a bite of a poisoned apple, promising her it will make all her dreams come true. Snow White wishes for a reunion with the Prince, takes a bite, falls into a deep sleep, and the peddler woman declares she's now the fairest in the land. The dwarfs, warned by the forest animals, rush home to chase the witch away and she falls to her death, but they are too late to save Snow White. Thinking Snow White is dead, the dwarfs place her in a glass and gold coffin in the woods and mourn for her. A Prince, who had fallen in love with Snow White earlier because of her lovely singing voice, happens by and awakens her from the deep sleep with love's first kiss.
 *        mediaUUID: a4a8d332-fa6c-4492-8a62-75e735b5f4c6
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *  responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *
 *
 */
/**
 *  @swagger
 *  tags:
 *     name: Characters
 */
/**
 * @swagger
 * /characters:
 *   get:
 *    summary: Returns the uuid, image and name of all the characters
 *    tags: [Characters]
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: The list of characters
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                properties:
 *                  uuid:
 *                    type: string
 *                    format: uuid
 *                  image:
 *                     type: string
 *                  name:
 *                     type: string
 *      401:
 *        description: Unauthorized access
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: Error
 */
router.get('/' , auth.authenticateToken ,async (req , res)=>{
    let params= req.query;
    try {
        const characters = await Character.findAll({ where: params});
        console.log(characters);
        let response = [];
        characters.forEach(character => {
            response.push({
                "uuid": character.uuid,
                "image": character.image,
                "name": character.name
            });
        });
        res.json(response);
    } catch (error) {
        console.log(`Server error: ${error}`);
        res.status(500).json(error);
    }
});

/**
 * @swagger
 * /characters/{uuid}:
 *   get:
 *    summary: Get a character by uuid
 *    tags: [Characters]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: uuid
 *        schema:
 *          type: string
 *          format: uuid
 *        require: true
 *        description: UUID of the character to get
 *    responses:
 *      200:
 *        description: The character
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Character'
 *      401:
 *        description: Unauthorized access
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: Error
 */
router.get('/:uuid' , auth.authenticateToken ,async (req , res)=>{
    let uuid = req.params.uuid;
    try {
        let character = await Character.findOne({ where: { uuid}, include: Media});
        delete character.dataValues.id
        res.json(character);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});

/**
 * @swagger
 * /characters/:
 *   post:
 *    summary: Creates a new character
 *    tags: [Characters]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            properties:
 *                image:
 *                  type: string
 *                  description: The URL to the image of the character
 *                name:
 *                  type: string
 *                  description: The name of the character
 *                age:
 *                  type: number
 *                  description: The age of the character
 *                weight:
 *                  type: number
 *                  description: The weight of the character
 *                story:
 *                  type: string
 *                  description: The story of the character
 *                mediaUUID:
 *                  type: string
 *                  format: uuid
 *                  description: The uuid of the media the character belongs to
 *    responses:
 *      200:
 *        description: The character
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Character'
 *      401:
 *        description: Unauthorized access
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: Error
 */
router.post('/' , auth.authenticateToken ,async (req , res)=>{
    let {image, name, age, weight, story, mediaUUID} = req.body;
    let mediaID;
    try {
        let val = validate(req.body);
        if(!val.result) throw new Error(val.error);
        let media = await Media.findOne({where: {uuid: mediaUUID}});
        console.log(media);
        if(media === null) throw new Error('Invalid media UUID');
        let character = await Character.create({image, name, age, weight, story, mediaId: media.id});
        delete character.dataValues.id;
        res.json(character);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: `${error}`});
    }
});

/**
 * @swagger
 * /characters/{uuid}:
 *   delete:
 *    summary: Delete a character by uuid
 *    tags: [Characters]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: uuid
 *        schema:
 *          type: string
 *          format: uuid
 *        require: true
 *        description: UUID of the character to delete
 *    responses:
 *      200:
 *        description: The character
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Character'
 *      401:
 *        description: Unauthorized access
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: Error
 */
router.delete('/:uuid', auth.authenticateToken ,async (req, res) => {
    let uuid = req.params.uuid;
    try {
        let character = await Character.findOne({ where: {uuid}});
        await character.destroy();
        delete character.dataValues.id;
        res.json(character);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

/**
 * @swagger
 * /characters/{uuid}:
 *   put:
 *    summary: Update a character by uuid
 *    tags: [Characters]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: uuid
 *        schema:
 *          type: string
 *          format: uuid
 *        require: true
 *        description: UUID of the character to update
 *    requestBody:
 *     content:
 *       application/json:
 *         schema:
 *            properties:
 *                 image:
 *                   type: string
 *                   description: The URL to the image of the character
 *                 name:
 *                   type: string
 *                   description: The name of the character
 *                 age:
 *                   type: number
 *                   description: The age of the character
 *                 weight:
 *                   type: number
 *                   description: The weight of the character
 *                 story:
 *                   type: string
 *                   description: The story of the character
 *                 mediaUUID:
 *                   type: string
 *                   format: uuid
 *                   description: The uuid of the media the character belongs to
 *    responses:
 *      200:
 *        description: The character
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Character'
 *      401:
 *        description: Unauthorized access
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: Error
 */
router.put('/:uuid', auth.authenticateToken ,async (req, res) => {
    let uuid = req.params.uuid;
    let newCharapter = req.body;
    try {
        if(newCharapter.hasOwnProperty('uuid')) throw new Error('Cannot change the uuid');
        let oldCharacter = await Character.findOne({ where: {uuid}});
        await oldCharacter.update({id: oldCharacter.id, ...newCharapter});
        delete oldCharacter.dataValues.id;
        res.json(oldCharacter);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

module.exports = router;
