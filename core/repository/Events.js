// Requires
const db = require( '../services/DB' );

/**
 * Find all events with the optional params
 * @param params
 */
const findAll = ( params ) => {

	let sql = "SELECT DISTINCT e.id, e.nombre, e.descripcion, e.fecha, e.activo FROM eventos e";
	if ( Object.keys( params ).length > 0 ) {
		const sqlWhere = [];
		if ( params.nombre != null ) {
			sqlWhere.push( `nombre='${ params.nombre }'` );
		}
		if ( params.descripcion != null ) {
			sqlWhere.push( `descripcion='${ params.descripcion }'` );
		}
		if ( params.fecha != null ) {
			sqlWhere.push( `fecha='${ params.fecha }'` );
		}
		if ( params.activo != null ) {
			sqlWhere.push( `activo='${ params.activo }'` );
		}
		sql += ` WHERE ${ sqlWhere.join( ' AND ' ) }`;
	}

	return db.query( sql );

};

/**
 * Get a event by ID
 * @param id
 */
const findById = ( id ) => {
	let sql = `SELECT DISTINCT e.id, e.nombre, e.descripcion, e.fecha, e.activo, GROUP_CONCAT(DISTINCT pec.ref_proveedor) as proveedores, GROUP_CONCAT(DISTINCT pec.ref_cliente) as clientes
                FROM eventos e
                LEFT JOIN proveedores_eventos_clientes pec ON pec.ref_evento = e.id
                WHERE e.id = ${ id }`;
	return db.query( sql )
};

/**
 * Get a event by Client ID
 * @param id
 */
const findByClientId = ( id ) => {
	let sql = `SELECT DISTINCT e.id, e.nombre, e.descripcion, e.fecha, e.activo, GROUP_CONCAT(DISTINCT pec.ref_proveedor) as proveedores
                FROM eventos e
                LEFT JOIN proveedores_eventos_clientes pec ON pec.ref_evento = e.id
                WHERE pec.ref_cliente = ${ id }`;
	return db.query( sql )
};

/**
 * Get a event by Provider ID
 * @param id
 */
const findByProviderId = ( id ) => {
	let sql = `SELECT DISTINCT e.id, e.nombre, e.descripcion, e.fecha, e.activo, GROUP_CONCAT(DISTINCT pec.ref_cliente) as clientes
                FROM eventos e
                LEFT JOIN proveedores_eventos_clientes pec ON pec.ref_evento = e.id
                WHERE pec.ref_proveedor = ${ id }`;
	return db.query( sql )
};

/**
 * Save a new event
 * @param params
 */
const save = ( params ) => {
	const columns = [];
	const values = [];
	if ( params.nombre != null ) {
		columns.push( 'nombre' );
		values.push( `'${ params.nombre }'` );
	}
	if ( params.descripcion != null ) {
		columns.push( 'descripcion' );
		values.push( `'${ params.descripcion }'` );
	}
	if ( params.fecha != null ) {
		columns.push( 'fecha' );
		values.push( `'${ params.fecha }'` );
	}
	if ( params.activo != null ) {
		columns.push( 'activo' );
		values.push( `'${ params.activo }'` );
	}

	let sql = `INSERT INTO eventos ( ${ columns.join( ',' ) } ) VALUES ( ${ values.join( ',' ) } )`;
	return db.query( sql )
			 .then( result => {
				 if ( params.clientes != null && params.clientes.length > 0 ) {
					 insertClients( result.insertId, params.clientes );
				 }
				 return result;
			 } )
			 .then( result => {
				 if ( params.proveedores != null && params.proveedores.length > 0 ) {
					 insertProviders( result.insertId, params.proveedores );
				 }
			 } );

};

/**
 * Update event with new data
 * @param params
 */
const update = ( params ) => {

	const sqlUpdate = [];
	if ( params.nombre != null ) {
		sqlUpdate.push( `nombre='${ params.nombre }'` );
	}
	if ( params.descripcion != null ) {
		sqlUpdate.push( `descripcion='${ params.descripcion }'` );
	}
	if ( params.fecha != null ) {
		sqlUpdate.push( `fecha='${ params.fecha }'` );
	}
	if ( params.activo != null ) {
		sqlUpdate.push( `activo='${ params.activo }'` );
	}

	let sql = `UPDATE eventos SET ${ sqlUpdate.join( ',' ) } WHERE id = ${ params.id }`;
	return db.query( sql )
			 .then( () => {
				 updateEventProviders( params );
			 } )
			 .then( () => {
				 updateEventClients( params );
			 } );
};

/**
 * Update event with provider
 * @param params
 */
const updateEventProviders = ( params ) => {

	deleteProviders( params.id )
		.then( () => {
			if ( params.proveedores != null && params.proveedores.length > 0 ) {
				insertProviders( params.id, params.proveedores );
			}
		} );

};

/**
 * Update event with clients
 * @param params
 */
const updateEventClients = ( params ) => {

	deleteClients( params.id )
		.then( () => {
			if ( params.clientes != null && params.clientes.length > 0 ) {
				insertClients( params.id, params.clientes );
			}
		} );

};

/**
 * Remove event
 * @param id
 */
const remove = ( id, ) => {
	let sql = `DELETE FROM proveedores_eventos_clientes WHERE ref_evento = ${ id }`;
	return db.query( sql )
			 .then( () => {
				 sql = `DELETE FROM clientes WHERE id = ${ id }`;
				 return db.query( sql );
			 } );

};

/**
 * Insert a list of providers to an event
 * @param id
 * @param listProviders
 */
const insertProviders = ( id, listProviders ) => {
	let sql = '';
	for ( const i in listProviders ) {
		sql = `INSERT INTO proveedores_eventos_clientes ( ref_proveedor, ref_evento ) VALUES( '${ listProviders[ i ].id }', '${ id }' ); `;
		db.query( sql );
	}
};

/**
 * Remove all providers from the event
 * @param id
 */
const deleteProviders = ( id ) => {
	const sql = `DELETE FROM proveedores_eventos_clientes WHERE ref_evento = ${ id } AND ref_proveedor IS NOT NULL`;
	return db.query( sql );
};

/**
 * Insert a list of clients to an event
 * @param id
 * @param listClients
 */
const insertClients = ( id, listClients ) => {
	let sql = '';
	for ( const i in listClients ) {
		sql = `INSERT INTO proveedores_eventos_clientes ( ref_cliente, ref_evento ) VALUES( '${ listClients[ i ].id }', '${ id }' ); `;
		db.query( sql )
	}
};

/**
 * Remove all clients from the event
 * @param id
 */
const deleteClients = ( id, ) => {
	const sql = `DELETE FROM proveedores_eventos_clientes WHERE ref_evento = ${ id } AND ref_cliente IS NOT NULL`;
	return db.query( sql );
};

module.exports = {
	db,
	findAll,
	findById,
	findByClientId,
	findByProviderId,
	save,
	update,
	updateEventClients,
	updateEventProviders,
	remove
};