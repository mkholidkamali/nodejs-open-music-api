
const mapAlbumDBToModel = ({
    id,
    name,
    year,
    created_at,
    updated_at
}) => ({
    id,
    name,
    year,
    createdAt: created_at,
    updatedAt: updated_at
});

const mapSongsDBToModel = ({
    id,
    title,
    performer
}) => ({
    id,
    title,
    performer
});

const mapSongDBToModel = ({
    id,
    title, 
    year,
    performer,
    genre,
    duration,
    albumId
}) => {
    song: {
        id,
        title, 
        year,
        performer,
        genre,
        duration,
        albumId
    }
};

module.exports = { mapAlbumDBToModel, mapSongsDBToModel }