class Identity extends ViewModel {
    Email: string;
    Password: string;

    constructor(view: JQuery) {
        super(view);
        this.set_validation(this.emailValidator);
    }

    get emailValidator(): Validator {
        return new Validator('Email', (email) => {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }, 'Email must following standarts!', '');
    }

    modelValidation() : Validator {
        return new Validator('Identity', x => {
            var model = x as Identity;
            return !(model.Email || '').isNullOrWhitespace()
                && !(model.Password || '').isNullOrWhitespace();
        }, 'All fields required!');
    }

    submit() { this.login(this); }
    
    async auth($this) {
        var model = $this as Identity;

        var submitValidator = model.modelValidation();        
        if (!submitValidator.validating_function(model)) {
            Materialize.toast(submitValidator.error_msg, 3000, 'red');
            return;
        }

        var token = await model.request<any>('/token', {
            "grant_type": "password",
            "username": model.Email,
            "password": model.Password
        });
        globalAuthToken = token.access_token;

        var am = new AccountManager();
        if (await am.isLogged()) {
            var $template = $(await model.fromTemplate('Dashboard'));
            new Dashboard($template);
        } else {
            Materialize.toast('Authorization not accepted!', 6000, 'red');
            model.login(model);
        }
    }

    register($this) {
        $this.fromTemplate('Registration').then(x => {
            var $template = $(x);
            new RegisterIdentity($template);
        });
    }

    login($this) {
        debugger;
        $this.fromTemplate('LogIn').then(x => {
            var $template = $(x);
            new Identity($template);
        });
    }
}