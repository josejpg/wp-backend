// Requires
const db = require('../services/DB');

/**
 * Find all providers with the optional params
 * @param params
 */
const findAll = (params) => {

    let sql = "SELECT DISTINCT p.id, p.cif, p.nombre, p.email, p.direccion, p.poblacion, p.provincia, p.cp, p.telefono, p.movil FROM proyectobd.proveedores p";
    if (Object.keys(params).length > 0) {
        const sqlWhere = [];
        if (params.email != null) {
            sqlWhere.push(`email='${params.email}'`);
        }
        if (params.password != null) {
            sqlWhere.push(`password=MD5('${params.password}')`);
        }
        if (params.nombre != null) {
            sqlWhere.push(`nombre='${params.nombre}'`);
        }
        if (params.cif != null) {
            sqlWhere.push(`cif='${params.cif}'`);
        }
        if (params.telefono != null) {
            sqlWhere.push(`telefono='${params.telefono}'`);
        }
        if (params.movil != null) {
            sqlWhere.push(`movil='${params.movil}'`);
        }
        if (params.direccion != null) {
            sqlWhere.push(`direccion='${params.direccion}'`);
        }
        if (params.poblacion != null) {
            sqlWhere.push(`poblacion='${params.poblacion}'`);
        }
        if (params.provincia != null) {
            sqlWhere.push(`provincia='${params.provincia}'`);
        }
        if (params.cp != null) {
            sqlWhere.push(`cp='${params.cp}'`);
        }
        sql += ` WHERE ${sqlWhere.join(' AND ')}`;
    }

    return db.query(sql);

};

/**
 * Get a provider by ID
 * @param id
 */
const findById = (id) => {
    let sql = `SELECT DISTINCT p.id, p.cif, p.nombre, p.email, p.direccion, p.poblacion, p.provincia, p.cp, p.telefono, p.movil FROM proyectobd.proveedores p WHERE p.id = ${ id }`;
    return db.query(sql);
};

/**
 * Save a new provider
 * @param params
 */
const register = (params) => {
    const columns = [];
    const values = [];
    let error = false;
    if (params.email != null) {
        columns.push('email');
        values.push(`'${params.email}'`);
    } else {
        error = true;
    }
    if (params.password != null) {
        columns.push('password');
        values.push(`MD5('${params.password}')`);
    } else {
        error = true;
    }
    if (params.cif != null) {
        columns.push('cif');
        values.push(`'${params.cif}'`);
    }
    if (params.nombre != null) {
        columns.push('nombre');
        values.push(`'${params.nombre}'`);
    }
    if (params.telefono != null) {
        columns.push('telefono');
        values.push(`'${params.telefono}'`);
    }
    if (params.movil != null) {
        columns.push('movil');
        values.push(`'${params.movil}'`);
    }
    if (params.direccion != null) {
        columns.push('direccion');
        values.push(`'${params.direccion}'`);
    }
    if (params.poblacion != null) {
        columns.push('poblacion');
        values.push(`'${params.poblacion}'`);
    }
    if (params.provincia != null) {
        columns.push('provincia');
        values.push(`'${params.provincia}'`);
    }
    if (params.cp != null) {

        columns.push('cp');
        values.push(`'${params.cp}'`);
    }
    if (!error) {
        let sql = `INSERT INTO proyectobd.proveedores ( ${columns.join(',')} ) VALUES ( ${values.join(',')} )`;
        return db.query(sql);

    } else {
        let data = {ok: false, error: "Error registering provider. Email and password are must fields."};
        reject(data);
    }
};

/**
 * Update provider with new data
 * @param params
 */
const update = (params) => {

    const sqlUpdate = [];
    if (params.email != null) {
        sqlUpdate.push(`email='${params.email}'`);
    }
    if (params.password != null) {
        sqlUpdate.push(`password=MD5('${params.password}')`);
    }
    if (params.cif != null) {
        sqlUpdate.push(`cif='${params.cif}'`);
    }
    if (params.nombre != null) {
        sqlUpdate.push(`nombre='${params.nombre}'`);
    }
    if (params.telefono != null) {
        sqlUpdate.push(`telefono='${params.telefono}'`);
    }
    if (params.movil != null) {
        sqlUpdate.push(`movil='${params.movil}'`);
    }
    if (params.direccion != null) {
        sqlUpdate.push(`direccion='${params.direccion}'`);
    }
    if (params.poblacion != null) {
        sqlUpdate.push(`poblacion='${params.poblacion}'`);
    }
    if (params.provincia != null) {
        sqlUpdate.push(`provincia='${params.provincia}'`);
    }
    if (params.cp != null) {
        sqlUpdate.push(`cp='${params.cp}'`);
    }

    let sql = `UPDATE proyectobd.proveedores SET ${sqlUpdate.join(',')} WHERE id = ${params.id}`;
    return db.query(sql);
};

/**
 * Remove provider
 * @param id
 */
const deletebyId = (id) => {
    let sql = `DELETE FROM proyectobd.proveedores WHERE id = ${ id }`;
    return db.query(sql);
};

module.exports = {db, findAll, findById, register, update, deletebyId};