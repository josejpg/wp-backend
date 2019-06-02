// Requires
const express = require( 'express' );
const bodyParser = require( 'body-parser' );


// Repository
const Events = require( '../repository/Events' );
const Providers = require( '../repository/Providers' );
const Clients = require( '../repository/Clients' );

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
const baseImagePath = '/images/events';


/**
 * POST: Create.
 * Request: { "nombre": String, "descripcion": String, "fecha": Number, "activo": Number, "client": Client }
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
				Events.save( req.body )
					  .then( () => {
						  return message = {
							  ok: true
						  };
					  } )
					  .then( message => {
						  res.status( 200 ).send( message );
					  } )
					  .catch( err => {
						  let data = { ok: false, error: "Event couldn't be registered" };
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
 * PUT: Event providers.
 * Response: { "ok": Boolean }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.put( '/:_id/providers', ( req, res ) => {

	if ( req.headers[ 'authorization' ] != null ) {
		const token = req.headers[ 'authorization' ].replace( 'Bearer ', '' );
		const dataToken = Token.validateToken( token );

		if ( dataToken ) {

			if ( dataToken.exp < new Date().getTime() ) {
				if ( Number( req.params._id ) === Number( req.body.id ) ) {

					Events.updateEventProviders( req.body )
						  .then( () => {
							  return {
								  ok: true
							  };
						  } )
						  .then( message => {
							  res.status( 200 ).send( message );
						  } )
						  .catch( err => {
							  let data = { ok: false, error: "Error updating event provider." };
							  console.log( err );
							  res.status( 400 ).send( data );
						  } );

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
 * PUT: Event clients.
 * Response: { "ok": Boolean }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.put( '/:_id/clients', ( req, res ) => {

	if ( req.headers[ 'authorization' ] != null ) {
		const token = req.headers[ 'authorization' ].replace( 'Bearer ', '' );
		const dataToken = Token.validateToken( token );

		if ( dataToken ) {

			if ( dataToken.exp < new Date().getTime() ) {
				if ( Number( req.params._id ) === Number( req.body.id ) ) {

					Events.updateEventClients( req.body )
						  .then( () => {
							  return {
								  ok: true
							  };
						  } )
						  .then( message => {
							  res.status( 200 ).send( message );
						  } )
						  .catch( err => {
							  let data = { ok: false, error: "Error updating event provider." };
							  console.log( err );
							  res.status( 400 ).send( data );
						  } );

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
 * PUT: Event.
 * Response: { "ok": Boolean, event: Event }
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

					Events.findById( req.params._id )
						  .then( result => {
							  if ( result.length === 0 ) {
								  let data = { ok: false, error: "Event doesn't exists" };
								  res.status( 200 ).send( data );
							  } else {
								  const dataEvent = result[ 0 ];
								  if ( req.body.nombre != null ) {
									  dataEvent.nombre = req.body.nombre;
								  }
								  if ( req.body.descripcion != null ) {
									  dataEvent.descripcion = req.body.descripcion;
								  }
								  if ( req.body.fecha != null ) {
									  dataEvent.fecha = req.body.fecha;
								  }
								  if ( req.body.activo != null ) {
									  dataEvent.activo = req.body.activo;
								  }
								  if ( req.body.proveedores != null ) {
									  dataEvent.proveedores = req.body.proveedores;
								  }
								  if ( req.body.clientes != null ) {
									  dataEvent.clientes = req.body.clientes;
								  }

								  Events.update( dataEvent )
										.then( () => {
											return {
												ok: true,
												event: req.body,
											};
										} )
										.then( message => {
											res.status( 200 ).send( message );
										} )
										.catch( err => {
											let data = { ok: false, error: "Error updating event." };
											console.log( err );
											res.status( 400 ).send( data );
										} )
							  }
						  } );

				} else {

					let data = { ok: false, error: "Error updating event. ID don't match." };
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
 * Delete: Event by ID.
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

				Events.remove( req.params._id )
					  .then( () => {
						  return {
							  ok: true
						  };
					  } )
					  .then( message => {
						  res.status( 200 ).send( message );
					  } )
					  .catch( err => {
						  let data = { ok: false, error: "Error removing event. Try again in a few minutes" };
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
 * GET: Event by ID.
 * Response: { "ok": Boolean, "event": Events }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.get( '/:_id', ( req, res ) => {

	if ( req.headers[ 'authorization' ] != null ) {
		const token = req.headers[ 'authorization' ].replace( 'Bearer ', '' );
		const dataToken = Token.validateToken( token );

		if ( dataToken ) {

			if ( dataToken.exp < new Date().getTime() ) {

				Events.findById( req.params._id )
					  .then( result => {
						  if ( result.length === 0 ) {
							  let data = { ok: false, error: "This event doesn't exist" };
							  res.status( 200 ).send( data );
						  }
						  return result[ 0 ];
					  } )
					  .then( dataEvent => {
						  if ( dataEvent.proveedores != null ) {
							  const listProveedores = dataEvent.proveedores.split( ',' );
							  return Providers.findAll( { listIds: listProveedores } )
											  .then( result => {
												  dataEvent.proveedores = result;
												  return dataEvent;
											  } )
						  }
						  return dataEvent;
					  } )
					  .then( dataEvent => {
						  if ( dataEvent.clientes != null ) {
							  const listClients = dataEvent.clientes.split( ',' );
							  return Clients.findAll( { listIds: listClients } )
											.then( result => {
												dataEvent.clientes = result;
												return dataEvent;
											} )
						  }
						  return dataEvent;
					  } )
					  .then( dataEvent => {
						  return {
							  ok: true,
							  event: dataEvent,
						  };
					  } )
					  .then( ( message ) => {
						  res.status( 200 ).send( message );
					  } )
					  .catch( err => {
						  let data = { ok: false, error: "Error recovering event. Try again in a few minutes" };
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
 * GET: Event by Client ID.
 * Response: { "ok": Boolean, "events": Array<Events> }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.get( '/client/:_id', ( req, res ) => {

	if ( req.headers[ 'authorization' ] != null ) {
		const token = req.headers[ 'authorization' ].replace( 'Bearer ', '' );
		const dataToken = Token.validateToken( token );

		if ( dataToken ) {

			if ( dataToken.exp < new Date().getTime() ) {

				Events.findByClientId( req.params._id )
					  .then( result => {
						  if ( result.length === 0 ) {
							  let data = { ok: false, error: "This client doesn't have any event" };
							  res.status( 200 ).send( data );
						  }
						  return result;
					  } )
					  .then( listEvents => {
						  return {
							  ok: true,
							  events: listEvents,
						  };
					  } )
					  .then( ( message ) => {
						  res.status( 200 ).send( message );
					  } )
					  .catch( err => {
						  let data = { ok: false, error: "Error recovering event. Try again in a few minutes" };
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
 * GET: Event by Provider ID.
 * Response: { "ok": Boolean, "events": Array<Events> }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.get( '/provider/:_id', ( req, res ) => {

	if ( req.headers[ 'authorization' ] != null ) {
		const token = req.headers[ 'authorization' ].replace( 'Bearer ', '' );
		const dataToken = Token.validateToken( token );

		if ( dataToken ) {

			if ( dataToken.exp < new Date().getTime() ) {

				Events.findByProviderId( req.params._id )
					  .then( result => {
						  if ( result.length === 0 ) {
							  let data = { ok: false, error: "This provider doesn't have any event" };
							  console.log( err );
							  res.status( 200 ).send( data );
						  }
						  return result;
					  } )
					  .then( listEvents => {
						  return {
							  ok: true,
							  events: listEvents,
						  };
					  } )
					  .then( ( message ) => {
						  res.status( 200 ).send( message );
					  } )
					  .catch( err => {
						  let data = { ok: false, error: "Error recovering event. Try again in a few minutes" };
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
 * GET: Events.
 * Response: { "ok": Boolean, "event": Array<Events> }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.get( '/', ( req, res ) => {

	if ( req.headers[ 'authorization' ] != null ) {
		const token = req.headers[ 'authorization' ].replace( 'Bearer ', '' );
		const dataToken = Token.validateToken( token );

		if ( dataToken ) {

			if ( dataToken.exp < new Date().getTime() ) {
				const params = {};
				if ( req.body.nombre != null ) {
					params.nombre = req.body.nombre;
				}
				if ( req.body.descripcion != null ) {
					params.descripcion = req.body.descripcion;
				}
				if ( req.body.fecha != null ) {
					params.fecha = req.body.fecha;
				}
				if ( req.body.activo != null ) {
					params.activo = req.body.activo;
				}

				Events.findAll( params )
					  .then( result => {
						  return {
							  ok: true,
							  events: result,
						  };
					  } )
					  .then( ( message ) => {
						  res.status( 200 ).send( message );
					  } )
					  .catch( err => {
						  let data = { ok: false, error: "Error recovering events. Try again in a few minutes" };
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