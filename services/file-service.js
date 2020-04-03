const { Pool } = require('pg');

module.exports = class FileService {
    constructor() {
        this.pool = new Pool();
        //Just for test : log the database server timestamp
        this.pool.query('SELECT NOW()', (err, res) => {
            console.log('requete SQL : ',err, res.rows);
            this.pool.end();
        });
    }
}