class Dashboard extends ViewModel {

    modelValidation(): Validator {
        return new Validator('Dashboard', x => {
            return false;
        }, 'Dashboard not exists!');
    }

    async submit() { }

    async transactions($this) {
        var model = ($this as Dashboard);
        var $template = $(await model.fromTemplate('Transactions'));
        new Transactions($template);
    }

    async logout($this) {
        var model = ($this as Dashboard);
        var loggedoff = await model.request<boolean>('/api/account/logout');
        globalAuthToken = '';
        var $template = $(await model.fromTemplate('LogIn'));
        new Identity($template);
    }
}