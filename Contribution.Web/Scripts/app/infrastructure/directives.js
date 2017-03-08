var Stev;
(function (Stev) {
    var Infrastructure;
    (function (Infrastructure) {
        var Directives;
        (function (Directives) {
            var BinaryData = (function () {
                function BinaryData() {
                }
                BinaryData.factory = function () {
                    return {
                        scope: {
                            binaryData: "="
                        },
                        link: function (scope, element, attributes) {
                            element.bind("change", function (changeEvent) {
                                var reader = new FileReader();
                                reader.onload = function (loadEvent) {
                                    scope.$apply(function () {
                                        var parts = reader.result.split(',');
                                        scope.binaryData = {
                                            //lastModified: changeEvent.target.files[0].lastModified,
                                            //lastModifiedDate: changeEvent.target.files[0].lastModifiedDate,
                                            //size: changeEvent.target.files[0].size,
                                            Mime: changeEvent.target.files[0].type,
                                            Name: changeEvent.target.files[0].name,
                                            Data: parts[1]
                                        };
                                    });
                                };
                                reader.readAsDataURL(changeEvent.target.files[0]);
                            });
                        }
                    };
                };
                BinaryData.FactoryName = '_Directives.BinaryData';
                return BinaryData;
            }());
            Directives.BinaryData = BinaryData;
            var fileModel = function ($parse) {
                return {
                    restrict: 'A',
                    link: function (scope, element, attrs) {
                        var model = $parse(attrs["fileModel"]);
                        element.bind('change', function () {
                            scope.$apply(function () {
                                var input = element[0];
                                if (attrs["multiple"]) {
                                    model.assign(scope, input.files);
                                }
                                else {
                                    model.assign(scope, input.files[0]);
                                }
                            });
                        });
                    }
                };
            };
            Infrastructure.module.directive('fileModel', fileModel);
            var fileChange = function ($parse) {
                return {
                    restrict: 'A',
                    link: function (scope, element, attrs) {
                        var model = $parse(attrs["fileChange"]);
                        element.bind('change', function () {
                            scope.$eval(attrs['fileChange']);
                        });
                    }
                };
            };
            Infrastructure.module.directive('fileChange', fileChange);
            var backgroundImage = function () {
                return {
                    link: function (scope, element, attrs) {
                        //Get the Dom Element
                        var domElement = element.get(0);
                        // create an observer instance
                        var observer = new MutationObserver(function (mutations) {
                            mutations
                                .filter(function (m) { return m.type == "attributes"; })
                                .filter(function (m) { return m.attributeName == "background-image"; })
                                .map(function (mutation) {
                                var value = element.attr("background-image");
                                if (value) {
                                    element.css({
                                        'background-image': 'url(' + value + ')',
                                        'background-size': 'cover'
                                    });
                                }
                            });
                        });
                        // configuration of the observer:
                        var config = { attributes: true };
                        // pass in the target node, as well as the observer options
                        observer.observe(domElement, config);
                    }
                };
            };
            Infrastructure.module.directive('backgroundImage', backgroundImage);
        })(Directives = Infrastructure.Directives || (Infrastructure.Directives = {}));
    })(Infrastructure = Stev.Infrastructure || (Stev.Infrastructure = {}));
})(Stev || (Stev = {}));
//# sourceMappingURL=directives.js.map