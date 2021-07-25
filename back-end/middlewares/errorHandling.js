class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404;
    }
}

class BadRequest extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}

class NotAllowed extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 401;
    }
}

module.exports = {NotFoundError, BadRequest, NotAllowed};