/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('album', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        name: {
            type: 'VARCHAR(30)',
            notNull: true
        },
        "year": {
            type: 'VARCHAR(10)',
            notNull: true
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
    });
};

exports.down = pgm => {
    pgm.dropTable('album');
};
