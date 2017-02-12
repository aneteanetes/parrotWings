abstract class ViewModel extends TemplateLoader {

    set_validation(validator: Validator) {
        this[validator.field + "__validator"] = validator;
    }

    constructor(view: JQuery) {
        super();
        view.find('input').each((i, e) => {
            var jE = $(e);
            jE.change(x => {
                var val = jE.val();
                var label = jE.next('label');
                var validator = this[jE.attr('name') + "__validator"] as Validator;
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
                    } else {
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

        this.pushOnScreen(view,
            AttachType.Inside);

        screenViewModel = this;
    }

    private submitUrl: string;
    private async submitting() {
        var validator = this.modelValidation();
        if (validator.validating_function(this)) {
            var response = await this.request<any>(this.submitUrl, this);            
            debugger;
            this.submit(response);
        }
        else
            Materialize.toast(validator.error_msg, 3000, 'red');
    }

    abstract modelValidation(): Validator;
    abstract async submit(response: any);

}