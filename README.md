# EircodeJS [![Build Status](https://api.travis-ci.org/daviddoran/eircode-js.png)](https://travis-ci.org/daviddoran/eircode-js)

EircodeJS is a JavaScript library for parsing and validating [Eircodes](http://eircode.ie/) (Irish postcodes).

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
var result = EircodeJS.parse('A65F4E2');
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
    eircode: 'A65F4E2',
    hasRoutingKey: true,
    routingKey: 'A65',
    hasUniqueIdentifier: true,
    uniqueIdentifier: 'F4E2',
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
    message: 'Unique Identifier cannot contain "!"',
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
| `outputPos` | int | The position in the output string (the canonical form) where the error occurred. Or -1 if there is no applicable position. Will never be greater than seven. |

## Browser Support

EircodeJS should work in all environments with a decent JavaScript runtime.

An issue in the following browsers is considered a bug in EircodeJS:

- The last two versions of Chrome, Firefox, Safari and Opera
- The mobile browsers in [jQuery Mobile's A-grade list](http://jquerymobile.com/gbs/1.3/)
- Internet Explorer 6 and later

Note that these guarantees don't apply to secondary resources such as the demo site,
examples or integrations with other validation libraries.

## Eircode Specification

I have compiled the following unofficial Eircode specification based on the information that's been released to date (see [References](#References)).

An example of a valid Eircode is:

- `A65F4E2`

In this example:

- `A65` is the Routing Key
- `F4E2` is the Unique Identifier

The Routing Key:

- Begins with an allowed letter
- Followed by two digits

The only exception is 'D6W' which is a valid Routing Key.

The Unique Identifier:

- Contains four allowed characters

An allowed character is either an allowed letter or a digit.

An allowed letter is an alphabetic character, excluding:

- `B`, `G`, `I`, `J`, `L`, `M`, `O`, `Q`, `S`, `U`, `Z`

A digit is any of `0` to `9`.

## Terminology

A **valid** Eircode, Routing Key or Unique Identifier follows the patterns laid out in the specification.
Note that a valid Eircode may be unused in real life, may have been discontinued, may map to a geographic area
without any dwellings, etc. Checking if an Eircode is deliverable is different to checking if it is valid.

The **canonical** form of an Eircode has letters uppercased and spaces and non-valid characters removed.
For example, `A65F4E2` is the canonical form of both `a65 F4E2` and `A-65-F4E2`. The `ParseResult` properties `routingKey`,
`uniqueIdentifier` and `eircode` will always contain either the canonical form or an empty string (if invalid).

## References

- [Eircode is the name of Ireland’s new national postcode system](http://www.fretwell.ie/images/Eircode.pdf) (Fretwell.ie)
- [Prepare your business for Eircode](http://www.eircode.ie/docs/default-source/default-document-library/prepare-your-business-for-eircode---published-v3.pdf?sfvrsn=0) (Eircode.ie)

## License

This project is released under the MIT License.

Attribution is appreciated but not required.
