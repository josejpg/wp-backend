// Requires
const db = require( 'mysql' );

const config = {
	host: "eu-cdbr-west-02.cleardb.net",
	database: "heroku_6ade35d3b5e2fdc",
	user: "b3fd4713498614",
	password: "4850f518"
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