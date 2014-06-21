/**
 * @jsx React.DOM
 */

var React = require('react');
var App = require('./app');

function EircodeJSDemo() {
}

EircodeJSDemo.init = function (element, initialValue) {
	React.renderComponent(
		<App appName="EircodeJS" initialValue={initialValue} />,
		element
	);
};

module.exports = EircodeJSDemo;