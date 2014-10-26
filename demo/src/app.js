/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var EircodeJS = require('eircode-js');
var EircodeExamples = require('./eircode-examples');
var EircodeDisplay = require('./eircode-display');
var EircodeInput = require('./eircode-input');
var EircodeError = require('./eircode-error');

var App = React.createClass({
	propTypes: {
		initialValue: React.PropTypes.string.isRequired
	},
	getInitialState: function () {
		return {inputValue: this.props.initialValue};
	},
	onInputChange: function (event) {
		this.setState({
			inputValue: event.target.value
		});
	},
	onClickExample: function (example) {
		this.setState({
			inputValue: example
		});
	},
	render: function () {
		var parseResult = EircodeJS.parse(this.state.inputValue);
		var debug = JSON.stringify(parseResult.toJSON(), null, '  ');
		var examples = [
			'A65 F4E2',
			'D6W V234',
			'01D-5555',
			'D6B-RTA2',
			'A65-1234',
			'W22-AB2',
			'A6'
		];
		return (
	 		<div>
	 			<div className="eircode-input-section">
		 			<div className="eircode-input-label">
		 				Type an Eircode or click one of the examples below:
		 				<EircodeExamples
		 					examples={examples}
		 					onClick={this.onClickExample}
		 					inputValue={this.state.inputValue} />
		 			</div>
		 			<EircodeInput
		 				value={this.state.inputValue}
		 				parse-result={parseResult}
		 				onChange={this.onInputChange} />
		 			<EircodeError
		 				parse-result={parseResult} />
		 		</div>

	 			<h3>Parse Result</h3>
	 			<EircodeDisplay
	 				parse-result={parseResult} />
	 			<p>Here{"'"}s the raw output of <code>EircodeJS.parse('{this.state.inputValue}').toJSON()</code></p>
	 			<pre>{debug}</pre>
	 		</div>
 		);
	}
});

module.exports = App;