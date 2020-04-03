const { Pool } = require('pg');
const fs = require('fs');

module.exports = class FileService {
  constructor() {
    this._pool = new Pool();
  }

  async openTransaction() {
    const client = await this._pool.connect();
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
          fileInfo.encoding,
        ],
      );

      return await this.validateTransaction(client);
    } catch (error) {
      await this.abortTransaction(client);
      // on veut supprimer le fichier dans /data/upload
      await fs.promises.unlink('data/upload/' + fileInfo.filename);
      throw error;
    }
  }

  async getFilesInfo() {
    const client = await this._pool.connect();
    const queryResult = await client.query('SELECT * FROM filestore');

    client.release();
    return queryResult.rows;
  }

  async getFile(id) {
    const client = await this._pool.connect();
    const queryResult = await client.query(
      'SELECT * FROM filestore WHERE id=$1',
      [id],
    );
    client.release();
    if (queryResult.rowCount === 0) return null;

    // metadata
    const fileInfo = queryResult.rows[0];
    const file = fs.createReadStream('data/upload/' + fileInfo['file-name']);

    return {
      fileInfo,
      file,
    };
  }
};
