// Requires
const db = require( 'mysql' );

const config = {
	host: "remotemysql.com",
	database: "y6CQ6X1U7Z",
	user: "y6CQ6X1U7Z",
	password: "u7oUzvMGHu"
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