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

    async submit(response: any) {
        var token = await this.request<any>('/token', {
            "grant_type": "password",
            "username": this.Email,
            "password": this.Password
        });
        debugger;
        console.log(token);
        debugger;
        var am = new AccountManager();
        if (await am.isLogged()) {
            var $template = $(await this.fromTemplate('Dashboard'));
            new Dashboard($template);
        } else
            this.login(this);
    }

    register($this) {
        $this.fromTemplate('Registration').then(x => {
            var $template = $(x);
            new RegisterIdentity($template);
        });
    }

    login($this) {
        $this.fromTemplate('LogIn').then(x => {
            var $template = $(x);
            new Identity($template);
        });
    }
}