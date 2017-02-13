abstract class Request extends HtmlPusher {
    errorCatch: (xhr: JQueryXHR) => void;
    constructor(error: (xhr: JQueryXHR) => void) {
        super();
        this.errorCatch = error;
    }

    public request<T>(url: string, data?: any): JQueryPromise<T> {        
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