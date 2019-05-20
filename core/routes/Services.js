// Requires
const express = require('express');
const bodyParser = require('body-parser');


// Repository
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


/**
 * POST: Create.
 * Request: { "nombre": String }
 * Response: { "ok": Boolean }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.post('/', (req, res) => {

    if (req.headers['authorization'] != null) {
        const token = req.headers['authorization'].replace('Bearer ', '');
        const dataToken = Token.validateToken(token);

        if (dataToken) {

            if (dataToken.exp < new Date().getTime()) {
                Services.save(req.body)
                    .then(() => {
                        return {
                            ok: true
                        };
                    })
                    .then(message => {
                        res.status(200).send(message);
                    })
                    .catch(err => {
                        let data = {ok: false, error: "Service couldn't be registered"};
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
 * PUT: Service.
 * Response: { "ok": Boolean, service: Service }
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

                    Services.findById(req.params._id)
                        .then(result => {
                            if (result.length === 0) {
                                let data = {ok: false, error: "Service doesn't exists"};
                                res.status(400).send(data);
                            } else {
                                const dataService = result[0];
                                if (req.body.nombre != null) {
                                    dataService.nombre = req.body.nombre;
                                }

                                Services.update(dataService)
                                    .then(() => {
                                        return {
                                            ok: true,
                                            service: dataService,
                                        };
                                    })
                                    .then(message => {
                                        res.status(200).send(message);
                                    })
                                    .catch(err => {
                                        let data = {ok: false, error: "Error updating service."};
                                        console.log(err);
                                        res.status(400).send(data);
                                    })
                            }
                        });

                } else {

                    let data = {ok: false, error: "Error updating service."};
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
 * Delete: Service by ID.
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

                Services.remove(req.params._id)
                    .then(() => {
                        return {
                            ok: true
                        };
                    })
                    .then(message => {
                        res.status(200).send(message);
                    })
                    .catch(err => {
                        let data = {ok: false, error: "Error removing service. Try again in a few minutes"};
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
 * GET: Service by ID.
 * Response: { "ok": Boolean, "service": Services }
 * Response Error: { "ok": Boolean, "error": String }
 *
 */
router.get('/:_id', (req, res) => {

    if (req.headers['authorization'] != null) {
        const token = req.headers['authorization'].replace('Bearer ', '');
        const dataToken = Token.validateToken(token);

        if (dataToken) {

            if (dataToken.exp < new Date().getTime()) {

                Services.findById(req.params._id)
                    .then(result => {
                        if (result.length === 0) {
                            let data = {ok: false, error: "This service doesn't exist"};
                            res.status(400).send(data);
                        }
                        return result[0];
                    })
                    .then(dataService => {
                        return {
                            ok: true,
                            event: dataService,
                        };
                    })
                    .then((message) => {
                        res.status(200).send(message);
                    })
                    .catch(err => {
                        let data = {ok: false, error: "Error recovering service. Try again in a few minutes"};
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

/**
 * GET: Services.
 * Response: { "ok": Boolean, "services": Array<Services> }
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
                Services.findAll(params)
                    .then(result => {
                        return {
                            ok: true,
                            event: result,
                        };
                    })
                    .then((message) => {
                        res.status(200).send(message);
                    })
                    .catch(err => {
                        let data = {ok: false, error: "Error recovering service. Try again in a few minutes"};
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