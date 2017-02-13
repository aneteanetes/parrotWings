String.prototype.isNullOrWhitespace = (function () {
    return function () {
        return this === null || this.match(/^ *$/) !== null;
    };
})();
var AttachType;
(function (AttachType) {
    AttachType[AttachType["NoAttach"] = 0] = "NoAttach";
    AttachType[AttachType["Append"] = 1] = "Append";
    AttachType[AttachType["Prepend"] = 2] = "Prepend";
    AttachType[AttachType["After"] = 3] = "After";
    AttachType[AttachType["Before"] = 4] = "Before";
    AttachType[AttachType["Inside"] = 5] = "Inside";
    AttachType[AttachType["Replace"] = 6] = "Replace";
})(AttachType || (AttachType = {}));
class JQueryPromise {
    constructor(executor) {
        let dfd = $.Deferred();
        function fulfilled(value) {
            let promise = value;
            if (value && promise.then) {
                promise.then(fulfilled, rejected);
            }
            else {
                dfd.resolve(value);
            }
        }
        function rejected(reason) {
            let promise = reason;
            if (reason && promise.then) {
                promise.then(fulfilled, rejected);
            }
            else {
                dfd.reject(reason);
            }
        }
        executor(fulfilled, rejected);
        return dfd.promise();
    }
}
class HtmlPusher {
    pushOnScreen(html, attach) {
        var target = $('.screen');
        switch (attach) {
            case AttachType.After:
                target.after(html);
                break;
            case AttachType.Before:
                target.before(html);
                break;
            case AttachType.Append:
                target.append(html);
                break;
            case AttachType.Prepend:
                target.prepend(html);
                break;
            case AttachType.Inside:
                target.html('');
                target.append(html);
                break;
            case AttachType.Replace:
                target.replaceWith(html);
                break;
            default: break;
        }
    }
}
class Request extends HtmlPusher {
    constructor(error) {
        super();
        this.errorCatch = error;
    }
    request(url, data) {
        var response = $.ajax({
            url: url,
            type: 'post',
            data: data,
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + globalAuthToken); },
            error: (xhr, z, u) => { console.log(xhr); console.log(z); console.log(u); debugger; this.errorCatch(xhr); }
        });
        return response;
    }
}
class Binding extends Request {
    constructor(view) {
        super((xhr) => { });
        view.find('[data-binding-field]').each((i, v) => {
            var $jE = $(v);
            var field = $jE.attr('data-binding-field');
            var stageAttr = $jE.attr('data-binding-stage');
            Object.defineProperty(this, field, {
                set: (val) => {
                    if (stageAttr == null || stageAttr == 'text')
                        $jE.text(val);
                    else
                        $jE.html(val);
                }
            });
        });
        view.find('[data-binding-action]').each((i, e) => {
            var jB = $(e);
            var action = this[jB.attr('data-binding-action')];
            if (action != null)
                jB.click(x => {
                    action(this);
                });
        });
    }
    execute() {
        var fieldUrl = this.fieldUrlCollection();
        $.each(fieldUrl, (i, v) => {
            this.fieldBind(v);
        });
    }
    fieldBind(binding) {
        var promise = this.request(binding.url);
        promise.then((x) => {
            if (binding.datahandler != null)
                binding.datahandler(this, x);
            else
                this[binding.field] = x || '';
        }, (x) => {
            this[binding.field] = '';
        });
    }
}
class BindingField {
    constructor(fields) {
        if (fields)
            Object.assign(this, fields);
    }
}
class ServerLinked extends Request {
    constructor() {
        super((xhr) => {
            if (xhr != null) {
                if (xhr.status == 400) {
                    var errObj = JSON.parse(xhr.responseText);
                    if (errObj.ModelState != null)
                        $.each(errObj.ModelState[""], (i, v) => Materialize.toast(v, 4000, 'red'));
                    else
                        Materialize.toast(errObj.error_description, 4000, 'red');
                }
                if (xhr.status == 401)
                    Materialize.toast('Wrong email or password!', 4000, 'red');
            }
        });
    }
    request(url, data) {
        var request = super.request(url, data);
        request.done(() => {
            $.each(globalBindings, (i, v) => {
                v.execute();
            });
        });
        return request;
    }
}
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
class TemplateLoader extends ServerLinked {
    fromTemplate(template) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request('/templates/get/', { name: template });
        });
    }
}
var ValidationState;
(function (ValidationState) {
    ValidationState[ValidationState["Invalid"] = 0] = "Invalid";
    ValidationState[ValidationState["Valid"] = 1] = "Valid";
    ValidationState[ValidationState["NotValid"] = 2] = "NotValid";
})(ValidationState || (ValidationState = {}));
class ViewModel extends TemplateLoader {
    constructor(view) {
        super();
        view.filter('input')
            .add(view.find('input'))
            .each((i, e) => {
            var jE = $(e);
            jE.change(x => {
                var val = jE.val();
                var label = jE.next('label');
                var validator = this[jE.attr('name') + "__validator"];
                if (validator != null) {
                    if (!jE.hasClass('validate'))
                        jE.addClass('validate');
                    if (!validator.validating_function(val)) {
                        jE.removeClass('valid');
                        if (!jE.hasClass('invalid'))
                            jE.addClass('invalid');
                        label.attr('data-error', validator.error_msg);
                        this[jE.attr('name')] = ValidationState.Invalid;
                        return;
                    }
                    else {
                        jE.removeClass('invalid');
                        label.attr('data-success', validator.success_msg || '');
                    }
                }
                this[jE.attr('name')] = val;
                jE.addClass('valid');
            });
        });
        view.filter('button:not([type="submit"])')
            .add(view.find('button:not([type="submit"])'))
            .each((i, e) => {
            var jB = $(e);
            var attr = jB.attr('data-model-action');
            if (attr != null) {
                var action = this[jB.attr('data-model-action')];
                if (action != null)
                    jB.click(x => {
                        action(this);
                    });
            }
        });
        var sBtn = view.find('[type="submit"]');
        this.submitUrl = sBtn.attr('data-controller-action');
        sBtn.click(x => this.submitting());
        this.pushOnScreen(view, AttachType.Inside);
        screenViewModel = this;
    }
    set_validation(validator) {
        this[validator.field + "__validator"] = validator;
    }
    submitting() {
        return __awaiter(this, void 0, void 0, function* () {
            var validator = this.modelValidation();
            debugger;
            if (validator.validating_function(this)) {
                var response = yield this.request(this.submitUrl, this);
                debugger;
                this.submit(response);
            }
            else
                Materialize.toast(validator.error_msg, 3000, 'red');
        });
    }
}
class Validator {
    constructor(field, validation_function, error, success) {
        this.field = field;
        this.validating_function = validation_function;
        this.error_msg = error;
        this.success_msg = success == null ? 'success' : success;
    }
    validating_function(value) { return false; }
}
class Identity extends ViewModel {
    constructor(view) {
        super(view);
        this.set_validation(this.emailValidator);
    }
    get emailValidator() {
        return new Validator('Email', (email) => {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }, 'Email must following standarts!', '');
    }
    modelValidation() {
        return new Validator('Identity', x => {
            var model = x;
            return !(model.Email || '').isNullOrWhitespace()
                && !(model.Password || '').isNullOrWhitespace();
        }, 'All fields required!');
    }
    submit() { this.login(this); }
    auth($this) {
        return __awaiter(this, void 0, void 0, function* () {
            var model = $this;
            var submitValidator = model.modelValidation();
            if (!submitValidator.validating_function(model)) {
                Materialize.toast(submitValidator.error_msg, 3000, 'red');
                return;
            }
            var token = yield model.request('/token', {
                "grant_type": "password",
                "username": model.Email,
                "password": model.Password
            });
            globalAuthToken = token.access_token;
            var am = new AccountManager();
            if (yield am.isLogged()) {
                var $template = $(yield model.fromTemplate('Dashboard'));
                new Dashboard($template);
            }
            else {
                Materialize.toast('Authorization not accepted!', 6000, 'red');
                model.login(model);
            }
        });
    }
    register($this) {
        $this.fromTemplate('Registration').then(x => {
            var $template = $(x);
            new RegisterIdentity($template);
        });
    }
    login($this) {
        debugger;
        $this.fromTemplate('LogIn').then(x => {
            var $template = $(x);
            new Identity($template);
        });
    }
}
class RegisterIdentity extends Identity {
    constructor(view) {
        super(view);
        this.set_validation(this.passwordConfirmValidator);
    }
    get passwordConfirmValidator() {
        return new Validator('PasswordConfirm', (confirmedPassword) => {
            return this.Password == confirmedPassword;
        }, 'Password must be the same!', 'Passwords match!');
    }
    modelValidation() {
        return new Validator('Identity', x => {
            var model = x;
            return !(model.Name || '').isNullOrWhitespace()
                && !(model.Email || '').isNullOrWhitespace()
                && !(model.Password || '').isNullOrWhitespace()
                && !(model.PasswordConfirm || '').isNullOrWhitespace();
        }, 'All fields required!');
    }
}
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
class Transactions extends ViewModel {
    constructor(view) {
        super(view);
        globalBindings.push(new TransactionsBinding());
        this.set_validation(this.pwValidator);
        this.loadUserList(view);
    }
    loadUserList(view) {
        return __awaiter(this, void 0, void 0, function* () {
            var data = yield this.request('/api/users/availablecustomers');
            var processedData = {};
            $.each(data, (i, v) => {
                processedData[v] = null;
            });
            view.find('input.autocomplete').autocomplete({
                data: processedData,
                limit: 5
            });
        });
    }
    get pwValidator() {
        return new Validator('PW', x => x > 0, 'Amount should be a positive number!');
    }
    modelValidation() {
        return new Validator('Transaction', x => {
            var model = x;
            return !(model.Username || '').isNullOrWhitespace()
                && model.PW > 0;
        }, 'All fields required!');
    }
    backtodashboard($this) {
        return __awaiter(this, void 0, void 0, function* () {
            debugger;
            var model = $this;
            var $template = $(yield model.fromTemplate('Dashboard'));
            new Dashboard($template);
        });
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
class AccountManager extends TemplateLoader {
    isLogged() {
        return __awaiter(this, void 0, void 0, function* () {
            var serverDecision = yield this.request('/api/identity/check/');
            return serverDecision;
        });
    }
    logInForm() {
        return __awaiter(this, void 0, void 0, function* () {
            var $template = $(yield this.fromTemplate('LogIn'));
            new Identity($template);
        });
    }
    registerForm() {
        return __awaiter(this, void 0, void 0, function* () {
            var $template = $(yield this.fromTemplate('Registration'));
            new RegisterIdentity($template);
        });
    }
}
class App {
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            //var am = new AccountManager();
            globalBindings.push(new NavBinding());
            var logged = yield globalAm.isLogged();
            if (!logged)
                globalAm.logInForm();
            else
                console.log('auth');
            //console.log(logged);
        });
    }
}
var screenViewModel = null;
var preScreenViewModel = null;
var globalAuthToken = '';
var globalBindings = new Array();
var globalAm = new AccountManager();
new App()
    .start();
/// <reference path="interfaces/string.ts" />
/// <reference path="interfaces/materialize.ts" />
/// <reference path="utility/attachtype.ts" />
/// <reference path="interfaces/jquerypromise.ts" />
/// <reference path="abstract/htmlpusher.ts" />
/// <reference path="abstract/request.ts" />
/// <reference path="abstract/binding.ts" />
/// <reference path="abstract/serverlinked.ts" />
/// <reference path="abstract/templateloader.ts" />
/// <reference path="abstract/validationstate.ts" />
/// <reference path="abstract/viewmodel.ts" />
/// <reference path="utility/validator.ts" />
/// <reference path="models/identity.ts" />
/// <reference path="models/registeridentity.ts" />
/// <reference path="bindings/navbinding.ts" />
/// <reference path="models/transactions.ts" />
/// <reference path="account.ts" />
/// <reference path="app.ts" />
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
    transactionsHandler($this, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var html = $();
            //var concat_data = data.credits.concat(data.debits) as any[];
            for (let i = 0; i < data.length; i++) {
                var transaction = data[i];
                var template = yield $this.request('/templates/get/', { name: 'TransactionHistory' });
                template = template.replace('{{Operation}}', transaction.operation == 0 ? "Debit" : "Credit");
                template = template.replace('{{From/To}}', transaction.operation == 0 ? "To" : "From");
                template = template.replace('{{Person}}', transaction.UserName);
                template = template.replace('{{OperationSign}}', transaction.operation == 0 ? "-" : "+");
                template = template.replace('{{PW}}', transaction.amount);
                template = template.replace('{{When}}', transaction.when);
                template = template.replace('{{Total}}', transaction.total);
                html = html.add($(template));
            }
            debugger;
            $this["usertransactions"] = html.wrapAll($("<div>")).parent().html();
        });
    }
    trasactions($this) {
    }
}
class Dashboard extends ViewModel {
    modelValidation() {
        return new Validator('Dashboard', x => {
            return false;
        }, 'Dashboard not exists!');
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    transactions($this) {
        return __awaiter(this, void 0, void 0, function* () {
            var model = $this;
            var $template = $(yield model.fromTemplate('Transactions'));
            new Transactions($template);
        });
    }
    logout($this) {
        return __awaiter(this, void 0, void 0, function* () {
            var model = $this;
            var loggedoff = yield model.request('/api/account/logout');
            globalAuthToken = '';
            var $template = $(yield model.fromTemplate('LogIn'));
            new Identity($template);
        });
    }
}
//# sourceMappingURL=compiled.js.map