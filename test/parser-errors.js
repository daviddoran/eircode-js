var test = require('tape');
var Parser = require('../src/parser');

var parser = new Parser();
var parse = parser.parse.bind(parser);

test('first letter error has outputPos 0', function (t) {
    var error = parse('').error();
    t.equal(error.outputPos, 0);
    t.equal(error.inputPos, 0);

    var error = parse('  1').error();
    t.equal(error.outputPos, 0);
    t.equal(error.inputPos, 2);

    t.end();
});

test('routingKey number errors have outputPos 1 or 2', function (t) {
    //First number is missing
    var error = parse('A').error();
    t.equal(error.outputPos, 1);
    t.equal(error.inputPos, 1);

    //First number is actually a letter
    var error = parse('AB').error();
    t.equal(error.outputPos, 1);
    t.equal(error.inputPos, 1);

    //Second number is missing
    var error = parse('A2').error();
    t.equal(error.outputPos, 2);
    t.equal(error.inputPos, 2);

    //Second number is missing (after whitespace)
    var error = parse('A 2').error();
    t.equal(error.outputPos, 2);
    t.equal(error.inputPos, 3);

    t.end();
});

test('uniqueIdentifier first char has outputPos 3', function (t) {
    var error = parse('A65').error();
    t.equal(error.outputPos, 3);
    t.equal(error.inputPos, 3);

    //With whitespace
    var error = parse('A65 ').error();
    t.equal(error.outputPos, 3);
    t.equal(error.inputPos, 4);

    //Invalid first char
    var error = parse('A65?').error();
    t.equal(error.outputPos, 3);
    t.equal(error.inputPos, 3);

    //Invalid first char (after whitespace)
    var error = parse('A65 ?').error();
    t.equal(error.outputPos, 3);
    t.equal(error.inputPos, 4);

    t.end();
});

test('uniqueIdentifier other chars have outputPos 4/5/6', function (t) {
    //Missing second char
    var error = parse('A65R').error();
    t.equal(error.outputPos, 4);
    t.equal(error.inputPos, 4);

    //With whitespace
    var error = parse('A65 R').error();
    t.equal(error.outputPos, 4);
    t.equal(error.inputPos, 5);

    //Invalid second char
    var error = parse('A65R?').error();
    t.equal(error.outputPos, 4);
    t.equal(error.inputPos, 4);

    //Missing third char
    var error = parse('A65R2').error();
    t.equal(error.outputPos, 5);
    t.equal(error.inputPos, 5);

    //Invalid third char
    var error = parse('A65R2?').error();
    t.equal(error.outputPos, 5);
    t.equal(error.inputPos, 5);

    //Missing fourth char
    var error = parse('A65R2G').error();
    t.equal(error.outputPos, 6);
    t.equal(error.inputPos, 6);

    //Invalid fourth char
    var error = parse('A65R2G?').error();
    t.equal(error.outputPos, 6);
    t.equal(error.inputPos, 6);

    t.end();
});

test('uniqueIdentifier has extra chars', function (t) {
    //One extra char
    var error = parse('A65R2GF3').error();
    t.equal(error.outputPos, 7);
    t.equal(error.inputPos, 7);

    //One extra char (with whitespace)
    var error = parse('A65-R2GF3').error();
    t.equal(error.outputPos, 7);
    t.equal(error.inputPos, 8);

    //Two extra chars (error is still at first char)
    var error = parse('A65R2GF33').error();
    t.equal(error.outputPos, 7);
    t.equal(error.inputPos, 7);

    //Two extra chars (with whitespace)
    var error = parse('A65-R2GF33').error();
    t.equal(error.outputPos, 7);
    t.equal(error.inputPos, 8);

    t.end();
});

//test('letters [iomn] are disallowed', function (t) {
//});
