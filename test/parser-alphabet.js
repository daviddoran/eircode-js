var test = require('tape');
var Parser = require('../src/parser');

/**
 * Tests that the parser always accepts all allowed letters
 * and always rejects all disallowed letters.
 *
 * These tests detect typos and prevent regressions.
 */

var parse = new Parser().parse;

test('letters except [iomn] are allowed', function (t) {
    var allowed = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', /*i*/ 'j',
        'k', 'l', /*m*/ /*n*/ /*o*/ 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z'
    ];

    for (var c, i = 0; c = allowed[i]; i++) {
        var result = parse(['A25', c, '234'].join(''));
        t.true(result.isValid(), 'should be valid with lowercase ' + c);
        t.deepEqual(result.errors(), [], 'should have no errors with lowercase ' + c);

        c = c.toUpperCase();
        var result = parse(['A25', c, '234'].join(''));
        t.true(result.isValid(), 'should be valid with uppercase ' + c);
        t.deepEqual(result.errors(), [], 'should have no errors with uppercase ' + c);
    }

    t.end();
});

test('letters [iomn] are disallowed', function (t) {
    var disallowed = [
        'i', 'm', 'n', 'o'
    ];

    for (var c, i = 0; c = disallowed[i]; i++) {
        var result = parse(['A25', c, '234'].join(''));
        t.false(result.isValid(), 'should be invalid with lowercase ' + c);
        t.notDeepEqual(result.errors(), [], 'should have errors with lowercase ' + c);

        c = c.toUpperCase();
        var result = parse(['A25', c, '234'].join(''));
        t.false(result.isValid(), 'should be invalid with uppercase ' + c);
        t.notDeepEqual(result.errors(), [], 'should have errors with uppercase ' + c);
    }

    t.end();
});
