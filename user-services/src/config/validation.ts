import { validate } from "class-validator";

class BaseError extends Error {
    public readonly validationMsg: any;

    constructor(validationMsg: any) {
        super(validationMsg);
        Object.setPrototypeOf(this, new.target.prototype);
        this.validationMsg = validationMsg;
        Error.captureStackTrace(this);
    }
}

//free to extend the BaseError
class UserInputError extends BaseError {
    constructor(validationMsg: any) {
        super(validationMsg);
    }
}

const validating = async (entity: any) => {
    const errors = await validate(entity, {
        skipMissingProperties: true,
        forbidUnknownValues: true,
        validationError: { target: false },
    });
    if (errors.length > 0) throw new UserInputError(errors);
    return;
};

export default validating;
