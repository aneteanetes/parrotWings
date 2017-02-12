class AccountManager extends TemplateLoader {

    public async isLogged() {
        var serverDecision = await this.request<boolean>('/api/identity/check/');
        return serverDecision;
    }

    public async logInForm() {
        var $template = $(await this.fromTemplate('LogIn'));
        new Identity($template);
    }

    public async registerForm() {
        var $template = $(await this.fromTemplate('Registration'));
        new RegisterIdentity($template);
    }
}