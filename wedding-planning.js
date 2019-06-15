/**
 * @author Jose J. Pardines Garcia
 */

// Requires
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const fs = require( 'fs' );
const url = require( 'url' );

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
const port = process.env.PORT || 8081;

// Routes
const routesClients = require( './core/routes/Clients' );
const routesProviders = require( './core/routes/Providers' );
const routesEvents = require( './core/routes/Events' );
const routesServices = require( './core/routes/Services' );
const routesMessages = require( './core/routes/Messages' );
const routesTodo = require( './core/routes/Todo' );

app.use( '/api/v1/clients', routesClients );
app.use( '/api/v1/providers', routesProviders );
app.use( '/api/v1/events', routesEvents );
app.use( '/api/v1/services', routesServices );
app.use( '/api/v1/messages', routesMessages );
app.use( '/api/v1/todo', routesTodo );
app.use( '/images/', ( req, res ) => {
	const pathname = url.parse( req.url ).pathname;

	res.writeHead( 200, { 'Content-Type': "image/jpg" } );
	res.end( fs.readFileSync( './images' + pathname ), 'binary' );
} );

app.listen( port );