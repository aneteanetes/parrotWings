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
                target.html(html.wrapAll($('<div>')).parent().html());
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
        return $.post(url, data);
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
class ViewModel {
    constructor(view) {
        view.find('input').each((i, e) => {
            var jE = $(e);
            jE.change(x => {
                debugger;
                var val = jE.val();
                var validator = this[jE.attr('name') + "__validator"];
                if (validator != null) {
                    if (!validator.validating_function(val)) {
                        var label = jE.next('label');
                        if (!jE.hasClass('validate'))
                            jE.addClass('validate');
                        if (!jE.hasClass('invalid'))
                            jE.addClass('invalid');
                        if (label.attr('data-error') == null)
                            label.attr('data-error', validator.error_msg);
                    }
                    else {
                        jE.removeClass('invalid');
                        this[jE.attr('name')] = val;
                    }
                }
                else
                    this[jE.attr('name')] = val;
            });
        });
    }
}
class Validator {
    constructor(validation_function, error, success) {
        this.validating_function = validation_function;
        this.error_msg = error;
        this.success_msg = success == null ? 'success' : success;
    }
    validating_function(value) { return false; }
}
class ValidatedViewModel extends ViewModel {
    create_validation(field, validator) {
        this[field + "__validator"] = validator;
    }
}
class Identity extends ValidatedViewModel {
    constructor(view) {
        super(view);
        this.create_validation('Email', this.emailValidator);
        this.create_validation('PasswordConfirm', this.passwordConfirmValidator);
    }
    get emailValidator() {
        return new Validator((email) => {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }, 'Email must following standarts!');
    }
    get passwordConfirmValidator() {
        return new Validator((confirmedPassword) => {
            debugger;
            return this.Password == confirmedPassword;
        }, 'Password must be the same!');
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
            var $view = $(yield this.fromTemplate('LogIn'));
            this.viewmodel = new Identity($view);
            this.pushOnScreen($view, AttachType.Append);
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
            //console.log(logged);
        });
    }
}
var globalAm = new AccountManager();
new App()
    .start();
/// <reference path="utility/attachtype.ts" />
/// <reference path="interfaces/jquerypromise.ts" />
/// <reference path="abstract/htmlpusher.ts" />
/// <reference path="abstract/serverlinked.ts" />
/// <reference path="abstract/templateloader.ts" />
/// <reference path="abstract/viewmodel.ts" />
/// <reference path="utility/validator.ts" />
/// <reference path="abstract/validatedviewmodel.ts" />
/// <reference path="models/identity.ts" />
/// <reference path="account.ts" />
/// <reference path="app.ts" />
//# sourceMappingURL=compiled.js.map