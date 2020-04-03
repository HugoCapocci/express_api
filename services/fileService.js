const { Pool } = require('pg')

module.exports = class FileService {
    constructor() {
        this.pool = new Pool();
        this.pool.query('SELECT NOW()', (err, res) => {
            console.log(err, res)
            this.pool.end()
        });
    }
}
