/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var cx = React.addons.classSet;

var EircodeExamples = React.createClass({
	propTypes: {
		examples: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
		inputValue: React.PropTypes.string.isRequired,
		onClick: React.PropTypes.func.isRequired
	},
	render: function () {
		var examples = this.props.examples;
		var inputValue = this.props.inputValue;

		var elms = [];
		for (var i = 0; i < examples.length; i++) {
			var example = examples[i];
			if (i > 0) {
				elms.push(<span key={'dot' + i}>{' '}&middot;{' '}</span>);
			}
			var classes = cx({
				'example': true,
				'active': (inputValue === example)
			});
			elms.push(<span key={i} className={classes} onClick={this.props.onClick.bind(null, example)}>{example}</span>);
		}
		return <p>{elms}</p>;
	}
});

module.exports = EircodeExamples;