class Validator {
    field: string;
    error_msg: string;
    success_msg: string;
    validating_function(value: any): boolean { return false; }
    constructor(field: string, validation_function: (value: any) => boolean, error: string, success?: string) {
        this.field = field;
        this.validating_function = validation_function;
        this.error_msg = error;
        this.success_msg = success == null ? 'success' : success;
    }
}