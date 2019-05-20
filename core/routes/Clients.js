// Requires
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const moment = require('moment');

//Utils
const base64 = require('../utils/encryptBase64');
const myFS = require('../utils/files');


// Repository
const Clients = require('../repository/Clients');

// Token
const Token = require('../services/Token');

// Config
const app = express();
app.use(bodyParser.json({
    limit: '50mb',
    extended: true,
    type: 'application/json'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
    type: 'application/x-www-form-urlencoding'
}));
const router = express.Router();
const baseImagePath = '/images/client';

/**
 * POST: Login.
 * Request: { "email": String, "password": String }
 * Response: { "ok": Boolean, "token": String, "client": Clients }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.post('/login', (req, res) => {

    Clients.findAll({email: req.body.email, password: req.body.password})
        .then((result) => {
            if( result.length > 0 ) {
                return {
                    message: {
                        ok: true,
                        token: Token.generateToken(result.email),
                        client: result[0]
                    },
                    code: 200
                };
            }else{
                return {
                    message: {
                        ok: false,
                        error: "Email or password incorrect"
                    },
                    code: 400
                };
            }
        })
        .then((dataMessage) => {
            res.status(dataMessage.code).send(dataMessage.message);
        }).catch(err => {
        let data = {ok: false, error: "Email or password incorrect"};
        console.log(err);
        res.status(400).send(data);
    });

});

/**
 * POST: Register.
 * Request: { "email": String, "password": String }
 * Response: { "ok": Boolean, "token": String, "client": Clients }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.post('/', (req, res) => {

    Clients.save(req.body)
        .then((result) => {
            const dataClient = req.body;
            dataClient.id = result.insertId;
            delete dataClient.password;
            return {
                ok: true,
                token: Token.generateToken(dataClient.email),
                client: dataClient
            };
        })
        .then((message) => {
            res.status(200).send(message);
        }).catch(err => {
        let data = {ok: false, error: "Client couldn't be registered"};
        console.log(err);
        res.status(400).send(data);
    });

});

/**
 * PUT: Clients.
 * Response: { "ok": Boolean, "client": Clients }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.put('/:_id', (req, res) => {

    if (req.headers['authorization'] != null) {
        const token = req.headers['authorization'].replace('Bearer ', '');
        const dataToken = Token.validateToken(token);

        if (dataToken) {

            if (dataToken.exp < new Date().getTime()) {
                if (Number(req.params._id) === Number(req.body.id)) {

                    Clients.findById(req.params._id)
                    .then(result => {
                        const dataClient = result[0];
                        if (req.body.email != null) {
                            dataClient.email = req.body.email;
                        }
                        if (req.body.password != null) {
                            dataClient.password = req.body.password;
                        }
                        if (req.body.nombre != null) {
                            dataClient.nombre = req.body.nombre;
                        }
                        if (req.body.apellidos != null) {
                            dataClient.apellidos = req.body.apellidos;
                        }
                        if (req.body.fnac != null) {
                            dataClient.fnac = req.body.fnac;
                        }
                        if (req.body.telefono != null) {
                            dataClient.telefono = req.body.telefono;
                        }
                        if (req.body.movil != null) {
                            dataClient.movil = req.body.movil;
                        }
                        if (req.body.direccion != null) {
                            dataClient.direccion = req.body.direccion;
                        }
                        if (req.body.poblacion != null) {
                            dataClient.poblacion = req.body.poblacion;
                        }
                        if (req.body.provincia != null) {
                            dataClient.provincia = req.body.provincia;
                        }
                        if (req.body.cp != null) {
                            dataClient.cp = req.body.cp;
                        }
                        Clients.update(dataClient)
                        .then(() => {
                            delete dataClient.password;
                            return {
                                ok: true,
                                client: dataClient,
                            };
                        })
                        .then((message) => {
                            res.status(200).send(message);
                        }).catch(err => {
                            let data = {ok: false, error: "Error updating client."};
                            console.log(err);
                            res.status(400).send(data);
                        })
                        .catch(err => {
                            let data = {ok: false, error: "Error updating client."};
                            console.log(err);
                            res.status(400).send(data);
                        });
                    }).catch(err => {
                        let data = {ok: false, error: "Error recovering client. Try again in a few minutes"};
                        console.log(err);
                        res.status(400).send(data);
                    });

                } else {

                    let data = {ok: false, error: "Error updating client."};
                    res.status(400).send(data);

                }
            } else {

                let data = {ok: false, error: "Token expired"};
                res.status(403).send(data);

            }
        } else {

            let data = {ok: false, error: "Token is not correct"};
            res.status(403).send(data);

        }
    } else {

        let data = {ok: false, error: "Token is not correct"};
        res.status(403).send(data);

    }

});

/**
 * Delete: Client by ID.
 * Response: { "ok": Boolean }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.delete('/:_id', (req, res) => {

    if (req.headers['authorization'] != null) {
        const token = req.headers['authorization'].replace('Bearer ', '');
        const dataToken = Token.validateToken(token);

        if (dataToken) {

            if (dataToken.exp < new Date().getTime()) {

                Clients.remove(req.params._id)
                    .then(() => {
                        return {
                            ok: true
                        };
                    })
                    .then((message) => {
                        res.status(200).send(message);
                    })
                    .catch(err => {
                        let data = {ok: false, error: "Error removing client. Try again in a few minutes"};
                        console.log(err);
                        res.status(400).send(data);
                    });

            } else {

                let data = {ok: false, error: "Token expired"};
                res.status(403).send(data);

            }

        } else {

            let data = {ok: false, error: "Token is not correct"};
            res.status(403).send(data);

        }
    } else {

        let data = {ok: false, error: "Token is not correct"};
        res.status(403).send(data);

    }

});

/**
 * GET: Client by ID.
 * Response: { "ok": Boolean, "client": Clients }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.get('/:_id', (req, res) => {

    if (req.headers['authorization'] != null) {
        const token = req.headers['authorization'].replace('Bearer ', '');
        const dataToken = Token.validateToken(token);

        if (dataToken) {

            if (dataToken.exp < new Date().getTime()) {

                Clients.findById(req.params._id)
                    .then(result => {
                        if( result.length > 0 ) {
                            return {
                                message: {
                                    ok: true,
                                    client: result,
                                },
                                code: 200
                            };
                        }else{
                            return {
                                message: {
                                    ok: false,
                                    error: `Client ${req.params._id} doesn't exist`
                                },
                                code: 400
                            };
                        }
                    })
                    .then((dataMessage) => {
                        res.status(dataMessage.code).send(dataMessage.message);
                    })
                    .catch(err => {
                        let data = {ok: false, error: "Error recovering client. Try again in a few minutes"};
                        console.log(err);
                        res.status(400).send(data);
                    });

            } else {

                let data = {ok: false, error: "Token expired"};
                res.status(403).send(data);

            }

        } else {

            let data = {ok: false, error: "Token is not correct"};
            res.status(403).send(data);

        }
    } else {

        let data = {ok: false, error: "Token is not correct"};
        res.status(403).send(data);

    }

});

/**
 * GET: Clients.
 * Response: { "ok": Boolean, "clientes": Array<Clients> }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.get('/', (req, res) => {

    if (req.headers['authorization'] != null) {
        const token = req.headers['authorization'].replace('Bearer ', '');
        const dataToken = Token.validateToken(token);

        if (dataToken) {

            if (dataToken.exp < new Date().getTime()) {
                const params = {};
                if (req.body.nombre != null) {
                    params.nombre = req.body.nombre;
                }
                if (req.body.apellidos != null) {
                    params.apellidos = req.body.apellidos;
                }
                if (req.body.fnac != null) {
                    params.fnac = req.body.fnac;
                }
                if (req.body.telefono != null) {
                    params.telefono = req.body.telefono;
                }
                if (req.body.movil != null) {
                    params.movil = req.body.movil;
                }
                if (req.body.direccion != null) {
                    params.direccion = req.body.direccion;
                }
                if (req.body.poblacion != null) {
                    params.poblacion = req.body.poblacion;
                }
                if (req.body.provincia != null) {
                    params.provincia = req.body.provincia;
                }
                if (req.body.cp != null) {
                    params.cp = req.body.cp;
                }

                Clients.findAll(params)
                .then(result => {
                    return {
                        ok: true,
                        client: result,
                    };
                })
                .then((message) => {
                    res.status(200).send(message);
                })
                .catch(err => {
                    let data = {ok: false, error: "Error recovering clients. Try again in a few minutes"};
                    console.log(err);
                    res.status(400).send(data)
                });


            } else {

                let data = {ok: false, error: "Token expired"};
                res.status(403).send(data);

            }

        } else {

            let data = {ok: false, error: "Token is not correct"};
            res.status(403).send(data);

        }
    } else {

        let data = {ok: false, error: "Token is not correct"};
        res.status(403).send(data);

    }

});

module.exports = router;