const { nanoid } = require("nanoid");

class AlbumService {
    constructor() {
        this.__pool = new Pool();
    }

    async addAlbum({ name, year }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: "INSERT INTO album VALUES($1, $2, $3, $4, $5) RETURNING id",
            values: [id, name, year, createdAt, updatedAt]
        };

        const result = await this.__pool.query(query);

        if (!result.rows[0].id) {
            
        }

        return result.rows[0].id; 
    }
}

module.exports = AlbumService;