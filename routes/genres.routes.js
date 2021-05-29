const Router = require('express');
const router = Router();
const auth = require('./auth.routes');

const { Genre } = require('../models');
const { validate } = require('../validations/genre.validation');
/**
 * @swagger
 * components:
 *  schemas:
 *    Genre:
 *      type: object
 *      required:
 *        - image
 *        - name
 *      properties:
 *        uuid:
 *          type: string
 *          format: uuid
 *          description: The auto-generated uuid of a genre
 *        image:
 *          type: string
 *          description: The URL to the image of the genre
 *        name:
 *          type: string
 *          description: The name of the genre
 *      example:
 *        uuid: 15049b20-8d8a-4b43-bad0-48aa42dd6c40
 *        image: https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FSnow_White_(Disney_character)&psig=AOvVaw2aZfJXnBLGeVASSjz34YeX&ust=1622131663146000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKC0g7_d5_ACFQAAAAAdAAAAABAD
 *        name: Fiction
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
 *     name: Genres
 */
/**
 * @swagger
 * /genres:
 *   get:
 *    summary: Returns the uuid, image and name of all the genres
 *    tags: [Genres]
 *    security:
 *    - bearerAuth: []
 *    responses:
 *      200:
 *        description: The list of genres
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *              $ref: '#/components/schemas/Genre'
 *      401:
 *        description: Unauthorized access
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: Error
 */

router.get('/' , auth.authenticateToken ,async (req , res)=>{
    try {
        let genres = await Genre.findAll();
        res.json(genres);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

/**
 * @swagger
 * /genres:
 *   post:
 *    summary: Creates a new genre
 *    tags: [Characters]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            property:
 *              properties:
 *                  uuid:
 *                    type: string
 *                    format: uuid
 *                  image:
 *                     type: string
 *                  name:
 *                     type: string
 *    responses:
 *      200:
 *        description: The genre
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Genre'
 *      401:
 *        description: Unauthorized access
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: Error
 */
router.post('/' , auth.authenticateToken ,async (req , res)=>{
  let genre = req.body;
  try {
      let val = validate(genre);
      if(!val.result) throw new Error(val.error);
      let newGenre = await Genre.create( genre );
      res.json(newGenre);
  } catch (error) {
      console.log(error);
      res.status(500).json(error);
  }
});


/**
 * @swagger
 * /genres/{uuid}:
 *   delete:
 *    summary: Delete a Genre by uuid
 *    tags: [Genres]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: uuid
 *        schema:
 *          type: string
 *          format: uuid
 *        require: true
 *        description: UUID of the Genre to delete
 *    responses:
 *      200:
 *        description: The Genre
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Genre'
 *      401:
 *        description: Unauthorized access
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: Error
 */
router.delete('/:uuid', auth.authenticateToken ,async (req,res) => {
    let uuid = req.params.uuid;
    try {
        let genre = await Genre.findOne({ where: {uuid}});
        genre.destroy();
        res.json(genre);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

/**
 * @swagger
 * /genres/{uuid}:
 *   put:
 *    summary: Update a genre by uuid
 *    tags: [Genres]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: uuid
 *        schema:
 *          type: string
 *          format: uuid
 *        require: true
 *        description: UUID of the genre to update
 *    requestBody:
 *     content:
 *       application/json:
 *         schema:
 *            properties:
 *                 image:
 *                   type: string
 *                   description: The URL to the image of the genre
 *                 name:
 *                   type: string
 *                   description: The name of the genre
 *    responses:
 *      200:
 *        description: The genre
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/genre'
 *      401:
 *        description: Unauthorized access
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: Error
 */
router.put('/:uuid', auth.authenticateToken ,async (req, res) => {
    let uuid = req.params.uuid;
    let newGenre = req.body;
    try {
        if(newGenre.hasOwnProperty('uuid')) throw new Error('Cannot change the uuid');
        let oldGenre = await Genre.findOne({where:{uuid}});
        oldGenre.update({id: oldCharacter.id, ...newGenre});
        delete oldGenre.dataValues.id;
        res.json(oldGenre);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

module.exports = router;
