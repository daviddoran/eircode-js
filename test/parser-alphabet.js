var test = require('tape');
var Parser = require('../src/parser');

/**
 * Tests that the parser always accepts all allowed letters
 * and always rejects all disallowed letters.
 *
 * These tests detect typos and prevent regressions.
 */

var parser = new Parser();
var parse = parser.parse.bind(parser);

test('only certain letters are allowed', function (t) {
    var allowed = [
        'a', /*b*/ 'c', 'd', 'e', 'f', /*g*/ 'h', /*i*/ /*j*/
        'k', /*l*/ /*m*/ /*n*/ /*o*/ 'p', /*q*/ 'r', /*s*/ 't',
        /*u*/ 'v', 'w', 'x', 'y' /*z*/
    ];

    for (var c, i = 0; c = allowed[i]; i++) {
        var result = parse(['A25', c, '234'].join(''));
        t.true(result.hasEircode(), 'should be valid with lowercase ' + c);
        t.equal(result.error(), null, 'should have no error with lowercase ' + c);

        c = c.toUpperCase();
        var result = parse(['A25', c, '234'].join(''));
        t.true(result.hasEircode(), 'should be valid with uppercase ' + c);
        t.equal(result.error(), null, 'should have no error with uppercase ' + c);
    }

    t.end();
});

test('certain letters are disallowed', function (t) {
    var disallowed = [
        'b', 'g', 'i', 'j', 'l', 'm', 'o', 'q', 's', 'u', 'z'
    ];

    for (var c, i = 0; c = disallowed[i]; i++) {
        var result = parse(['A25', c, '234'].join(''));
        t.false(result.hasEircode(), 'should be invalid with lowercase ' + c);
        t.notEqual(result.error(), null, 'should have error with lowercase ' + c);

        c = c.toUpperCase();
        var result = parse(['A25', c, '234'].join(''));
        t.false(result.hasEircode(), 'should be invalid with uppercase ' + c);
        t.notEqual(result.error(), null, 'should have error with uppercase ' + c);
    }

    t.end();
});
