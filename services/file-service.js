const { Pool } = require('pg');

module.exports = class FileService{
    constructor (){
        this.pool = new Pool();

        //test only
        /*
        this.pool.query('SELECT NOW()',(err , res) =>{
            console.log(err,res)
            this.pool.end()
        });
    */
   }
        async saveFileInfos(fileInfo){
            const client= await this.pool.connect();

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
            return client. release();
        }
}
