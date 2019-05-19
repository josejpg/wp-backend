// Requires
const db = require('mysql');

const config = {
    host: "176.31.255.91",
    database: "proyectobd",
    user: "proyectobd_user",
    password: "dIfc46?4"
};
class Database {
    constructor( config ) {
        this.connection = db.createConnection( config );
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}
const dbConnection = new Database( config );

module.exports = dbConnection;