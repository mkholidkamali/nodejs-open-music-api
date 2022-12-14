/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        title : {
            type: 'VARCHAR(30)',
            notNull: true
        },
        year : {
            type: 'INTEGER',
            notNull: true
        },
        genre : {
            type: 'TEXT',
            notNull: true
        },
        performer : {
            type: 'VARCHAR(20)',
            notNull: true
        },
        duration : {
            type: 'INTEGER',
            notNull: false
        },
        albumId : {
            type: 'VARCHAR(50)',
            notNull: false,
        },
        "created_at": {
            type: 'TEXT',
            notNull: true,
            default: pgm.func('current_timestamp')
        },
        "updated_at": {
            type: 'TEXT',
            notNull: true,
            default: pgm.func('current_timestamp')
        }
    })
    // pgm.createIndex('songs', 'albumId')
};

exports.down = pgm => {
    pgm.dropTable('songs');
};
