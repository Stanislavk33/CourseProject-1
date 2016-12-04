let createResponse = function () {
    return {
        params: {
            status: -1,
            renderUrl: '',
            renderParameter: {},
            redirect: ''
        },
        events: [],
        status(givenStatus) {
            this.params.status = givenStatus;
            return this;
        },
        render(url, parameter) {
            this.params.renderUrl = url;
            this.params.renderParameter = parameter;

            this._fireEvents('end');

            return this;
        },
        redirect(url) {
            this.params.redirect = url;

            this._fireEvents('end');

            return this;
        },
        on(eventName, cb) {
            this.events[eventName] = this.events[eventName] || [];
            this.events[eventName].push(cb);
            return this;
        },
        _fireEvents(...eventNames) {
            eventNames
                .forEach(eventName => {
                    if (typeof this.events[eventName] !== "undefined") {
                        this.events[eventName]
                            .forEach(cb => {
                                cb();
                            });
                    }
                });
        }
    }
}

module.exports = { createResponse };