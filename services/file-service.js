const { Pool } = require('pg');
const fs = require('fs').promises;

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
            await fs.unlink(`data/upload/${fileInfo.filename}`);

            throw error;
        }
    }
}