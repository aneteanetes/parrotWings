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
        debugger;
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
class ServerLinked extends HtmlPusher {
    request(url, data) {
        var response = $.post(url, data);
        response.then(() => { }, xhr => {
            if (xhr.status == 400)
                $.each(JSON.parse(xhr.responseText).ModelState[""], (i, v) => Materialize.toast(v, 4000, 'red'));
            if (xhr.status == 401)
                Materialize.toast('Wrong email or password!', 4000, 'red');
        });
        return response;
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
        view.find('input').each((i, e) => {
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
        view.find('button:not([type="submit"])').each((i, e) => {
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
    submit(response) {
        return __awaiter(this, void 0, void 0, function* () {
            var token = yield this.request('/token', {
                "grant_type": "password",
                "username": this.Email,
                "password": this.Password
            });
            debugger;
            console.log(token);
            debugger;
            var am = new AccountManager();
            if (yield am.isLogged()) {
                var $template = $(yield this.fromTemplate('Dashboard'));
                new Dashboard($template);
            }
            else
                this.login(this);
        });
    }
    register($this) {
        $this.fromTemplate('Registration').then(x => {
            var $template = $(x);
            new RegisterIdentity($template);
        });
    }
    login($this) {
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
var globalAm = new AccountManager();
new App()
    .start();
/// <reference path="interfaces/string.ts" />
/// <reference path="interfaces/materialize.ts" />
/// <reference path="utility/attachtype.ts" />
/// <reference path="interfaces/jquerypromise.ts" />
/// <reference path="abstract/htmlpusher.ts" />
/// <reference path="abstract/serverlinked.ts" />
/// <reference path="abstract/templateloader.ts" />
/// <reference path="abstract/validationstate.ts" />
/// <reference path="abstract/viewmodel.ts" />
/// <reference path="utility/validator.ts" />
/// <reference path="models/identity.ts" />
/// <reference path="models/registeridentity.ts" />
/// <reference path="account.ts" />
/// <reference path="app.ts" />
class Dashboard extends ViewModel {
    modelValidation() {
        return new Validator('Dashboard', x => {
            return false;
        }, 'Dashboard not exists!');
    }
    submit() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
//# sourceMappingURL=compiled.js.map