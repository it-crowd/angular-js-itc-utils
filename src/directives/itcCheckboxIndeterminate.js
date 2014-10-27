(function ()
{
    'use strict';

    function itcCheckboxIndeterminate()
    {
        var indeterminateClass = 'indeterminate';
        var inactiveClass = 'inactive';
        return {
            require: ['itcCheckboxIndeterminate', 'ngModel'],
            controller: 'ButtonsController',
            link: function (scope, element, attrs, ctrls)
            {
                var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

                function getTrueValue()
                {
                    return getCheckboxValue(attrs.btnCheckboxTrue, true);
                }

                function getFalseValue()
                {
                    return getCheckboxValue(attrs.btnCheckboxFalse, false);
                }

                function getIndeterminateValue()
                {
                    return getCheckboxValue(attrs.itcCheckboxIndeterminate, undefined);
                }

                function getCheckboxValue(attributeValue, defaultValue)
                {
                    var val = scope.$eval(attributeValue);
                    return angular.isDefined(val) ? val : defaultValue;
                }

                //model -> UI
                ngModelCtrl.$render = function ()
                {
                    if (angular.equals(ngModelCtrl.$modelValue, getTrueValue())) {
                        element.addClass(buttonsCtrl.activeClass);
                        element.removeClass(inactiveClass);
                        element.removeClass(indeterminateClass);
                    } else if (angular.equals(ngModelCtrl.$modelValue, getFalseValue())) {
                        element.removeClass(buttonsCtrl.activeClass);
                        element.addClass(inactiveClass);
                        element.removeClass(indeterminateClass);
                    } else {
                        element.removeClass(buttonsCtrl.activeClass);
                        element.removeClass(inactiveClass);
                        element.addClass(indeterminateClass);
                    }
                    element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, getTrueValue()));
                };

                //ui->model
                element.bind(buttonsCtrl.toggleEvent, function ()
                {
                    scope.$apply(function ()
                    {
                        var value;
                        if (element.hasClass(buttonsCtrl.activeClass)) {
                            value = getFalseValue();
                        } else if (!element.hasClass(indeterminateClass)) {
                            value = getIndeterminateValue();
                        } else {
                            value = getTrueValue();
                        }
                        ngModelCtrl.$setViewValue(value);
                        ngModelCtrl.$render();
                    });
                });
            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcCheckboxIndeterminate', itcCheckboxIndeterminate);
})();
