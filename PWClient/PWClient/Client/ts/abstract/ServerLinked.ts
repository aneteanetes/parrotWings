abstract class ServerLinked extends HtmlPusher {
    request<T>(url: string, data?: any): JQueryPromise<T> {
        return $.post(url, data);
    }
}