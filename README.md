# EircodeJS

EircodeJS is a JavaScript library for parsing and validating Eircodes (Irish postcodes).

EircodeJS has the following goals:

<dl>
  <dt>Correctness</dt>
  <dd>EircodeJS will never reject a valid Eircode and should never accept invalid Eircodes</dd>

  <dt>Usefulness</dt>
  <dd>EircodeJS will emit detailed error messages for the user and for the developer</dd>

  <dt>Performance</dt>
  <dd>EircodeJS will be fast and have no pathologically slow edge cases</dd>
</dl>

## Methods

Using the static `Eircode.parse` method we can parse some input:

```javascript
var EircodeJS = require('eircode-js');
var result = EircodeJS.parse('A65R2GF');
```

This will return a [ParseResult](src/parse-result.js) object.

With `ParseResult` you can check if the Eircode is valid and access its parts:

```javascript
if (result.hasEircode()) {
    console.log('Routing Key = ', result.routingKey());
    console.log('Unique Identifier = ', result.uniqueIdentifier());
}
```

You can get a plain object containing all the parsed properties using `toJSON`:

```javascript
console.log(result.toJSON());
```

This will output something like:

```javascript
{
    hasEircode: true,
    eircode: 'A65R2GF',
    hasRoutingKey: true,
    routingKey: 'A65',
    hasUniqueIdentifier: true,
    uniqueIdentifier: 'R2GF',
    error: null,
    logs: []
}
```

The properties on the object (and the matching methods on `ParseResult`) are:

| Name | Type | Description |
| ---  | ---  | ----------- |
| `hasEircode` | bool | Whether the input was a complete and valid Eircode. |
| `eircode` | string | The complete Eircode in **canonical form** if `hasEircode` is true. An empty string otherwise. |
| `hasRoutingKey` | bool | Whether the input had a valid Routing Key. |
| `routingKey` | string | The Routing Key in **canonical form** if `hasRoutingKey` is true. An empty string otherwise. |
| `hasUniqueIdentifier` | bool | Whether the input had a valid Unique Identifier. Will be true iff `hasEircode` is true. |
| `uniqueIdentifier` | string | The Unique Identifier in **canonical form** if `hasUniqueIdentifier` is true. An empty string otherwise. |
| `error` | object / null | If the Eircode could not be parsed then an object containing the error details. null otherwise. |

An example `error` object is the following:

```javascript
{
    message: "Unique Identifier cannot contain \"!\"",
    inputPos: 5,
    outputPos: 4
}
```

In this example `inputPos` differs from `outputPos` because a whitespace character in the input was skipped over.

The error object contains the following properties:

| Name | Type | Description |
| ---  | ---  | ----------- |
| `message` | string | A human readable message describing the error. |
| `inputPos` | int | The position in the input string where the error occurred. Or -1 if there is no applicable position. `inputPos` will equal the length of the input string if more input was expected. |
| `outputPos` | int | The position in the output string (the canonical form) where the error occurred. Or -1 if there is no applicable position. Will never be greater than six. |

## Eircode Specification

I have compiled the following unofficial Eircode specification based on the information that's been released to date (see [References](#References)).

An example of a valid Eircode is:

- `A65R2GF`

In this example:

- `A65` is the Routing Key
- `R2GF` is the Unique Identifier

The Routing Key:

- Begins with a letter
- Followed by two numbers

The only exception is 'D6W' which is a valid Routing Key.

The Unique Identifier:

- Contains four safe characters

A safe character is either a safe letter or a safe number.

A safe letter is an alphabetic character, excluding:

- `O` and `I`
- `M` and `N`

A safe number is a numeric digit, excluding:

- `0` and `1`

## Terminology

A **valid** Eircode, Routing Key or Unique Identifier follows the patterns laid out in the specification.
Note that a valid Eircode may be unused in real life, may have been discontinued, may map to a geographic area
without any dwellings, etc. Checking if an Eircode is deliverable is different to checking if it is valid.

The **canonical** form of an Eircode has letters uppercased and spaces and non-valid characters removed.
For example, `A65R2GF` is the canonical form of both `a65 r2gf` and `A-65-R2GF`. The `ParseResult` properties `routingKey`,
`uniqueIdentifier` and `eircode` will always contain either the canonical form or an empty string (if invalid).

## References

[http://www.fretwell.ie/images/Eircode.pdf](http://www.fretwell.ie/images/Eircode.pdf)
