# EircodeJS

## Methods

Using the static `Eircode.parse` method we can parse some input:

```javascript
var Eircode = require('eircode-js');
var result = Eircode.parse('A65R2GF');
```

This will return a [ParseResult](src/parse-result.js) object.

`ParseResult` can be used to check validity:

```javascript
if (result.isValid()) {
    console.log('Routing Key = ', result.routingKey());
    console.log('Unique Identifier = ', result.uniqueIdentifier());
}
```

You can get a plain object containing all the parsed properties:

```javascript
console.log(result.toJSON());
```

This will output something like:

```javascript
{
    isValid: true,
    errors: [],
    logs: [],
    eircode: 'A65R2GF',
    routingKey: 'A65',
    uniqueIdentifier: 'R2GF',
    hasRoutingKey: true,
    hasUniqueIdentifier: true
}
```

## Eircode Specification

I have compiled the following unofficial Eircode specification based on the information that's been released to date (see [References](#References)).

An example of a valid Eircode is:

- `A65R2GF`

In this example:

- `A65` is the Routing Key
- `R2GF` is the Unique Identifier

The Routing Key:

- Begins with a valid letter
- Followed by two valid numbers

The only exception is 'D6W' which is a valid Routing Key.

The Unique Identifier:

- Contains four valid characters

A valid character is either a valid letter or a valid number.

A valid letter is an alphabetic character, excluding:

- `O` and `I`
- `M` and `N`

A valid number is a numeric digit, excluding:

- `0` and `1`

## Terminology

A **valid** Eircode, Routing Key or Unique Identifier follows the patterns laid out in the specification.
Note that a valid Eircode may be unused in real life, may have been discontinued, may map to a geographic area
without any dwellings, etc. Checking if an Eircode is deliverable is different to checking if it is valid.

The **canonical** version of an Eircode has letters uppercased and spaces and non-valid characters removed.
For example, `A65R2GF` is the canonical version of both `a65 r2gf` and `A-65-R2GF`.

## References

[http://www.fretwell.ie/images/Eircode.pdf](http://www.fretwell.ie/images/Eircode.pdf)
