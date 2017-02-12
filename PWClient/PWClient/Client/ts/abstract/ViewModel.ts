abstract class ViewModel {
    constructor(view: JQuery) {
        view.find('input').each((i, e) => {
            var jE = $(e);
            jE.change(x => {
                debugger;
                var val = jE.val();
                var validator = this[jE.attr('name') + "__validator"] as Validator;
                if (validator != null) {
                    if (!validator.validating_function(val)) {
                        var label = jE.next('label');
                        if (!jE.hasClass('validate'))
                            jE.addClass('validate');
                        if (!jE.hasClass('invalid'))
                            jE.addClass('invalid');
                        if (label.attr('data-error') == null)
                            label.attr('data-error', validator.error_msg);
                    } else {
                        jE.removeClass('invalid');
                        this[jE.attr('name')] = val;
                    }
                } else
                    this[jE.attr('name')] = val;
            });
        });
    }
}