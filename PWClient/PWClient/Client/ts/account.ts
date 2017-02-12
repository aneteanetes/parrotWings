class AccountManager extends TemplateLoader {
    viewmodel: Identity;

    public async isLogged() {
        var serverDecision = await this.request<boolean>('/api/identity/check/');
        return serverDecision;
    }

    public async logInForm() {
        var $view = $(await this.fromTemplate('LogIn'));
        this.viewmodel = new Identity($view);
        this.pushOnScreen($view,
            AttachType.Append);
    }
}