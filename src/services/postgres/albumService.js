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
}

module.exports = AlbumService;