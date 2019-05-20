// Requires
const db = require('../services/DB');

/**
 * Find all services with the optional params
 * @param params
 */
const findAll = (params) => {

    let sql = "SELECT DISTINCT s.id, s.nombre FROM proyectobd.servicios s";

    if (Object.keys(params).length > 0) {
        const sqlWhere = [];
        if (params.nombre != null) {
            sqlWhere.push(`nombre LIKE '%${params.nombre}%'`);
        }
        if (params.listIds != null) {
            sqlWhere.push(`id IN (${params.listIds})`);
        }
        sql += ` WHERE ${sqlWhere.join(' AND ')}`;
    }

    return db.query(sql);

};

/**
 * Get a service by ID
 * @param id
 */
const findById = (id) => {
    let sql = `SELECT DISTINCT s.id, s.nombre FROM proyectobd.servicios s WHERE s.id = ${ id }`;
    return db.query(sql);
};

/**
 * Save a new service
 * @param params
 */
const save = (params) => {
    const columns = [];
    const values = [];
    if (params.nombre != null) {
        columns.push('nombre');
        values.push(`'${params.nombre}'`);
    }
    let sql = `INSERT INTO proyectobd.servicios ( ${columns.join(',')} ) VALUES ( ${values.join(',')} )`;
    return db.query(sql);
};

/**
 * Update client with new data
 * @param params
 */
const update = (params) => {

    const sqlUpdate = [];
    if (params.nombre != null) {
        sqlUpdate.push(`nombre='${params.nombre}'`);
    }

    let sql = `UPDATE proyectobd.servicios SET ${sqlUpdate.join(',')} WHERE id = ${params.id}`;
    return db.query(sql);
};

/**
 * Remove client
 * @param id
 */
const remove = (id) => {
    let sql = `DELETE FROM proyectobd.servicios WHERE id = ${ id }`;
    return db.query(sql);
};

module.exports = {db, findAll, findById, save, update, remove};