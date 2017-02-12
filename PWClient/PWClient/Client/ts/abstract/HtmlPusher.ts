abstract class HtmlPusher {
    pushOnScreen(html: JQuery, attach: AttachType) {
        var target = $('.screen');
        debugger;
        switch (attach) {
            case AttachType.After: target.after(html); break;
            case AttachType.Before: target.before(html); break;
            case AttachType.Append: target.append(html); break;
            case AttachType.Prepend: target.prepend(html); break;
            case AttachType.Inside: target.html(''); target.append(html); break;
            case AttachType.Replace: target.replaceWith(html); break;
            default: break;
        }
    }
}