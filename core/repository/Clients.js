// Requires
const db = require('../services/DB');

/**
 * Find all clients with the optional params
 * @param params
 */
const findAll = (params) => {

    let sql = "SELECT DISTINCT c.id, c.dni, c.email, c.nombre, c.apellidos, c.direccion, c.poblacion, c.provincia, c.cp, c.fnac, c.edad, c.telefono, c.movil FROM clientes c";

    if (Object.keys(params).length > 0) {
        const sqlWhere = [];
        if (params.dni != null) {
            sqlWhere.push(`dni='${params.dni}'`);
        }
        if (params.email != null) {
            sqlWhere.push(`email='${params.email}'`);
        }
        if (params.password != null) {
            sqlWhere.push(`password='${params.password}'`);
        }
        if (params.nombre != null) {
            sqlWhere.push(`LOWER(nombre) LIKE '%${params.nombre.toLowerCase()}%'`);
        }
        if (params.apellidos != null) {
            sqlWhere.push(`LOWER(apellidos) LIKE '%${params.apellidos.toLowerCase()}%'`);
        }
        if (params.fnac != null) {
            sqlWhere.push(`fnac='${params.fnac}'`);
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
        if (params.listIds != null) {
            sqlWhere.push(`id  IN (${params.listIds})`);
        }
        sql += ` WHERE ${sqlWhere.join(' AND ')}`;
    }

    return db.query(sql);

};

/**
 * Get a client by ID
 * @param id
 */
const findById = (id) => {
    let sql = `SELECT DISTINCT c.id, c.dni, c.email, c.nombre, c.apellidos, c.direccion, c.poblacion, c.provincia, c.cp, c.fnac, c.edad, c.telefono, c.movil FROM clientes c WHERE c.id = ${ id }`;
    return db.query(sql);
};

/**
 * Save a new client
 * @param params
 */
const save = (params) => {
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
        values.push(`'${params.password}'`);
    } else {
        error = true;
    }
    if (params.nombre != null) {
        columns.push('nombre');
        values.push(`'${params.nombre}'`);
    }
    if (params.dni != null) {
        columns.push('dni');
        values.push(`'${params.dni}'`);
    }
    if (params.apellidos != null) {
        columns.push('apellidos');
        values.push(`'${params.apellidos}'`);
    }
    if (params.fnac != null) {
        columns.push('fnac');
        values.push(`'${params.fnac}'`);
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
        let sql = `INSERT INTO clientes ( ${columns.join(',')} ) VALUES ( ${values.join(',')} )`;
        return db.query(sql);
    } else {
        let data = {ok: false, error: "Error registering client. Email and password are must fields."};
        reject(data);
    }
};

/**
 * Update client with new data
 * @param params
 */
const update = (params) => {

    const sqlUpdate = [];
    if (params.email != null) {
        sqlUpdate.push(`email='${params.email}'`);
    }
    if (params.password != null) {
        sqlUpdate.push(`password='${params.password}'`);
    }
    if (params.nombre != null) {
        sqlUpdate.push(`nombre='${params.nombre}'`);
    }
    if (params.dni != null) {
        sqlUpdate.push(`dni='${params.dni}'`);
    }
    if (params.apellidos != null) {
        sqlUpdate.push(`apellidos='${params.apellidos}'`);
    }
    if (params.fnac != null) {
        sqlUpdate.push(`fnac='${params.fnac}'`);
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

    let sql = `UPDATE clientes SET ${sqlUpdate.join(',')} WHERE id = ${params.id}`;
    return db.query(sql);
};

/**
 * Remove client
 * @param id
 */
const remove = (id) => {
    let sql = `DELETE FROM clientes WHERE id = ${ id }`;
    return db.query(sql);
};

module.exports = {db, findAll, findById, save, update, remove};