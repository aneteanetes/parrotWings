class Transactions extends ViewModel {
    Username: string;
    PW: number;

    constructor(view: JQuery) {
        super(view);
        globalBindings.push(new TransactionsBinding());
        this.set_validation(this.pwValidator);
        this.loadUserList(view);
    }

    async loadUserList(view: JQuery) {
        var data = await this.request<string>('/api/users/availablecustomers');
        var processedData = {};
        $.each(data, (i, v) => {
            processedData[v] = null;
        });
        view.find('input.autocomplete').autocomplete({
            data: processedData,
            limit: 5
        });
    }

    get pwValidator() {
        return new Validator('PW', x => x > 0, 'Amount should be a positive number!');
    }

    modelValidation(): Validator {
        return new Validator('Transaction', x => {
            var model = x as Transactions;
            return !(model.Username || '').isNullOrWhitespace()
                && model.PW > 0
        }, 'All fields required!');
    }

    async backtodashboard($this) {
        debugger;
        var model = $this as Transactions;
        var $template = $(await model.fromTemplate('Dashboard'));
        new Dashboard($template);
    }

    async submit() { }
}