const { Pool } = require('pg');
const fs = require('fs');

module.exports = class FileService {
    constructor(){
        this.pool = new Pool();
        // this.pool.query('SELECT NOW()', (err, res) => {
        //     console.log(err, res);
        //     this.pool.end();
        // });
    }

    async openTransaction() {
        const client = await this.pool.connect();
        await client.query('BEGIN');
        return client;
    }
    
    async validateTransaction(client) {
        await client.query('COMMIT');
        return client.release();
    }
    
    
    async abortTransaction(client) {
        await client.query('ROLLBACK');
        return client.release();
    }

    async saveFileInfos(fileInfo){
        let client = await this.openTransaction();

        try {
            await client.query(
                'INSERT INTO filestore("file-name", "mime-type", "original-name", size, encoding)' +
                'VALUES ($1, $2, $3, $4, $5)',
                [
                    fileInfo.filename,
                    fileInfo.mimetype,
                    fileInfo.originalname,
                    fileInfo.size,
                    fileInfo.encoding
                ]
            );
            return await this.validateTransaction(client);
        } catch (error) {
            await this.abortTransaction(client);
            await fs.unlink(`data/upload/${fileInfo.filename}`); 
            throw error;
        }
    }

    async getFilesInfo(){
        let client = await this.pool.connect();

        let queryResult = await client.query(
            'SELECT * FROM filestore'
        );

        await client.release();
        return queryResult.rows;
    }


    async getFile(id){
        let client = await this.pool.connect();

        let queryResult = await client.query(
            'SELECT * FROM filestore WHERE id=$1',
            [
                id,
            ]
        );

        client.release();

        if(queryResult.rowCount === 0) return null;
        let fileInfo = queryResult.rows[0];
        let file = fs.createReadStream('data/upload/' + fileInfo['file-name']);
        return {
            fileInfo,
            file
        };
    }
}