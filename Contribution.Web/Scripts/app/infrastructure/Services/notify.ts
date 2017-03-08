module Stev.Services {
    export class NotifyService {
        constructor() {
            toastr.options['closeButton'] = true;
        }

        success(message: string, title?: string) {
            console.log(message);
            toastr.success(this.parse(message), title);
        }
        error(message: string, title?: string) {
            // console.log(message);
            console.error(message);
            toastr.error(this.parse(message), title);
        }
        info(message: string, title?: string) {
            console.info(message);
            toastr.info(this.parse(message), title);
        }
        warning(message: string, title?: string) {
            console.warn(message);
            toastr.warning(this.parse(message), title);
        }
        option(setting: string, value: any) {
            toastr.options[setting] = value;
        }

        parse(message: string) {
            if (!message || message.length <= 0) {
                return " &nbsp; ";
            }
            return message;
        }
    }

    module.service("_notify", NotifyService);
}