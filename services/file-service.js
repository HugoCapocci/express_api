const {Pool} = require('pg');
const fs = require('fs');

module.exports = class FileService {
    constructor() {
        this.pool = new Pool();
        /*    this.pool.query('Select now()', (err, res) => {
               console.log(err, res);
               this.pool.end();   })*/
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

    async saveFileInfos(fileInfo) {
        const client = await this.openTransaction();
        try {
            await client.query(
                'INSERT INTO filestore("file-name", "mime-type", "original-name", size, encoding) ' +
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
        } catch (e) {
            await this.abortTransaction(client);
            await fs.promises.unlink(`/data/upload/${fileInfo.filename}`);

            //on doit supprimer le fichier enregistré dans /data/upload
            throw e;
        }
        //si rollback, on veut supprimer le fichier dans /Data/uplod
        //this.abortTransvtion(client)
        //return client.release();
    }

    async getFilesInfo() {
        const client = await this.pool.connect();
        const queryResult = await client.query('SELECT * FROM filestore');
        client.release();
        return queryResult.rows;
    }

    async getFile(id) {
        const client = await this.pool.connect();
        const queryResult = await client.query('SELECT * FROM filestore WHERE id=$1', [
            id
        ]);
        client.release();
        if (queryResult.rowCount === 0) return null;
        //metadate
        const fileInfo = queryResult.rows[0];
        const path = 'data/upload/' + fileInfo['file-name'];
        console.log(path);
        const file = fs.createReadStream(path);
        return {
            fileInfo,
            file
        }
    }

    async deleteFile(id) {
        const client = await this.openTransaction();
        try {
            //recuperer metadataa (file-naem)
            const queryResult = await client.query('SELECT * FROM filestore WHERE id=$1', [
                id
            ]);
            if (queryResult.rowCount === 0) return null;

            const fileInfo = queryResult.rows[0];
            //delete la ligne en base
            const deletedResult = await client.query(
                'DELETE FROM filestore WHERE id=$1', [
                    id
                ]
            );
            //delete fichier
            const path = 'data/upload/' + fileInfo['file-name'];
            await fs.promises.unlink(path);
             await this.validateTransaction(client);
             return deletedResult.rowCount === 1;
        } catch (e) {
            await this.abortTransaction(client);
            throw e;
        }
    }
};