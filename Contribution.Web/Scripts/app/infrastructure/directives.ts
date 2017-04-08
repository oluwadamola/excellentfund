module Stev.Infrastructure.Directives {

    export class BinaryData {

        static FactoryName = '_Directives.BinaryData';
        static factory() {
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
                        }
                        reader.readAsDataURL(changeEvent.target.files[0]);
                    });
                }
            }
        }
    }

    var fileModel = function ($parse: angular.IParseService): angular.IDirective {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs["fileModel"]);
                element.bind('change', function () {
                    scope.$apply(function () {
                        var input = <HTMLInputElement>element[0];
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
    }
    module.directive('fileModel', fileModel);


    var fileChange = function ($parse: angular.IParseService): angular.IDirective {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs["fileChange"]);
                element.bind('change', function () {
                    scope.$eval(attrs['fileChange']);
                });
            }
        };
    }
    module.directive('fileChange', fileChange);

    var backgroundImage = function (): angular.IDirective {
        return {
            link: function (scope, element, attrs) {

                //Get the Dom Element
                var domElement = element.get(0);

                // create an observer instance
                var observer = new MutationObserver(function (mutations) {
                    mutations
                        .filter(m => m.type == "attributes")
                        .filter(m => m.attributeName == "background-image")
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
        }
    }
    module.directive('backgroundImage', backgroundImage);




}


module Stev.Infrastructure.Directive {
    class PageCtrl {

        page: PagedList<any>;

        static $inject = ["$scope"];
        constructor($scope) {
            this.page = $scope.page;
        }

        next() {
            this.page.NextPage();
            console.log("Next Clicked: " + this.page.Items().length);
        }

        prev() {
            this.page.previousPage();
        }

        goto(index: number) {
            this.page.Goto(index + 1);
        }

        isCurrentPage(item) {
            return this.page.CurrentPage() == item + 1;
        }

        links() {
            var page = this.page;
            var arr = [];
            if (page && page.Pages() > 0) {

                var curr = page.CurrentPage();
                var count = page.Pages();

                var k = 5;

                //Get Index Bounds
                var kl = curr - k;
                var kr = curr + k;

                //Handle Left Overflow
                if (kl < 0) {
                    kr = kr + (kl * -1)
                    kl = 0;
                }

                //Handle Right Overflow
                if (kr > count) {
                    kl = kl - (kr - count);
                    kr = count;
                }

                //Handle Recursive Left Overflow
                if (kl < 0) {
                    kl = 0
                }

                //Plot Range
                for (var x = kl; x < kr; x++) {
                    arr.push(x);
                }
            }

            return arr;
        }
    }

    var Directive = function (): ng.IDirective {
        return {
            restrict: "EA",
            templateUrl: "template/paging/pager.html",
            scope: {
                page: "="
            },
            controller: PageCtrl,
            controllerAs: "model"
        };
    };

    module.directive("odPager", Directive);
}