/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var cx = React.addons.classSet;

var EircodeError = React.createClass({
	propTypes: {
		'parse-result': React.PropTypes.object.isRequired
	},
	render: function () {
		var parseResult = this.props['parse-result'],
				error = parseResult.error();

		if (error === null) {
			return (
				<div className="eircode-valid">
					Eircode is valid
				</div>
			);
		}

		return (
			<div className="eircode-error">
				{error.message}
			</div>
		);
	}
});

module.exports = EircodeError;