var test = require('tape');
var Parser = require('../src/parser');

var parser = new Parser();
var parse = parser.parse.bind(parser);

function routingKeyInvalid(t, parseResult) {
    t.false(parseResult.hasEircode);
    t.false(parseResult.hasRoutingKey);
    t.equal(parseResult.routingKey, '');
    t.false(parseResult.hasUniqueIdentifier);
}

function uniqueIdentifierInvalid(t, parseResult) {
    t.false(parseResult.hasEircode);
    t.false(parseResult.hasUniqueIdentifier);
    t.equal(parseResult.uniqueIdentifier, '');
}

test('non-string eircodes are invalid', function (t) {
    var result = parse(1658253).toJSON();
    routingKeyInvalid(t, result);
    uniqueIdentifierInvalid(t, result);

    t.end();
});

test('empty eircodes are invalid', function (t) {
    var result = parse('').toJSON();
    routingKeyInvalid(t, result);
    uniqueIdentifierInvalid(t, result);

    t.end();
});

test('punctuation-only eircodes are invalid', function (t) {
    var result = parse('       ').toJSON();
    routingKeyInvalid(t, result);
    uniqueIdentifierInvalid(t, result);

    t.end();
});

test('eircodes must be 7 characters long', function (t) {
    //Six characters is too few
    var result = parse('A65F4E').toJSON();
    t.true(result.hasRoutingKey);
    uniqueIdentifierInvalid(t, result);

    //Eight characters is too many
    var result = parse('A65F4E36').toJSON();
    t.true(result.hasRoutingKey);
    uniqueIdentifierInvalid(t, result);

    t.end();
});

test('eircodes must begin with a letter', function (t) {
    //'1' is not a valid letter
    var result = parse('365').toJSON();
    routingKeyInvalid(t, result);
    uniqueIdentifierInvalid(t, result);

    //'$' is not a valid letter
    var result = parse('$65').toJSON();
    routingKeyInvalid(t, result);
    uniqueIdentifierInvalid(t, result);

    //'H' is a valid letter
    var result = parse('H65').toJSON();
    t.true(result.hasRoutingKey);
    t.equal(result.routingKey, 'H65');
    uniqueIdentifierInvalid(t, result);

    t.end();
});

test('eircode routing keys must end with two numbers', function (t) {
    //Ending with two letters is invalid
    var result = parse('ABBF4E2').toJSON();
    routingKeyInvalid(t, result);

    //A letter in the middle is invalid
    var result = parse('AB5F4E2').toJSON();
    routingKeyInvalid(t, result);

    //Ending with a letter is invalid
    var result = parse('A5BF4E2').toJSON();
    routingKeyInvalid(t, result);

    //The only exception is D6W which is valid
    var result = parse('D6WF4E2').toJSON();
    t.true(result.hasEircode);
    t.true(result.hasRoutingKey);
    t.true(result.hasUniqueIdentifier);
    t.equal(result.routingKey, 'D6W');
    t.equal(result.uniqueIdentifier, 'F4E2');

    t.end();
});

test('the parser returns the routing key even if the rest is invalid', function (t) {
    var result = parse('A65?2GF').toJSON();
    t.true(result.hasRoutingKey);
    t.equal(result.routingKey, 'A65');
    uniqueIdentifierInvalid(t, result);

    t.end();
});

test('eircode routing key can contain any letter or number', function (t) {
    var routingKeys = [
        'D01', 'D15', 'D6W',
        'O11', 'M01', 'N10'
    ];

    for (var rk, i = 0; rk = routingKeys[i]; i++) {
        var result = parse(rk).toJSON();
        t.true(result.hasRoutingKey);
        t.false(result.hasUniqueIdentifier);
        t.equal(result.routingKey, rk);
    }

    //Routing Key still cannot non-letter or non-number characters
    var result = parse('D1*').toJSON();
    t.false(result.hasRoutingKey);
    t.false(result.hasUniqueIdentifier);

    t.end();
});

test('eircode cannot contain certain easily confused characters', function (t) {
    //letter I is invalid
    var result = parse('AB5RIGF').toJSON();
    routingKeyInvalid(t, result);
    uniqueIdentifierInvalid(t, result);

    //number 0 is invalid
    var result = parse('AB5R2OF').toJSON();
    routingKeyInvalid(t, result);
    uniqueIdentifierInvalid(t, result);

    //letter N is invalid
    var result = parse('AB5F4EN').toJSON();
    routingKeyInvalid(t, result);
    uniqueIdentifierInvalid(t, result);

    t.end();
});

test('eircode can contain punctuation', function (t) {
    //Eircode can contain a dash in the middle
    var result = parse('A65-F4E2').toJSON();
    t.equal(result.routingKey, 'A65');
    t.equal(result.uniqueIdentifier, 'F4E2');

    //Punctuation is not a substitute for a valid character
    var result = parse('A65-2GF').toJSON();
    t.equal(result.routingKey, 'A65');
    uniqueIdentifierInvalid(t, result);

    t.end();
});

test('parser is case insensitive', function (t) {
    //Lowercase Eircode is returned as uppercase
    var result = parse('a65F4E2').toJSON();
    t.equal(result.routingKey, 'A65');
    t.equal(result.uniqueIdentifier, 'F4E2');
    t.equal(result.eircode, 'A65F4E2');

    t.end();
});
