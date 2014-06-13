var Parser = require('./src/parser');

function EircodeJS() {
}

/**
 * @param {string} input
 * @param {object} options
 * @returns {ParseResult}
 */
EircodeJS.parse = function (input, options) {
    return new Parser(options).parse(input);
};

module.exports = EircodeJS;
