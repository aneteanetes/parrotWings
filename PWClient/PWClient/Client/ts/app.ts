class App {
    public async start() {
        //var am = new AccountManager();
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

var globalAm = new AccountManager();
new App()
    .start();