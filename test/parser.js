var test = require('tape');
var Parser = require('../src/parser');

var parse = new Parser().parse;

function routingKeyInvalid(t, parseResult) {
    t.false(parseResult.isValid);
    t.false(parseResult.hasRoutingKey);
    t.equal(parseResult.routingKey, '');
    t.false(parseResult.hasUniqueIdentifier);
}

function uniqueIdentifierInvalid(t, parseResult) {
    t.false(parseResult.isValid);
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
    var result = parse('A65R2G').toJSON();
    t.true(result.hasRoutingKey);
    uniqueIdentifierInvalid(t, result);

    //Eight characters is too many
    var result = parse('A65R2G36').toJSON();
    t.true(result.hasRoutingKey);
    uniqueIdentifierInvalid(t, result);

    t.end();
});

test('eircodes must begin with a letter', function (t) {
    //'1' is not a valid letter
    var result = parse('365R2GF').toJSON();
    routingKeyInvalid(t, result);
    uniqueIdentifierInvalid(t, result);

    //'$' is not a valid letter
    var result = parse('$65R2GF').toJSON();
    routingKeyInvalid(t, result);
    uniqueIdentifierInvalid(t, result);

    t.end();
});

test('eircode routing keys must end with two numbers', function (t) {
    //Ending with two letters is invalid
    var result = parse('ABBR2GF').toJSON();
    routingKeyInvalid(t, result);

    //A letter in the middle is invalid
    var result = parse('AB5R2GF').toJSON();
    routingKeyInvalid(t, result);

    //Ending with a letter is invalid
    var result = parse('A5BR2GF').toJSON();
    routingKeyInvalid(t, result);

    //The only exception is D6W which is valid
    var result = parse('D6WR2GF').toJSON();
    t.true(result.isValid);
    t.true(result.hasRoutingKey);
    t.true(result.hasUniqueIdentifier);
    t.equal(result.routingKey, 'D6W');
    t.equal(result.uniqueIdentifier, 'R2GF');

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
    var result = parse('AB5R2GN').toJSON();
    routingKeyInvalid(t, result);
    uniqueIdentifierInvalid(t, result);

    t.end();
});

test('eircode can contain punctuation', function (t) {
    //Eircode can contain a dash in the middle
    var result = parse('A65-R2GF').toJSON();
    t.equal(result.routingKey, 'A65');
    t.equal(result.uniqueIdentifier, 'R2GF');

    //Punctuation is not a substitute for a valid character
    var result = parse('A65-2GF').toJSON();
    t.equal(result.routingKey, 'A65');
    uniqueIdentifierInvalid(t, result);

    t.end();
});

test('parser is case insensitive', function (t) {
    //Lowercase Eircode is returned as uppercase
    var result = parse('a65r2gf').toJSON();
    t.equal(result.routingKey, 'A65');
    t.equal(result.uniqueIdentifier, 'R2GF');
    t.equal(result.eircode, 'A65R2GF');

    t.end();
});
