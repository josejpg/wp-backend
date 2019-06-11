// Requires
const db = require( '../services/DB' );

/**
 * Find all by event
 * @param params
 */
const findByEvent = ( params ) => {
	let sql = `SELECT DISTINCT m.id, m.ref_evento as evento, m.ref_proveedor as proveedor, m.ref_cliente as cliente, m.mensaje, m.fecha 
				FROM mensajes m 
				WHERE m.ref_evento = ${ params.evento.id }`;
	if ( params.proveedor != null ) {
		sql += ` AND ( m.ref_proveedor = ${ params.proveedor.id } 
			OR 
			(
				m.ref_cliente IS NOT NULL 
				AND m.ref_proveedor IS NULL 
			)
		)`
	}
	return db.query( sql );
};

/**
 * Find client chats
 * @param params
 */
const findClientChat = ( params ) => {
	let sql = `SELECT DISTINCT pec.ref_evento as evento, pec.ref_proveedor as proveedor
				FROM proveedores_eventos_clientes pec
				WHERE pec.ref_proveedor IS NOT NULL
				AND pec.ref_evento IN (SELECT DISTINCT pec2.ref_evento 
									FROM proveedores_eventos_clientes pec2 
									WHERE pec2.ref_cliente = ${ params.cliente.id } )
                                    AND e.activo = 1;`;
	return db.query( sql );
};


/**
 * Save a new service
 * @param params
 */
const save = ( params ) => {
	const columns = [];
	const values = [];
	columns.push( 'ref_evento' );
	values.push( `'${ params.evento.id }'` );
	columns.push( 'mensaje' );
	values.push( `'${ params.mensaje }'` );
	if ( params.proveedor != null &&
		 params.proveedor.id != null ) {
		columns.push( 'ref_proveedor' );
		values.push( `'${ params.proveedor.id }'` );
	} else {
		columns.push( 'ref_cliente' );
		values.push( `'${ params.cliente.id }'` );
	}
	columns.push( 'fecha' );
	values.push( `UNIX_TIMESTAMP( DATE_ADD( NOW(), INTERVAL 2 HOUR ) )` );
	let sql = `INSERT INTO mensajes ( ${ columns.join( ',' ) } ) VALUES ( ${ values.join( ',' ) } )`;
	return db.query( sql );
};

module.exports = { db, findByEvent, findClientChat, save };