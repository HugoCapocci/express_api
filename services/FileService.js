const { Pool, Client } = require('pg');
const fs = require('fs');

module.exports = class FileService {
    constructor() {
        this.pool = new Pool();

        // test only pour avoir l'heure du serveur de elephant
        // this.pool.query('SELECT NOW()', (err, res) => {
        //     console.log(err, res)
        //     this.pool.end()
        // })
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


    async saveFileInfo(fileInfo){
        const client = await this.openTransaction();
        try {
            await client.query('INSERT INTO filestore("file-name", "mime-type", "original-name", size, encoding) VALUES ($1, $2, $3, $4, $5)', [
                fileInfo.filename,
                fileInfo.mimetype,
                fileInfo.originalname,
                fileInfo.size,
                fileInfo.encoding
            ]);
            return await this.validateTransaction(client);
        }catch (e) {
            await this.abortTransaction(client);
            // on veut supprimer le fichier dans data/upload
            await fs.promises.unlink('data/upload/' + fileInfo.filename);
            throw e;//
        }
    }

    async getFilesInfo(){
        const client = await this.pool.connect();
        const queryResult = await client.query('SELECT * FROM filestore');

        client.release();
        return queryResult.rows;
    }

    async getFile(id){
        const client = await this.pool.connect();
        const queryResult = await client.query('SELECT * FROM filestore WHERE id=$1', [id]);
        client.release();

        if (queryResult.rowCount === 0) return null;
        // metadata
        const fileInfo = queryResult.rows[0];
        const path = 'data/upload/' + fileInfo["file-name"];
        console.log('path : ', path);
        const file = fs.createReadStream('data/upload/' + fileInfo['file-name']); // filereeadstream

        return {
            fileInfo,
            file
        }
    }

    async deleteFile(id){
        const client = await this.openTransaction();
        try {
            const client = await this.pool.connect();
            const queryResult = await client.query('SELECT * FROM filestore WHERE id=$1', [id]);

            if (queryResult.rowCount === 0) return null;
            // on récupère les metadata a minima 'file-name'
            const fileName = queryResult.rows[0]['file-name'];
            console.log(queryResult.rows[0]['file-name']);
            // on delete la ligne en base
            const remoteDelete = await client.query('DELETE FROM filestore WHERE id=$1', [id]);
            client.release();


            // on supprime le fichier

            await fs.promises.unlink('data/upload/' + fileName);
            return await this.validateTransaction(client);

        }catch (e) {
            await this.abortTransaction(client);
            throw e;//
        }
    }


}
