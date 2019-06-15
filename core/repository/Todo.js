// Requires
const db = require( '../services/DB' );

/**
 * Find all by Event
 * @param idTodo
 */
const findById = ( idTodo ) => {

	let sql = `SELECT DISTINCT t.id, t.nombre, t.fecha, t.realizada, t.ref_evento FROM tareas t WHERE t.id = ${ idTodo }`;

	return db.query( sql );

};
/**
 * Find all by Event
 * @param idEvent
 */
const findByEvent = ( idEvent ) => {

	let sql = `SELECT DISTINCT t.id, t.nombre, t.fecha, t.realizada FROM tareas t WHERE t.ref_evento = ${ idEvent } ORDER BY t.realizada DESC, t.fecha ASC`;

	return db.query( sql );

};

/**
 * Save a new todo
 * @param params
 */
const save = ( params ) => {
	const columns = [];
	const values = [];
	columns.push( 'nombre' );
	values.push( `'${ params.nombre }'` );
	columns.push( 'ref_evento' );
	values.push( `'${ params.evento.id }'` );
	columns.push( 'fecha' );
	values.push( `UNIX_TIMESTAMP( DATE_ADD( NOW(), INTERVAL 2 HOUR ) )` );
	let sql = `INSERT INTO tareas ( ${ columns.join( ',' ) } ) VALUES ( ${ values.join( ',' ) } )`;
	return db.query( sql );
};

/**
 * Update todo with done or not
 * @param params
 */
const update = ( params ) => {

	const sqlUpdate = [];
	sqlUpdate.push( `realizada='${ params.realizada ? 1 : 0 }'` );

	let sql = `UPDATE tareas SET ${ sqlUpdate.join( ',' ) } WHERE id = ${ params.id }`;
	return db.query( sql );
};

/**
 * Remove todo
 * @param id
 */
const remove = ( id ) => {
	let sql = `DELETE FROM tareas WHERE id = ${ id }`;
	return db.query( sql );
};

module.exports = { db, findById, findByEvent, save, update, remove };