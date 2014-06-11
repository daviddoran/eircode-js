var ParseResult = require('./parse-result');

/**
 * @param {object} options
 * @constructor
 */
function Parser(options) {
    options = options || {};
    this._log = options.log || false;
}

var disallowedLetters = 'iomnIOMN',
    allowedLetters = [
        'abcdefgh', 'jkl', 'pqrstuvwxyz',
        'ABCDEFGH', 'JKL', 'PGRSTUVWXYZ'
    ].join(''),
    disallowedNumbers = '01',
    allowedNumbers = '23456789',
    allowedChars = [allowedLetters, allowedNumbers].join(''),
    disallowedChars = [disallowedLetters, disallowedNumbers].join(''),
    punctuationChars = ' -/';

/**
 * @param {string} input
 * @returns {ParseResult}
 */
Parser.prototype.parse = function (input) {
    var data = {logs: [], errors: []},
        routingKey = [],
        uniqueIdentifier = [];

    var error = function (error) {
        data.errors.push(error);
        return new ParseResult(data);
    };

    if (!(typeof input === 'string' || input instanceof String)) {
        return error('Eircode must be a string');
    }

    for (var i = 0, p = 0; i < input.length; i++) {
        var c = input[i];

        if (disallowedChars.indexOf(c) !== -1) {
            return error(['The characters', disallowedChars, 'are not allowed in Eircodes'].join(' '));
        }
        if (punctuationChars.indexOf(c) !== -1) {
            this._log && data.logs.push('Skipping punctuation character "' + c + '"');
            continue;
        }
        if (p === 0) {
            if (allowedLetters.indexOf(c) === -1) {
                return error('Routing Key must begin with a letter');
            }
            routingKey.push(c);
        } else if (p === 1 || p === 2) {
            if (allowedNumbers.indexOf(c) === -1) {
                if (!(p === 2 && routingKey[1] === '6' && (c === 'w' || c === 'W'))) {
                    return error('Routing Key must contain two numbers');
                }
            }
            routingKey.push(c);
        } else {
            if (allowedChars.indexOf(c) === -1) {
                data.errors.push('Unique Identifier cannot contain "' + c + '"');
            } else {
                uniqueIdentifier.push(c);
            }
        }
        p += 1;
    }

    if (routingKey.length !== 0 && routingKey.length !== 3) {
        return error('Routing Key must be three characters long');
    } else {
        data.routingKey = routingKey.join('').toUpperCase();
    }

    if (uniqueIdentifier.length !== 0) {
        if (uniqueIdentifier.length !== 4) {
            data.errors.push('Unique Identifier must be four characters long');
        } else {
            data.uniqueIdentifier = uniqueIdentifier.join('').toUpperCase();
        }
    }

    return new ParseResult(data);
};

module.exports = Parser;