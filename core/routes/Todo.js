// Requires
const express = require( 'express' );
const bodyParser = require( 'body-parser' );


// Repository
const Todo = require( '../repository/Todo' );

// Token
const Token = require( '../services/Token' );

// Config
const app = express();
app.use( bodyParser.json( {
	limit: '50mb',
	extended: true,
	type: 'application/json'
} ) );
app.use( bodyParser.urlencoded( {
	limit: '50mb',
	extended: true,
	parameterLimit: 50000,
	type: 'application/x-www-form-urlencoding'
} ) );
const router = express.Router();


/**
 * POST: Create.
 * Request: { "nombre": String, "evento": Event }
 * Response: { "ok": Boolean }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.post( '/', ( req, res ) => {

	if ( req.headers[ 'authorization' ] != null ) {
		const token = req.headers[ 'authorization' ].replace( 'Bearer ', '' );
		const dataToken = Token.validateToken( token );

		if ( dataToken ) {

			if ( dataToken.exp < new Date().getTime() ) {
				Todo.save( req.body )
						.then( () => {
							return {
								ok: true
							};
						} )
						.then( message => {
							res.status( 200 ).send( message );
						} )
						.catch( err => {
							let data = { ok: false, error: "Todo couldn't be registered" };
							console.log( err );
							res.status( 400 ).send( data );
						} );
			} else {

				let data = { ok: false, error: "Token expired" };
				res.status( 403 ).send( data );

			}
		} else {

			let data = { ok: false, error: "Token is not correct" };
			res.status( 403 ).send( data );

		}
	} else {

		let data = { ok: false, error: "Token is not correct" };
		res.status( 403 ).send( data );

	}

} );

/**
 * PUT: Todo.
 * Response: { "ok": Boolean, todo: Todo }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.put( '/:_id', ( req, res ) => {

	if ( req.headers[ 'authorization' ] != null ) {
		const token = req.headers[ 'authorization' ].replace( 'Bearer ', '' );
		const dataToken = Token.validateToken( token );

		if ( dataToken ) {
			if ( dataToken.exp < new Date().getTime() ) {
				if ( Number( req.params._id ) === Number( req.body.id ) ) {

					Todo.findById( req.params._id )
							.then( result => {
								if ( result.length === 0 ) {
									let data = { ok: false, error: "Todo doesn't exists" };
									res.status( 200 ).send( data );
								} else {
									const dataTodo = result[ 0 ];
									if ( req.body.realizada != null ) {
										dataTodo.realizada = req.body.realizada;
									}

									Todo.update( dataTodo )
											.then( () => {
												return {
													ok: true,
													todo: dataTodo,
												};
											} )
											.then( message => {
												res.status( 200 ).send( message );
											} )
											.catch( err => {
												let data = { ok: false, error: "Error updating todo." };
												console.log( err );
												res.status( 400 ).send( data );
											} )
								}
							} );

				} else {

					let data = { ok: false, error: "Error updating todo." };
					res.status( 200 ).send( data );

				}
			} else {

				let data = { ok: false, error: "Token expired" };
				res.status( 403 ).send( data );

			}
		} else {

			let data = { ok: false, error: "Token is not correct" };
			res.status( 403 ).send( data );

		}
	} else {

		let data = { ok: false, error: "Token is not correct" };
		res.status( 403 ).send( data );

	}

} );

/**
 * Delete: Todo by ID.
 * Response: { "ok": Boolean }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.delete( '/:_id', ( req, res ) => {

	if ( req.headers[ 'authorization' ] != null ) {
		const token = req.headers[ 'authorization' ].replace( 'Bearer ', '' );
		const dataToken = Token.validateToken( token );

		if ( dataToken ) {

			if ( dataToken.exp < new Date().getTime() ) {

				Todo.remove( req.params._id )
						.then( () => {
							return {
								ok: true
							};
						} )
						.then( message => {
							res.status( 200 ).send( message );
						} )
						.catch( err => {
							let data = { ok: false, error: "Error removing todo. Try again in a few minutes" };
							console.log( err );
							res.status( 400 ).send( data );
						} );

			} else {

				let data = { ok: false, error: "Token expired" };
				res.status( 403 ).send( data );

			}

		} else {

			let data = { ok: false, error: "Token is not correct" };
			res.status( 403 ).send( data );

		}
	} else {

		let data = { ok: false, error: "Token is not correct" };
		res.status( 403 ).send( data );

	}

} );

/**
 * GET: Todo.
 * Response: { "ok": Boolean, "todoList": Array<Todo> }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.get( '/:_idEvent', ( req, res ) => {

	if ( req.headers[ 'authorization' ] != null ) {
		const token = req.headers[ 'authorization' ].replace( 'Bearer ', '' );
		const dataToken = Token.validateToken( token );

		if ( dataToken ) {

			if ( dataToken.exp < new Date().getTime() ) {
				Todo.findByEvent( req.params._idEvent )
						.then( result => {
							return {
								ok: true,
								todoList: result,
							};
						} )
						.then( ( message ) => {
							res.status( 200 ).send( message );
						} )
						.catch( err => {
							let data = { ok: false, error: "Error recovering todo list. Try again in a few minutes" };
							console.log( err );
							res.status( 400 ).send( data )
						} );


			} else {

				let data = { ok: false, error: "Token expired" };
				res.status( 403 ).send( data );

			}

		} else {

			let data = { ok: false, error: "Token is not correct" };
			res.status( 403 ).send( data );

		}
	} else {

		let data = { ok: false, error: "Token is not correct" };
		res.status( 403 ).send( data );

	}

} );

module.exports = router;