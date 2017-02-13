class NavBinding extends Binding {
    constructor() {
        super($('.nav-wrapper'));
    }

    fieldUrlCollection() {
        return [
            new BindingField({ field: 'username', url: '/api/identity/name' }),
            new BindingField({ field: 'pw', url: '/api/balance/mybalance/' })
        ];
    }
    
    trasactions($this) {

    }
}