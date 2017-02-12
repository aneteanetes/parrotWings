abstract class ServerLinked extends HtmlPusher {
    request<T>(url: string, data?: any): JQueryPromise<T> {
        var response = $.post(url, data);
        response.then(() => { }, xhr => {
            if (xhr.status == 400)
                $.each(JSON.parse(xhr.responseText).ModelState[""], (i, v) =>
                    Materialize.toast(v, 4000, 'red'));
            if (xhr.status == 401)
                Materialize.toast('Wrong email or password!', 4000, 'red');
        });
        return response;
    }
}