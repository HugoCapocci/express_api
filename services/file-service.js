const { Pool } = require("pg");
const fs = require("fs").promises;
const fss = require("fs");

module.exports = class FileService {
  constructor() {
    this.pool = new Pool();
  }

  async openTransaction() {
    const client = await this.pool.connect();
    await client.query("BEGIN");
    return client;
  }

  async validateTransaction(client) {
    await client.query("COMMIT");
    return client.release();
  }

  async abortTransaction(client) {
    await client.query("ROLLBACK");
    return client.release();
  }

  async saveFileInfo(fileInfo) {
    const client = await this.openTransaction();

    try {
      await client.query(
        'INSERT INTO filestore("file-name", "mime-type", "original-name", size, encoding) ' +
          "VALUES ($1, $2, $3, $4, $5)",
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

  async getFilesInfo() {
    const client = await this.openTransaction();
    const files = await client.query("SELECT * FROM filestore");

    client.release();
    return files.rows;
  }

  async getFileInfo(id) {
    const client = await this.openTransaction();
    const file = await client.query("SELECT * FROM filestore WHERE id=$1", [
      id
    ]);

    client.release();

    if (file.rowCount === 0) return null;

    const fileInfo = file.rows[0];
    const fileByte = fss.createReadStream(
      `data/upload/${fileInfo["file-name"]}`
    );

    return {
      fileInfo,
      fileByte
    };
  }
};
