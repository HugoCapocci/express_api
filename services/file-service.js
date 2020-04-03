const { Pool } = require('pg');

module.exports = class FileService {
    constructor() {
        this.pool = new Pool();
        this.pool.query('SELECT NOW()', (err, res) => {
            console.log('requete SQL : ',err, res);
            this.pool.end();
        });
    }
}