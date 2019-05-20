// Requires
const db = require('../services/DB');

/**
 * Find all by event
 * @param params
 */
const findByEvent = (params) => {

    let sql = `SELECT DISTINCT m.id, m.ref_evento as evento, m.ref_proveedor as proveedor, m.ref_cliente as cliente, m.mensaje FROM proyectobd.mensajes m WHERE m.ref_evento = ${params.idEvent}`;
    return db.query(sql);

};


/**
 * Save a new service
 * @param params
 */
const save = (params) => {
    const columns = [];
    const values = [];
    columns.push('ref_evento');
    values.push(`'${params.idEvent}'`);
    columns.push('mensaje');
    values.push(`'${params.message}'`);
    if (params.idProvider != null) {
        columns.push('ref_proveedor');
        values.push(`'${params.idProvider}'`);
    } else {
        columns.push('ref_cliente');
        values.push(`'${params.idClient}'`);
    }
    columns.push('fecha');
    values.push(`'${new Date().getTime()}'`);
    let sql = `INSERT INTO proyectobd.mensajes ( ${columns.join(',')} ) VALUES ( ${values.join(',')} )`;
    return db.query(sql);
};

module.exports = {db, findByEvent, save};