import pg from 'pg';
const { Pool } = pg;

import dotenv from 'dotenv';
dotenv.config();

class FileService {
    constructor() {
        this.pool = new Pool();
    };

    saveFileInfo = async (fileInfo) => {
        const client = await this.pool.connect();

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

        return client.release();
    }
};

export default FileService;