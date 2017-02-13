class App {
    public async start() {
        //var am = new AccountManager();
        globalBindings.push(new NavBinding());
        
        var logged = await globalAm.isLogged(); 
        if (!logged)
            globalAm.logInForm();
        else
            console.log('auth');
        //console.log(logged);
    }
}

var screenViewModel = null;
var preScreenViewModel = null;
var globalAuthToken = '';
var globalBindings: Binding[] = new Array();


var globalAm = new AccountManager();
new App()
    .start();