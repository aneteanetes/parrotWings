class App {
    public async start() {
        //var am = new AccountManager();
        var logged = await globalAm.isLogged(); 
        if (!logged)
            globalAm.logInForm();
        //console.log(logged);
    }
}

var globalAm = new AccountManager();
new App()
    .start();