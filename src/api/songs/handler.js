const autoBind = require("auto-bind");

class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async postSongHandler(request, h) {
        this._validator.validateSongsPayload(request.payload);

        const { title, year, genre, performer, duration, albumId } = request.payload;

        const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId });

        const response = h.response({
            status: 'success',
            message: 'Song berhasil ditambahkan',
            data: {
                songId
            } 
        });
        response.code(201);
        return response;
    }

    async getSongsHandler(request, h) {
        const result = await this._service.getSongs(request.query);

        return {
            status: 'success',
            data: {
                songs: result
            }
        }
    }

    async getSongByIdHandler(request, h) {
        const { id } = request.params;

        const result = await this._service.getSongById(id);

        return {
            status: 'success',
            data: {
                song: result
            }
        };
    }

    async putSongByIdHandler(request, h) {
        this._validator.validateSongsPayload(request.payload);
        
        const { id } = request.params;

        await this._service.editSongById(id, request.payload);

        return {
            status: 'success',
            message: 'Song berhasil diperbarui'
        }
    }

    async deleteSongByIdHandler(request, h) {
        const { id } = request.params;

        await this._service.deleteSongById(id);

        return {
            status: 'success',
            message: 'Song berhasil terhapus'
        }
    }
}

module.exports = SongsHandler;