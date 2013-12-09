'use strict';

angular.module('angularjsItcUtilsApp')
  .directive('itcValidationMessages', function (ValidationMessages) {
            return {
                restrict: 'A',
                link: function (scope, element, attributes)
                {
                    // Get the form object.
                    var formName = attributes.name;
                    var form = scope[formName];

                    scope.$on("checkFieldValidity", function (evt, args)
                    {
                        findErrors(args.field, args.fieldName);
                    });

                    scope.$on("checkFormValidity", function ()
                    {
                        checkFieldsValidity()
                    });

                    angular.forEach(form, function (field, fieldName)
                    {
                        // If the field name starts with a '$' sign, it means it's an Angular property or function and we should skip those items.
                        if (fieldName[0] === '$') {
                            return;
                        }
                        var input = angular.element(element.context[fieldName]);
                        scope.$watch(function ()
                        {
                            // Watching the class attribute to capture validations errors
                            return input.attr('class');
                        }, function ()
                        {
                            scope.$emit("checkFieldValidity", {
                                field: field,
                                fieldName: fieldName
                            });
                        });
                    });

                    var checkFieldsValidity = function ()
                    {
                        if (!form.$pristine) {
                            angular.forEach(form, function (field, fieldName)
                            {
                                if (fieldName[0] === '$') {
                                    return;
                                }
                                findErrors(field, fieldName);
                            });
                        }
                    };
                    var findErrors = function (field, fieldName)
                    {
                        var error = {};
                        /* TODO Maybe there is a better way to get access to the input */
                        var input = angular.element(element.context[fieldName]);
                        var popover = getPopoverObject(input);
                        var tooltip;
                        if (field.$valid && !angular.isUndefined(popover)) {
                            hideMessage(input);
                        } else if (field.$invalid && field.$dirty) {

                            angular.forEach(field.$error, function (value, key)
                            {
                                if (value && $.isEmptyObject(error)) {
                                    error = {
                                        value: value,
                                        key: key
                                    };
                                    /*TODO How to break the loop?*/
//                            return;
                                }
                            });
                            if (angular.isUndefined(popover)) {
                                createMessage(input, error.key);
                                showMessage(input);
                            } else {
                                tooltip = popover.$tip;
//                        tooltip.hasClass('in')
                                if (!angular.isUndefined(tooltip)) {
                                    replaceMessage(popover, error.key);
                                    showMessage(input);
                                }
                            }
                        }

                    };
                    var createMessage = function (input, key)
                    {
                        input.popover({
                            placement: 'right',
                            trigger: 'manual',
                            delay: { show: 200, hide: 200 },
                            animation: true,
                            content: ValidationMessages.validationMessages[key],
                            template: '<div class="popover error"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
                        });
                    };

                    var replaceMessage = function (popover, key)
                    {
                        popover.options.content = ValidationMessages.validationMessages[key];
                    };

                    var showMessage = function (input)
                    {
                        input.popover('show');
                    };

                    var hideMessage = function (input)
                    {
                        input.popover('hide');
                    };

                    var getPopoverObject = function (input)
                    {
                        return input.data('bs.popover');
                    };

                }
            };
  });