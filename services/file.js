import pg from 'pg';
const { Pool } = pg;

import fs from 'fs';

import dotenv from 'dotenv';
dotenv.config();

class FileService {
    constructor() {
        this.pool = new Pool();
    };

    openTransaction = async () => {
        const client = await this.pool.connect();
        await client.query('BEGIN');
        return client;
    };

    validateTransaction = async (client) => {
        await client.query('COMMIT');
        return client.release();
    };

    abortTransaction = async (client) => {
        await client.query('ROLLBACK');
        return client.release();
    };

    saveFileInfo = async (fileInfo) => {
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
        } catch (error) {
            await this.abortTransaction(client);
            //if rollback, we want to delete the file into /data/upload
            await fs.promises.unlink(`data/upload/${fileInfo.filename}`);
            throw error;
        };
    };

    getFilesInfo = async () => {
        const client = await this.pool.connect();
        const queryResult = await client.query('SELECT * FROM filestore');

        client.release();
        return queryResult.rows;
    };

    getFile = async (id) => {
        const client = await this.pool.connect();
        const queryResult = await client.query('SELECT * FROM filestore WHERE id=$1', [id]);

        client.release();

        if (queryResult.rowCount === 0) return null;
        const fileInfo = queryResult.rows[0];
        const file = fs.createReadStream(`data/upload/${fileInfo['file-name']}`);

        return {
            fileInfo,
            file
        };
    };

    deleteFile = async (id) => {
        const client = await this.openTransaction();

        try {
            // on récup les métadatas (à minima "file-name")
            const queryResult = await client.query('SELECT * FROM filestore WHERE id=$1', [id]);
            const fileInfo = queryResult.rows[0];
            // on delete la ligne en base
            await client.query('DELETE FROM filestore WHERE id=$1', [id]);
            // on supprime le fichier
            await fs.promises.unlink(`data/upload/${fileInfo['file-name']}`);
            return await this.validateTransaction(client);
        } catch (error) {
            await this.abortTransaction(client);
            throw error;
        }
    }
};

export default FileService;