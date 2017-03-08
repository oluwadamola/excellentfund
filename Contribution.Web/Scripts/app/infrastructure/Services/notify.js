var Stev;
(function (Stev) {
    var Services;
    (function (Services) {
        var NotifyService = (function () {
            function NotifyService() {
                toastr.options['closeButton'] = true;
            }
            NotifyService.prototype.success = function (message, title) {
                console.log(message);
                toastr.success(this.parse(message), title);
            };
            NotifyService.prototype.error = function (message, title) {
                // console.log(message);
                console.error(message);
                toastr.error(this.parse(message), title);
            };
            NotifyService.prototype.info = function (message, title) {
                console.info(message);
                toastr.info(this.parse(message), title);
            };
            NotifyService.prototype.warning = function (message, title) {
                console.warn(message);
                toastr.warning(this.parse(message), title);
            };
            NotifyService.prototype.option = function (setting, value) {
                toastr.options[setting] = value;
            };
            NotifyService.prototype.parse = function (message) {
                if (!message || message.length <= 0) {
                    return " &nbsp; ";
                }
                return message;
            };
            return NotifyService;
        }());
        Services.NotifyService = NotifyService;
        Services.module.service("_notify", NotifyService);
    })(Services = Stev.Services || (Stev.Services = {}));
})(Stev || (Stev = {}));
//# sourceMappingURL=notify.js.map