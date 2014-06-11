var Parser = require('./src/parser');

function Eircode() {
}

/**
 * @param {string} input
 * @param {object} options
 * @returns {ParseResult}
 */
Eircode.parse = function (input, options) {
    return new Parser(options).parse(input);
};

module.exports = Eircode;
