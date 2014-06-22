/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var cx = React.addons.classSet;

var EircodeInput = React.createClass({
	propTypes: {
		value: React.PropTypes.string.isRequired,
		onChange: React.PropTypes.func.isRequired
	},
	componentDidMount: function () {
		var input = this.refs.input.getDOMNode();
		input.focus();
		if (input.setSelectionRange) {
			var length = this.props.value.length;
			input.setSelectionRange(length, length);
		}
	},
	render: function () {
		var value = this.props.value,
				onChange = this.props.onChange;
		var parseResult = this.props['parse-result'],
				error = parseResult.error(),
				errorInputPos = error ? error.inputPos : -1;

		var annotations = [];
		for (var i = 0; i < Math.max(value.length, errorInputPos + 1); i++) {
			var c = (value.length > i) ? value[i] : 'N';
			if (error && error.inputPos === i) {
				annotations.push(
					<span key={i} className="eircode-overlay-text-invalid">{c}</span>
				);
			} else {
				annotations.push(
					<span key={i} className="eircode-overlay-text-valid">{c}</span>
				);
			}
		}

		return (
			<div className="eircode-input">
				<div className="eircode-input-overlay">
					{annotations}
				</div>
				<div className="eircode-input-underlay">
					<input ref="input" value={value} onChange={onChange} />
				</div>
			</div>
		);
	}
});

module.exports = EircodeInput;