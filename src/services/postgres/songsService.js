const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const { mapSongsDBToModel } = require("../../../utils");
const InvariantError = require("../../exception/InvariantError");
const NotFoundError = require("../../exception/NotFoundError");

class SongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addSong({ title, year, genre, performer, duration, albumId }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: "INSERT INTO songs VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id",
            values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt]
        };

        const result = this._pool.query(query);

        if (!result.rows[0].length) {
            throw new InvariantError('Songs gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getSongs() {
        const result = this._pool.query('SELECT * FROM songs');

        return {
            status: "success",
            data : [
                result.rows.map(mapSongsDBToModel)
            ]
        }
    }

    async getSongById(id) {
        const query = {
            text: "SELECT * FROM songs WHERE id = $1",
            values: [id]
        }

        const result = this._pool.query(query);

        if (!result.rows[0].length) {
            throw new NotFoundError('Song tidak ditemukan');
        }

        return {
            status: "success",
            data: result.rows.map()[0]
        }
    }
}

module.exports = SongsService;