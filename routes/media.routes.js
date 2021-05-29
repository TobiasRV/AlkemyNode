const Router = require('express');
const router = Router();
const { authenticateToken } = require('./auth.routes');

const { Character, Media, Genre, MediaGenres} = require('../models');
const { validate } = require('../validations/media.validation');
/**
 * @swagger
 * components:
 *  schemas:
 *    Media:
 *      type: object
 *      required:
 *        - image
 *        - title
 *        - creationDate
 *        - score
 *      properties:
 *        uuid:
 *          type: string
 *          format: uuid
 *          description: The auto-generated uuid of a Media
 *        image:
 *          type: string
 *          description: The URL to the image of the Media
 *        title:
 *          type: string
 *          description: The title of the Media
 *        creationDate:
 *          type: date
 *          description: The creation date of the Media
 *        score:
 *          type: number
 *          description: The score of the Media
 *      example:
 *        uuid: 15049b20-8d8a-4b43-bad0-48aa42dd6c40
 *        image: https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FSnow_White_(Disney_character)&psig=AOvVaw2aZfJXnBLGeVASSjz34YeX&ust=1622131663146000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKC0g7_d5_ACFQAAAAAdAAAAABAD
 *        Title: Snow White and the Seven Dwarfs
 *        creationDate: 1937-12-21
 *        score: 5
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
 *     name: Media
 */
/**
 * @swagger
 * /movies:
 *   get:
 *    summary: Returns the uuid, image and name of all the movies, can be searched by title, filtered by genre and order
 *    tags: [Genres]
 *    security:
 *    - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: name
 *        schema:
 *          type:string
 *        description: The name of the media to search
 *      - in: query
 *        name: genre
 *        schema:
 *          type:string
 *          format:uuid
 *        description: The uuid of the genre to filter
 *      - in: query
 *        name: order
 *        schema:
 *          type:string
 *        description: The order of the listing
 *    responses:
 *      200:
 *        description: The list of genres
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                properties:
 *                     image:
 *                       type: string
 *                       description: The URL to the image of the media
 *                     title:
 *                       type: string
 *                       description: The title of the media
 *                     creationDate:
 *                       type: date
 *                       description: The creation date of the media
 *      401:
 *        description: Unauthorized access
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: Error
 */
router.get('/' , authenticateToken ,async (req , res)=>{
    let params = req.query;
    try {
        let query = {};
        if(params.name) query.title = params.name;
        if(params.genre) query.genre = params.genre;
        let media = await Media.findAll({ where: query ,order: [['creationDate',`${(params.order === 'ASC' || params.order === 'DESC')?params.order : 'DESC'}`]]});
        let response = [];
        media.forEach(e => {
          response.push({
            image: e.image,
            title: e.title,
            creationDate: e.creationDate
          });
        });
        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

/**
 * @swagger
 * /movies/{uuid}:
 *   get:
 *    summary: Get a media by uuid
 *    tags: [Media]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: uuid
 *        schema:
 *          type: string
 *          format: uuid
 *        require: true
 *        description: UUID of the media to get
 *    responses:
 *      200:
 *        description: The media
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Media'
 *      401:
 *        description: Unauthorized access
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: Error
 */
router.get('/:uuid', authenticateToken ,async (req , res)=>{
    let uuid = req.params.uuid;
    try {
        let media = await Media.findOne({ where:{uuid}, include:Character});
        let genres = await MediaGenres.findAll({ where: {mediaId:media.id}, include: Genre});
        media.dataValues.genres = [];
        genres.forEach(genre => {
            media.dataValues.genres.push(genre.Genre);
        });
        delete media.dataValues.id
        res.json(media);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

/**
 * @swagger
 * /movies/:
 *   post:
 *    summary: Creates a new media
 *    tags: [Media]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            property:
 *              image:
 *                type: string
 *                description: The URL to the image of the Media
 *              title:
 *                type: string
 *                description: The title of the Media
 *              creationDate:
 *                type: date
 *                description: The creation date of the Media
 *              score:
 *                type: number
 *                description: The score of the Media
 *              genreUUID:
 *                type: array
 *                items:
 *                  properties:
 *                    uuid:
 *                      type: string
 *                      format: uuid
 *                description: The uuid of the genres
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
router.post('/' , authenticateToken ,async (req , res)=>{
  let { image, title, creationDate, score, genresUUID} = req.body;
  try {
      let val = validate({ image, title, creationDate, score, genresUUID});
      if(!val.result) throw new Error(val.error);
      let genres = await Genre.findAll({ where: { uuid: genresUUID}});
      let media = await Media.create({ image, title, score, creationDate: new Date(creationDate)});
      for await(const genre of genres){
          await MediaGenres.create({mediaId:media.id, genreId:genre.id});
      }
      res.json(media);
  } catch (error) {
      console.log(error);
      res.status(500).json(error);
  }
});

/**
 * @swagger
 * /movies/{uuid}:
 *   delete:
 *    summary: Delete a media by uuid
 *    tags: [Media]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: uuid
 *        schema:
 *          type: string
 *          format: uuid
 *        require: true
 *        description: UUID of the media to delete
 *    responses:
 *      200:
 *        description: The deleted media
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Media'
 *      401:
 *        description: Unauthorized access
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: Error
 */
 router.delete('/:uuid', authenticateToken ,async (req, res) => {
  let uuid = req.params.uuid;
  try {
      let media = await Media.findOne({ where: {uuid}});
      await media.destroy();
      delete media.dataValues.id;
      res.json(media);
  } catch (error) {
      console.log(error);
      res.status(500).json(error);
  }
});

/**
* @swagger
* /movies/{uuid}:
*   put:
*    summary: Update a media by uuid
*    tags: [Media]
*    security:
*      - bearerAuth: []
*    parameters:
*      - in: path
*        name: uuid
*        schema:
*          type: string
*          format: uuid
*        require: true
*        description: UUID of the media to update
*    requestBody:
*     content:
*       application/json:
*         schema:
*            properties:
*                 image:
*                   type: string
*                   description: The URL to the image of the media
*                 title:
*                   type: string
*                   description: The title of the media
*                 creationDate:
*                   type: date
*                   description: The date of the media
*                 score:
*                   type: number
*                   description: The score of the media (0-5)
*    responses:
*      200:
*        description: The media
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/schemas/Media'
*      401:
*        description: Unauthorized access
*        $ref: '#/components/responses/UnauthorizedError'
*      500:
*        description: Error
*/
router.put('/:uuid', authenticateToken ,async (req, res) => {
  let uuid = req.params.uuid;
  let newMedia = req.body;
  try {
      if(newMedia.hasOwnProperty('uuid')) throw new Error('Cannot change the uuid');
      let oldMedia = await Character.findOne({ where: {uuid}});
      oldMedia.update({id: oldMedia.id, ...newMedia});
      delete oldMedia.dataValues.id;
      res.json(oldMedia);
  } catch (error) {
      console.log(error);
      res.status(500).json(error);
  }
});

module.exports = router;
