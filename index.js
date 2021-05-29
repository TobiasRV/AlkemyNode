require('dotenv').config();

const express = require('express');
const { sequelize } = require('./models');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const characterRoute = require('./routes/characters.routes');
const genreRoutes = require('./routes/genres.routes');
const mediaRoutes = require('./routes/media.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 8080;

const server = app.listen( PORT, async ()=>{
    try {
        await sequelize.authenticate();
        console.log(`Server listening to port: ${server.address().port}`);
    } catch (error) {
        throw new Error(error);
    }
});
server.on('error', (error)=>{console.log(error)});

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Disney API',
            version: '1.0.0',
            description: 'A Disney characters API'
        },
        servers: [{ url: 'http://localhost:8080' }],
    },
    apis: ['./routes/*.routes.js']

}

const swaggerSpecs = swaggerJsDoc(swaggerOptions);

app.use(express.json());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
app.use('/auth', authRoutes);
app.use('/characters', characterRoute);
app.use('/movies', mediaRoutes);
app.use('/genres', genreRoutes);

