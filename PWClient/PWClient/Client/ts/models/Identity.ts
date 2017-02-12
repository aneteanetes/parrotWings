class Identity extends ValidatedViewModel {
    Name: string;
    Email: string;
    Password: string;
    PasswordConfirm: string;

    constructor(view: JQuery) {
        super(view);
        this.create_validation('Email', this.emailValidator);
        this.create_validation('PasswordConfirm', this.passwordConfirmValidator);
    }

    get emailValidator(): Validator {
        return new Validator((email) => {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }, 'Email must following standarts!');
    }

    get passwordConfirmValidator(): Validator {
        return new Validator((confirmedPassword) => {
            debugger;
            return this.Password == confirmedPassword;
        }, 'Password must be the same!');
    }
}