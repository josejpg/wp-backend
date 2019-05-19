// Requires
const jwt = require('jsonwebtoken');

// Config
const secretWord = 'WeddingPlanningTFG2DAM';

/**
 * Function to generate a new token for user login.
 * @param user
 * @returns {string}
 */
const generateToken = user => {
    return jwt.sign({user: user}, secretWord, {expiresIn: "30 days"});
};

/**
 * Function to generate a new toke for user.
 * @param token
 * @returns {string}
 */
const renewToken = (token) => {
    return jwt.sign({user: this.validateToken(token)}, secretWord, {expiresIn: "2 hours"});
};

/**
 * Function to validate the token.
 * @param token
 * @returns {string}
 */
const validateToken = token => {
    try {
        return jwt.verify(token, secretWord);
    } catch (e) {
        console.log(e);
    }
};

module.exports = {generateToken, renewToken, validateToken};