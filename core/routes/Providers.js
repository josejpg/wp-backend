// Requires
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const moment = require('moment');

//Utils
const base64 = require('../utils/encryptBase64');
const myFS = require('../utils/files');


// Repository
const Providers = require('../repository/Providers');
const Services = require('../repository/Services');

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
const baseImagePath = '/images/providers';

/**
 * POST: Login.
 * Request: { "email": String, "password": String }
 * Response: { "ok": Boolean, "token": String, "provider": Providers }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.post('/login', (req, res) => {

    Providers.findAll({email: req.body.email, password: req.body.password})
        .then((result) => {
            let message = {
                ok: true,
                token: Token.generateToken(result.email),
                client: result
            };
            return message;
        })
        .then((message) => {
            res.status(200).send(message);
        }).catch(err => {
        let data = {ok: false, error: "Email or password incorrect"};
        console.log(err);
        res.status(400).send(data);
    });

});

/**
 * POST: Register.
 * Request: { "email": String, "password": String }
 * Response: { "ok": Boolean, token: String, provider: Providers }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.post('/', (req, res) => {

    Providers.register(req.body)
        .then((result) => {
            const dataProvider = req.body;
            dataProvider.id = result.insertId;
            delete dataProvider.password;
            let message = {
                ok: true,
                token: Token.generateToken(dataProvider.email),
                provider: dataProvider
            };
            return message;
        })
        .then((message) => {
            res.status(200).send(message);
        }).catch(err => {
        let data = {ok: false, error: "Provider couldn't be registered"};
        console.log(err);
        res.status(400).send(data);
    });

});

/**
 * PUT: Provider.
 * Response: { "ok": Boolean, provider: Providers }
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

                    Providers.findById(req.params._id)
                        .then(result => {
                            const dataProvider = result[0];
                            if (req.body.email != null) {
                                dataProvider.email = req.body.email;
                            }
                            if (req.body.password != null) {
                                dataProvider.password = req.body.password;
                            }
                            if (req.body.cif != null) {
                                dataProvider.cif = req.body.cif;
                            }
                            if (req.body.nombre != null) {
                                dataProvider.nombre = req.body.nombre;
                            }
                            if (req.body.telefono != null) {
                                dataProvider.telefono = req.body.telefono;
                            }
                            if (req.body.movil != null) {
                                dataProvider.movil = req.body.movil;
                            }
                            if (req.body.direccion != null) {
                                dataProvider.direccion = req.body.direccion;
                            }
                            if (req.body.poblacion != null) {
                                dataProvider.poblacion = req.body.poblacion;
                            }
                            if (req.body.provincia != null) {
                                dataProvider.provincia = req.body.provincia;
                            }
                            if (req.body.cp != null) {
                                dataProvider.cp = req.body.cp;
                            }
                            Providers.update(dataProvider)
                                .then(() => {
                                    let message = {
                                        ok: true,
                                        provider: dataProvider,
                                    };
                                    return message;
                                })
                                .then((message) => {
                                    res.status(200).send(message);
                                }).catch(err => {
                                let data = {ok: false, error: "Error updating provider."};
                                console.log(err);
                                res.status(400).send(data);
                            })
                                .catch(err => {
                                    let data = {ok: false, error: "Error updating provider."};
                                    console.log(err);
                                    res.status(400).send(data);
                                });
                        }).catch(err => {
                        let data = {ok: false, error: "Error recovering provider. Try again in a few minutes"};
                        console.log(err);
                        res.status(400).send(data);
                    });

                } else {

                    let data = {ok: false, error: "Error updating provider."};
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
 * Delete: Provider by ID.
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

                Providers.deletebyId(req.params._id)
                    .then(() => {
                        let message = {
                            ok: true
                        };
                        return message;
                    })
                    .then((message) => {
                        res.status(200).send(message);
                    })
                    .catch(err => {
                        let data = {ok: false, error: "Error removing provider. Try again in a few minutes"};
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
 * GET: Provider by ID.
 * Response: { "ok": Boolean, "provider": Providers }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.get('/:_id', (req, res) => {

    if (req.headers['authorization'] != null) {
        const token = req.headers['authorization'].replace('Bearer ', '');
        const dataToken = Token.validateToken(token);

        if (dataToken) {

            if (dataToken.exp < new Date().getTime()) {

                Providers.findById(req.params._id)
                    .then(result => {
                        if (result.length === 0) {
                            let data = {ok: false, error: "This provider doesn't exist"};
                            console.log(err);
                            res.status(400).send(data);
                        }
                        return result[0];
                    })
                    .then(dataProvider => {
                        if (dataProvider.servicios != null) {
                            const listServices = dataProvider.servicios.split(',');
                            return Services.findAll({listIds: listServices})
                                .then(result => {
                                    dataProvider.servicios = result;
                                    return dataProvider;
                                });
                        }
                        return dataProvider;
                    })
                    .then(result => {
                        return {
                            ok: true,
                            provider: result,
                        };
                    })
                    .then((message) => {
                        res.status(200).send(message);
                    })
                    .catch(err => {
                        let data = {ok: false, error: "Error recovering provider. Try again in a few minutes"};
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
 * GET: Providers.
 * Response: { "ok": Boolean, "providers": Array<Providers> }
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
                if (req.body.cif != null) {
                    params.cif = req.body.cif;
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
                if (req.body.province != null) {
                    params.province = req.body.province;
                }
                if (req.body.cp != null) {
                    params.cp = req.body.cp;
                }

                Providers.findAll(params)
                    .then(result => {
                        let message = {
                            ok: true,
                            provider: result,
                        };
                        return message;
                    })
                    .then((message) => {
                        res.status(200).send(message);
                    })
                    .catch(err => {
                        let data = {ok: false, error: "Error recovering providers. Try again in a few minutes"};
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