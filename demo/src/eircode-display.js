/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var cx = React.addons.classSet;

var EircodeDisplay = React.createClass({
 	propTypes: {
 		'parse-result': React.PropTypes.object.isRequired
 	},
 	render: function () {
 		var parseResult = this.props['parse-result'];
 		var eircode = parseResult.routingKey() + parseResult.uniqueIdentifier(),
 				length = eircode.length,
 				error = parseResult.error();

 		var tds = [];
 		for (var i = 0; i < 7; i++) {
 			var c = (length > i) ? eircode[i] : '';
 			var classes = {
 				'eircode-char': true,
 				'eircode-char-empty': c === '',
 				'eircode-char-error': error && (error.outputPos === i)
 			};
 			if (c === '') {
 				tds.push(
 					<td key={i} className={cx(classes)}>&mdash;</td>
 				);
 			} else {
 				tds.push(
 					<td key={i} className={cx(classes)}>{c}</td>
 				);
 			}
 		}

 		return (
 			<table className="eircode-display">
 				<tr>
 					<th colSpan="3">Routing Key</th>
 					<th>&nbsp;</th>
 					<th colSpan="4">Unique Identifier</th>
 				</tr>
 				<tr>
	 				{tds.slice(0, 3)}
	 				<td className="eircode-char-spacer"></td>
	 				{tds.slice(3, 7)}
 				</tr>
 			</table>
 		);
 	}
});

module.exports = EircodeDisplay;