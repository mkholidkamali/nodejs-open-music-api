const autoBind = require("auto-bind");

class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        autoBind(this);
    }

    async addSongHandler(request, h) {
        this._validator.validateSongsPayload(request.payload);

        const { title, year, genre, performer, duration, albumId } = request.payload;

        const result = this._service.addSong({ title, year, genre, performer, duration, albumId });

        return result;
    }

    async getSongsHandler(request, h) {
        const result = await this._service.getSongs();
        
        return result;
    }

    async getSongByIdHandler(request, h) {
        const { id } = request.params;

        const result = this._service.getSongById(id);

        return result;
    }

    async putSongByIdHandler(request, h) {
        const { id } = request.params;

        const { title, year, genre, performer, duration, albumId } = request.payload;

        const result = this._service.editSongById(id, { title, year, genre, performer, duration, albumId });

        return result;
    }

    async deleteSongByIdHandler(request, h) {
        const { id } = request.payload;

        const result = this._service.deleteSongById(id);

        return result;
    }
}

module.exports = SongsHandler;