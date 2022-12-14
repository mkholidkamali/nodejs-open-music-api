const { query } = require("@hapi/hapi/lib/validation");
const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const { mapSongsDBToModel, map, mapSongDBToModel } = require("../../../utils");
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

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Songs gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getSongs({ title, performer }) {
        if (title && performer) {
            const query = {
                text: "SELECT * FROM songs WHERE title LIKE $1 AND performer LIKE $2",
                values: [`%${title}%`, `%${performer}%`]
            };
            const result = await this._pool.query(query);
            return result.rows.map(mapSongsDBToModel);
        } 
        else if (title || performer) {
            const query = {
                text: "SELECT * FROM songs WHERE title LIKE '$1' OR performer LIKE '$2'",
                values: [`%${title}%`, `%${performer}%`]
            };
            const result = await this._pool.query(query);
            return result.rows.map(mapSongsDBToModel);
        } 
        else {
            const query = {
                text: "SELECT * FROM songs"
            };
            const result = await this._pool.query(query);
            return result.rows.map(mapSongsDBToModel);
        }
    }

    async getSongById(id) {
        const query = {
            text: "SELECT * FROM songs WHERE id = $1",
            values: [id]
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Song tidak ditemukan');
        }

        return result.rows.map(mapSongDBToModel)[0];
    }

    async editSongById(id, { title, year, genre, performer, duration, albumId }) {
        const updatedAt = new Date().toISOString();

        const query = {
            text: "UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id",
            values: [title, year, genre, performer, duration, updatedAt, id]
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Song tidak ditemukan');
        }
    }

    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id]
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Song tidak ditemukan');
        }
    }
}

module.exports = SongsService;