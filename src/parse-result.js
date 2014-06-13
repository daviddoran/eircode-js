/**
 * @param {object} data
 * @constructor
 */
function ParseResult(data) {
    data = data || {};
    this._error = (data.hasOwnProperty('error') ? data.error : null);
    this._logs = (data.hasOwnProperty('logs') ? data.logs : []);
    this._routingKey = (data.hasOwnProperty('routingKey') ? data.routingKey : '');
    this._uniqueIdentifier = (data.hasOwnProperty('uniqueIdentifier') ? data.uniqueIdentifier : '');
}

ParseResult.prototype.hasEircode = function () {
    return this.hasRoutingKey() && this.hasUniqueIdentifier();
};

ParseResult.prototype.eircode = function () {
    if (this._routingKey !== '' && this._uniqueIdentifier !== '') {
        return [this._routingKey, this._uniqueIdentifier].join('');
    }
    return '';
};

ParseResult.prototype.routingKey = function () {
    return this._routingKey;
};

ParseResult.prototype.uniqueIdentifier = function () {
    return this._uniqueIdentifier;
};

ParseResult.prototype.hasRoutingKey = function () {
    return this._routingKey !== '';
};

ParseResult.prototype.hasUniqueIdentifier = function () {
    return this._uniqueIdentifier !== '';
};

ParseResult.prototype.error = function () {
    return this._error;
};

ParseResult.prototype.logs = function () {
    return this._logs;
};

ParseResult.prototype.toJSON = function () {
    return {
        hasEircode: this.hasEircode(),
        error: this._error,
        logs: this._logs,
        eircode: this.eircode(),
        routingKey: this._routingKey,
        uniqueIdentifier: this._uniqueIdentifier,
        hasRoutingKey: this.hasRoutingKey(),
        hasUniqueIdentifier: this.hasUniqueIdentifier()
    };
};

module.exports = ParseResult;
