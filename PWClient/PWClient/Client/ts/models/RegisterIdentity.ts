class RegisterIdentity extends Identity {
    Name: string;
    PasswordConfirm: string;

    constructor(view: JQuery) {
        super(view);
        this.set_validation(this.passwordConfirmValidator);
    }

    get passwordConfirmValidator(): Validator {
        return new Validator('PasswordConfirm', (confirmedPassword) => {
            return this.Password == confirmedPassword;
        }, 'Password must be the same!', 'Passwords match!');
    }

    modelValidation() : Validator {
        return new Validator('Identity', x => {
            var model = x as RegisterIdentity;
            return !(model.Name || '').isNullOrWhitespace()
                && !(model.Email || '').isNullOrWhitespace()
                && !(model.Password || '').isNullOrWhitespace()
                && !(model.PasswordConfirm || '').isNullOrWhitespace();
        }, 'All fields required!');
    }
}