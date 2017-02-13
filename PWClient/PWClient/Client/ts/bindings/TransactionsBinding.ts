class TransactionsBinding extends Binding {
    constructor() {
        super($('.transactions-ui'));
    }

    fieldUrlCollection() {
        var handler = this.transactionsHandler;
        return [
            new BindingField({
                field: 'usertransactions',
                url: '/api/balance/mytransactions/',
                datahandler: handler
            })
        ];
    }

    async transactionsHandler($this:Binding, data: any) {
        var html = $();
        //var concat_data = data.credits.concat(data.debits) as any[];
        for (let i = 0; i < data.length; i++) {
            var transaction = data[i];
            var template = await $this.request<string>('/templates/get/', { name: 'TransactionHistory' });
            template= template.replace('{{Operation}}', transaction.operation == 0 ? "Debit" : "Credit");
            template =template.replace('{{From/To}}', transaction.operation == 0 ? "To" : "From");
            template =template.replace('{{Person}}', transaction.UserName);
            template =template.replace('{{OperationSign}}', transaction.operation == 0 ? "-" : "+");
            template =template.replace('{{PW}}', transaction.amount);
            template =template.replace('{{When}}', transaction.when);
            template =template.replace('{{Total}}', transaction.total);
            html= html.add($(template));
        }
        debugger;
        $this["usertransactions"] = html.wrapAll($("<div>")).parent().html();
    }

    trasactions($this) {

    }
}