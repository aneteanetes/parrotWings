class Dashboard extends ViewModel {

    modelValidation(): Validator {
        return new Validator('Dashboard', x => {
            return false;
        }, 'Dashboard not exists!');
    }

    async submit() {

    }
}