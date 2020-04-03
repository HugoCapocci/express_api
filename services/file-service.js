const { Pool } = require('pg');

module.exports = class FileService {
    constructor() {
        this.pool = new Pool();
    }

    async saveFileInfo(fileInfo){
        const client = await this.pool.connect();

        await client.query(
            'INSERT INTO filestore("file-name", "mime-type", size, encoding)',
            'VALUES ($1, $2, $3, $4)',
            [
                fileInfo.filename,
                fileInfo.mimtype,
                fileInfo.originalname,
                fileInfo.size,
                fileInfo.encoding
            ]
        );

        return client.release();
    }
}