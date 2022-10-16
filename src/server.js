require('dotenv').config();

const Hapi = require('@hapi/hapi');
const AlbumService = require('./services/postgres/albumService');
const SongsService = require('./services/postgres/songsService');
const album = require('./api/album');
const songs = require('./api/songs');
const { AlbumValidator } = require('../validator/album');
const ClientError = require('./exception/ClientError');
const SongsValidator = require('../validator/songs');

const init = async () => {
    const albumService = new AlbumService();
    const songsService = new SongsService();

    // Server Configuration
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    // Plugin
    await server.register([
        {
            plugin: album,
            options: {
                service: albumService,
                validator: AlbumValidator
            }
        },
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongsValidator
            }
        }
    ]);

    // Error Handling
    server.ext('onPreResponse', (request, h) => {
        const { response } = request;

        // If Error
        if (response instanceof Error) {
            // Internal Error
            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }
        
            // Native Error
            if (!response.isServer) {
                return h.continue;
            }

            // Server Error
            const newResponse = h.response({
                status: 'error',
                message: 'terjadi kegagalan pada server kami'
            });
            newResponse.code(500);
            return newResponse;
        }

        // If OK
        return h.continue;
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();