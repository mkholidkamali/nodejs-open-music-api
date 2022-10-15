require('dotenv').config();

const Hapi = require('@hapi/hapi');
const AlbumService = require('./services/postgres/albumService');
const SongsService = require('./services/postgres/songsService');
const album = require('./api/album');
const songs = require('./api/songs');
const { AlbumValidator } = require('../validator/album');

const init = async () => {
    const albumService = new AlbumService();
    const songsService = new SongsService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    await server.register([
        {
            plugin: album,
            options: {
                service: albumService,
                validator: AlbumValidator
            }
        },
        {
            plugin: b,
            options: {
                service: songsService,
                validator: songsValidator
            }
        }
    ]);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();