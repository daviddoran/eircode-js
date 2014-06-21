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
        'ABCDEFGH', 'JKL', 'PQRSTUVWXYZ'
    ].join(''),
    disallowedNumbers = '01',
    allowedNumbers = '23456789',
    allowedChars = [allowedLetters, allowedNumbers].join(''),
    allLetters = allowedLetters.concat(disallowedLetters),
    allNumbers = allowedNumbers.concat(disallowedNumbers),
    punctuationChars = ' -/';

/**
 * @param {string} input
 * @returns {ParseResult}
 */
Parser.prototype.parse = function (input) {
    var data = {logs: [], error: null},
        routingKey = [],
        uniqueIdentifier = [];

    /**
     * @param {string} message
     * @param {int} inputPos
     * @param {int} outputPos
     * @returns {ParseResult}
     */
    var error = function (message, inputPos, outputPos) {
        inputPos = (typeof inputPos === 'undefined' ? -1 : inputPos);
        outputPos = (typeof outputPos === 'undefined' ? -1 : outputPos);
        data.error = {
            message: message,
            inputPos: inputPos,
            outputPos: outputPos
        };
        return new ParseResult(data);
    };

    if (!(typeof input === 'string' || input instanceof String)) {
        return error('Eircode must be a string', -1, -1);
    }

    for (var i = 0, p = 0; i < input.length; i++) {
        var c = input[i];

        if (punctuationChars.indexOf(c) !== -1) {
            this._log && data.logs.push('Skipping punctuation character "' + c + '"');
            continue;
        }
        if (p === 0) {
            if (allLetters.indexOf(c) === -1) {
                return error('Routing Key must begin with a letter', i, p);
            }
            routingKey.push(c);
        } else if (p === 1 || p === 2) {
            if (allNumbers.indexOf(c) === -1) {
                if (!(p === 2 && routingKey[1] === '6' && (c === 'w' || c === 'W'))) {
                    return error('Routing Key must contain two numbers', i, p);
                }
            }
            routingKey.push(c);
            if (p === 2) {
                data.routingKey = routingKey.join('').toUpperCase();
            }
        } else {
            if (allowedChars.indexOf(c) === -1) {
                return error('Unique Identifier cannot contain "' + c + '"', i, p);
            } else {
                uniqueIdentifier.push(c);
            }
        }
        p += 1;
    }

    if (routingKey.length !== 0 && routingKey.length !== 3) {
        return error('Routing Key must be three characters long', input.length, routingKey.length);
    }

    if (uniqueIdentifier.length !== 0) {
        if (uniqueIdentifier.length !== 4) {
            return error(
                'Unique Identifier must be four characters long',
                input.length - 1,
                routingKey.length + uniqueIdentifier.length - 1
            );
        } else {
            data.uniqueIdentifier = uniqueIdentifier.join('').toUpperCase();
        }
    }

    return new ParseResult(data);
};

module.exports = Parser;
