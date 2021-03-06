// Requires
const express = require( 'express' );
const bodyParser = require( 'body-parser' );


// Repository
const Events = require( '../repository/Events' );
const Providers = require( '../repository/Providers' );
const Clients = require( '../repository/Clients' );
const Messages = require( '../repository/Messages' );

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
 * Request: { "idEvent": Number, "idProvider"?: Number, "idClient"?: Number, "mensaje": String }
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
				Messages
					.save( req.body )
					.then( () => {
						return {
							ok: true
						};
					} )
					.then( message => {
						res.status( 200 ).send( message );
					} )
					.catch( err => {
						let data = { ok: false, error: "Message couldn't be registered" };
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
 * GET: Messages.
 * Response: { "ok": Boolean, "messages": Array<Messages> }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.get( '/:_idEvent', ( req, res ) => {
	if ( req.headers[ 'authorization' ] != null ) {
		const token = req.headers[ 'authorization' ].replace( 'Bearer ', '' );
		const dataToken = Token.validateToken( token );
		if ( dataToken ) {
			if ( dataToken.exp < new Date().getTime() ) {
				const params = {};
				params.evento = {};
				params.evento.id = req.params._idEvent;
				if ( req.body.proveedor != null ) {
					params.proveedor = req.body.proveedor;
				}
				if ( req.body.cliente != null ) {
					params.cliente = req.body.cliente;
				}
				Messages
					.findByEvent( params )
					.then( listMessages => {
						const listPromises = [];
						listMessages.map( dataMessage => {
							listPromises.push(
								Events
									.findById( dataMessage.evento )
									.then( dataEvent => {
										dataMessage.evento = dataEvent[ 0 ];
										dataMessage.evento.clientes = [];
										dataMessage.evento.proveedores = [];
										return dataMessage;
									} )
									.then( dataMessage => {
										if ( dataMessage.proveedor != null ) {
											return Providers
												.findById( dataMessage.proveedor )
												.then( dataProvider => {
													dataMessage.proveedor = dataProvider[ 0 ];
													dataMessage.proveedor.servicios = [];
													dataMessage.propietario = false;
													if ( dataMessage.proveedor.email === dataToken.user ) {
														dataMessage.propietario = true;
													}
													return dataMessage;
												} );
										} else {
											delete dataMessage.proveedor;
											return dataMessage;
										}
									} )
									.then( dataMessage => {
										if ( dataMessage.cliente != null ) {
											return Clients
												.findById( dataMessage.cliente )
												.then( dataClient => {
													dataMessage.cliente = dataClient[ 0 ];
													dataMessage.propietario = false;
													if ( dataMessage.cliente.email === dataToken.user ) {
														dataMessage.propietario = true;
													}
													return dataMessage;
												} );
										} else {
											delete dataMessage.cliente;
											return dataMessage;
										}
									} )
							);
						} );
						return Promise.all( listPromises ).then( result => result );
					} )
					.then( listMessages => {
						return {
							ok: true,
							messages: listMessages,
						};
					} )
					.then( ( message ) => {
						res.status( 200 ).send( message );
					} )
					.catch( err => {
						let data = { ok: false, error: "Error recovering service. Try again in a few minutes" };
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

/**
 * GET: Chats.
 * Response: { "ok": Boolean, "messages": Array<Messages> }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.get( '/chats/:_idClient', ( req, res ) => {
	if ( req.headers[ 'authorization' ] != null ) {
		const token = req.headers[ 'authorization' ].replace( 'Bearer ', '' );
		const dataToken = Token.validateToken( token );
		if ( dataToken ) {
			if ( dataToken.exp < new Date().getTime() ) {
				const params = {};
				params.cliente = {};
				params.cliente.id = req.params._idClient;
				Messages
					.findClientChat( params )
					.then( listChats => {
						const listPromises = [];
						listChats.map( dataChat => {
							listPromises.push(
								Events
									.findById( dataChat.evento )
									.then( dataEvent => {
										dataChat.evento = dataEvent[ 0 ];
										dataChat.evento.proveedores = [];
										dataChat.evento.clientes = [];
										return dataChat;
									} )
									.then( dataChat => {
											return Providers
												.findById( dataChat.proveedor )
												.then( dataProvider => {
													dataChat.proveedor = dataProvider[ 0 ];
													dataChat.proveedor.servicios = [];
													return dataChat;
												} );
									} )
							);
						} );
						return Promise.all( listPromises ).then( result => result );
					} )
					.then( listChats => {
						return {
							ok: true,
							chats: listChats,
						};
					} )
					.then( ( message ) => {
						res.status( 200 ).send( message );
					} )
					.catch( err => {
						let data = { ok: false, error: "Error recovering service. Try again in a few minutes" };
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