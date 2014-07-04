(function ()
{
    'use strict';

    function itcDefaultMessage($timeout)
    {
        return {
            restrict: 'A',
            link: function (scope, element, attributes)
            {
                if (!attributes.name) {
                    throw new Error('Directive must be set on an element that has a "name" attribute');
                }
                // Get the input object.
                var fieldName = attributes.name;
                var field = scope[element.context.form.name][fieldName];
                var input = angular.element(element.context);
                var tooltip;

                element.bind('focus', function ()
                {
                    var popover = getPopoverObject(input);

                    function whenTooltipIsDefined()
                    {
                        if (!angular.isUndefined(tooltip)) {
                            replaceMessage(popover);
                            showMessage(input);
                        }
                    }

                    if (field.$valid || field.$pristine) {
                        if (angular.isUndefined(popover)) {
                            createMessage(input);
                            showMessage(input);
                        } else {
                            tooltip = popover.$tip;
                            whenTooltipIsDefined();
                        }
                    }
                });

                element.bind('blur', function ()
                {
                    $timeout(function ()
                    {
                        if (field.$valid || field.$pristine) {
                            hideMessage(input);
                        }
                    }, 200);
                });

                var createMessage = function (input)
                {
                    //noinspection JSUnresolvedVariable
                    input.popover({
                        placement: attributes.popoverPlacement || 'right',
                        trigger: 'manual',
                        content: attributes.itcDefaultMessage,
                        template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
                    });
                };

                var replaceMessage = function (popover)
                {
                    //noinspection JSUnresolvedVariable
                    popover.options.content = attributes.itcDefaultMessage;
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
    }

    angular.module('pl.itcrowd.directives').directive('itcDefaultMessage', ['$timeout', itcDefaultMessage]);
})();
