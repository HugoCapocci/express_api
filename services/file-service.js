const { Pool } = require('pg');
const fs = require('fs');

module.exports = class FileService {
    constructor() {
        this.pool = new Pool();
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

    //Save file info in database
    async saveFileInfo(fileInfo) {
        console.log('Entering saving method');
        const client = await this.openTransaction();

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
            console.log('error : ', error);
            await this.abortTransaction(client);
            //On veut supprimer le fichier dans /data/upload si la transaction se passe mal
            await fs.promises.unlink(`data/upload/${fileInfo.filename}`);

            throw error;
        }
    }

    //List all files in database
    async list(){
        const client = await this.pool.connect();
        const filesInfo = await client.query('SELECT * FROM filestore');

        client.release();
        return filesInfo.rows;
    }

    //return details of a specific file
    async getFile(id){
        const client = await this.pool.connect();
        const queryResult = await client.query(
            'SELECT * FROM filestore WHERE id = $1',
            [id]
        );
        if(queryResult.rowCount !== 1) return null;

        const fileInfo = queryResult.rows[0];
        //console.log(fileInfo);
        const path = `data/upload/${fileInfo['file-name']}`;
        //fs.stat(path, (err, res) => { console.log(err, res); });

        const file = fs.createReadStream(path);
        
        return {
            fileInfo,
            file
        }
    }
}