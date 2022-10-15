const { nanoid } = require("nanoid");
const { mapAlbumDBToModel } = require("../../../utils");
const InvarianError = require("../../exception/InvariantError");
const NotFoundError = require("../../exception/NotFoundError");

class AlbumService {
    constructor() {
        this.__pool = new Pool();
    }

    async addAlbums({ name, year }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: "INSERT INTO album VALUES($1, $2, $3, $4, $5) RETURNING id",
            values: [id, name, year, createdAt, updatedAt]
        };

        const result = await this.__pool.query(query);

        if (!result.rows[0].id) {
            throw new InvarianError('Album gagal ditambahkan');
        }

        return result.rows[0].id; 
    }

    async getAlbum() {
        const result = this.__pool.query('SELECT * FROM album');
        return result.rows.map(mapAlbumDBToModel);
    }

    async getAlbumById(id) {
        const query = {
            text: "SELECT * FROM album WHERE id = $1",
            values: [id]
        };

        const result = await this.__pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        return result.rows.map(mapAlbumDBToModel)[0];
    }

    async editAlbumById(id, { name, year }) {
        const updatedAt = new Date().toISOString;
        const query = {
            text: "UPDATE album SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id",
            values: [name, year, updatedAt, id]
        };

        const result = await this.__pool(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan')
        }
    }

    async deleteAlbumById(id) {
        const query = {
            text: "DELETE FROM album WHERE id = $1 RETURNING id",
            values: [id]
        }

        const result = await this.__pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan')
        }
    }
}

module.exports = AlbumService;