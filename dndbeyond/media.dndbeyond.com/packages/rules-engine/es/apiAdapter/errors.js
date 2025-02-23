export class ApiAdapterException extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = ApiAdapterException.name;
    }
}
export class ApiAdapterContextException extends ApiAdapterException {
    constructor(contextData, message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = ApiAdapterContextException.name;
        this.contextData = contextData;
    }
}
export class OverrideApiException extends ApiAdapterException {
    constructor(contextData, message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = OverrideApiException.name;
        this.contextData = contextData;
    }
}
export class AuthMissingException extends ApiAdapterException {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = AuthMissingException.name;
    }
}
export class AuthException extends ApiAdapterContextException {
    constructor(contextData, message) {
        super(contextData, message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = AuthException.name;
    }
}
export class ApiAdapterUrlException extends ApiAdapterContextException {
    constructor(url, errorCode, method, contextData, message) {
        super(contextData, message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = ApiAdapterUrlException.name;
        this.url = url;
        this.errorCode = errorCode;
        this.method = method === null ? null : method.toUpperCase();
    }
}
export class ApiException extends ApiAdapterUrlException {
    constructor(url, errorCode, method, contextData, message) {
        super(url, errorCode, method, contextData, message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = ApiException.name;
    }
}
export class ApiAdapterDataException extends ApiAdapterUrlException {
    constructor(url, errorCode, method, contextData, message) {
        super(url, errorCode, method, contextData, message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = ApiAdapterDataException.name;
    }
}
