angular.module('pl.itcrowd.constants', []);

(function ()
{
    'use strict';

    angular.module('pl.itcrowd.constants').constant('Patterns', {
        latinText: /^[\u0041-~\u0080-þĀ-ž ]+$/ //for text inputs when we want latin letters, such as City
    });
})();
(function ()
{
    'use strict';

    angular.module('pl.itcrowd.constants').constant('ValidationMessages', {
        validationMessages: {
            en: {
                required: 'Value is required!',
                email: 'Please enter a valid email address!',
                minlength: 'Enter more characters!',
                maxlength: 'You have entered to many characters!',
                equals: 'Password doesn\'t match!',
                lessthan: 'Value must be less than other!',
                float: 'Value must be a decimal number',
                unique: 'Your email should be unique!',
                pattern: 'Characters don\'t match to the pattern!',
                'unique-user-email': 'This email is already registered!',
                'unique-product-permalink': 'This permalink already exists!',
                'unique-shop-permalink': 'This permalink already exists!'
            },
            pl: {
                required: 'Wartość wymagana!',
                email: 'Wprowadź poprawny adres email!',
                minlength: 'Za mało znaków!',
                maxlength: 'Za dużo znaków!',
                equals: 'Hasło nie pasuje!',
                float: 'Wartość musi być liczbą',
                unique: 'Email musi być unikalny. To będzie twój login!',
                pattern: 'Podane znaki nie są dopuszczalne!',
                'unique-user-email': 'Ten adres jest już zarejestrowany',
                'unique-product-permalink': 'Taki permalink już istnieje!',
                'unique-shop-permalink': 'Taki permalink już istnieje!'
            }
        }
    });
})();

angular.module('pl.itcrowd.directives', ['pl.itcrowd.constants']);

(function ()
{
    'use strict';

    function itcAlert()
    {
        return {
            restrict: 'A',
            link: function (scope)
            {
                scope.$on('Alert', function (e, data)
                {
                    window.alert(data);
                });
            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcAlert', itcAlert);
})();

(function ()
{
    'use strict';

    function itcConfirmation()
    {
        return {
            priority: 100,
            restrict: 'A',
            link: {
                pre: function (scope, element, attrs)
                {
                    element.bind('click touchstart', function (e)
                    {
                        //noinspection JSUnresolvedVariable
                        var message = attrs.itcConfirmation || 'Are you sure?';
                        if (message && !window.confirm(message)) {
                            e.stopImmediatePropagation();
                            e.preventDefault();
                        }
                    });
                }
            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcConfirmation', itcConfirmation);
})();

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

(function ()
{
    'use strict';

    function itcDraggable()
    {
        return {
            restrict: 'C',
            transclude: false,
            scope: false,
            link: function (scope, elm)
            {
                elm.draggable({
                    revert: true
                });
                scope.$on('$destroy', function ()
                {
                    try {
                        elm.draggable('destroy');
                    } catch (e) {
                    }
                });
            },
            replace: false
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcDraggable', itcDraggable);
})();

(function ()
{
    'use strict';

    function itcDroppable()
    {
        return {
            restrict: 'C',
            transclude: false,
            scope: false,
            link: function (scope, elm)
            {
                elm.droppable({
                    drop: function (event, ui)
                    {
                        var draggable = angular.element(ui.draggable).scope();
                        if (scope.onBeforeDrop(draggable) !== false) {
                            scope.onDrop(draggable);
                        }
                    }
                });
                scope.$on('$destroy', function ()
                {
                    try {
                        elm.droppable('destroy');
                    } catch (e) {
                    }
                });
            },
            replace: false
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcDroppable', itcDroppable);
})();

(function ()
{
    'use strict';

    function itcFacebookSlidein($window)
    {
        return {
            restrict: 'E',
            transclude: false,
            scope: {
                left: '@',
                href: '@',
                width: '@',
                height: '@',
                showFaces: '@',
                stream: '@',
                header: '@'
            },
            template: '<div><div class="fb-slidein-inner"><div id="fb-root"></div><div class="fb-like-box"></div></div></div>',
            link: function (scope, element)
            {
                var left = (/^true$/i).test(scope.left);
                element.addClass(left ? 'fb-slidein-left' : 'fb-slidein-right');
                element.find('.fb-like-box').attr('data-show-faces', scope.showFaces).attr('data-stream', scope.stream).attr('data-header',
                        scope.header).attr('data-width', scope.width).attr('data-height', scope.height).attr('data-href', scope.href);
                var hide = function ()
                {
                    var value = '-' + (parseInt(scope.width, 10) + 15) + 'px';
                    var properties = left ? {left: value} : {right: value};
                    element.stop().animate(properties, 400);
                };
                element.css('right', '-' + (parseInt(scope.width, 10) + 15) + 'px').hover(function ()
                {
                    var properties = left ? {left: '-15px'} : {right: '-15px'};
                    element.stop().animate(properties, 400);
                }, hide);
                hide();
                (function (d, s, id)
                {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) {
                        return;
                    }
                    js = d.createElement(s);
                    js.id = id;
                    js.src = '//connect.facebook.net/pl_PL/all.js#xfbml=1';
                    fjs.parentNode.insertBefore(js, fjs);
                }($window.document, 'script', 'facebook-jssdk'));
            },
            replace: true
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcFacebookSlidein', ['$window', itcFacebookSlidein]);
})();

(function ()
{
    'use strict';

    function itcGoogleTagManager($location, $rootScope, $window)
    {
        /**
         * Please read README.txt.
         * Google Tag Manager needs configuration before using this directive.
         */

        return {
            restrict: 'E',
            transclude: false,
            replace: false,
            scope: {
                gtmId: '@'
            },
            link: function ($scope)
            {
                if (angular.isUndefinedOrNull($scope.gtmId)) {
                    throw new Error('Google Tag Manager ID missing');
                }

                //load tag manager
                (function (w, d, s, l, i)
                {
                    /*jshint eqeqeq:false*/
                    w[l] = w[l] || [];
                    w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
                    var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
                    j.async = true;
                    j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;
                    f.parentNode.insertBefore(j, f);
                })(window, document, 'script', 'dataLayer', $scope.gtmId);


                //trigger event when order has been placed
                $rootScope.$on('GoogleAnalytics:ecommerce', function (event, transaction)
                {
                    var analyticsEvent = {
                        'event': 'ecommerce',
                        'transactionId': transaction.id,
                        'transactionAffiliation': transaction.affiliation,
                        'transactionTotal': transaction.revenue,
                        'transactionTax': transaction.tax,
                        'transactionShipping': transaction.shipping,
                        'transactionProducts': []
                    };
                    angular.forEach(transaction.items, function (item)
                    {
                        analyticsEvent.transactionProducts.push({
                            'sku': item.sku,
                            'name': item.name,
                            'category': item.category,
                            'price': item.price,
                            'quantity': item.quantity
                        });
                    });
                    //noinspection JSUnresolvedVariable
                    $window.dataLayer.push(analyticsEvent);
                });
                $rootScope.$on('GoogleAnalytics:event', function (event, category, action, label, value)
                {
                    //noinspection JSUnresolvedVariable
                    $window.dataLayer.push({event: 'event', category: category, action: action, label: label, value: value});
                });
                $rootScope.$on('GoogleAnalytics:pageview', function (event, location, page, title)
                {
                    //noinspection JSUnresolvedVariable
                    $window.dataLayer.push({event: 'pageview', location: location, page: page, title: title});
                });

                //send page view when url has been changed
                $rootScope.$on('$routeChangeSuccess', function ()
                {
                    var path = $location.path();
                    //noinspection JSUnresolvedVariable
                    $window.dataLayer.push({event: 'pageview', location: path});
                });
            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcGoogleTagManager', ['$location', '$rootScope', '$window', itcGoogleTagManager]);
})();

(function ()
{
    'use strict';

    function itcHeadTitle()
    {
        return {
            restrict: 'E',
            scope: {
                value: '@'
            },
            link: function (scope)
            {
                scope.$watch('value', function ()
                {
                    var title = jQuery('head title');
                    if (0 === title.size()) {
                        title = jQuery('<title></title>');
                        jQuery('head').append(title);
                    }
                    title.html(scope.value);
                });
            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcHeadTitle', itcHeadTitle);
})();

/*global jQuery*/
(function ()
{
    'use strict';

    function itcInfiniteScroll($window, timeout)
    {
        return{
            link: function (scope, element, attr)
            {
                var lengthThreshold = attr.scrollThreshold || 550, timeThreshold = attr.timeThreshold ||
                        100, handler = scope.$eval(attr.itcInfiniteScroll), promise = null, lastRemaining = 9999;

                lengthThreshold = parseInt(lengthThreshold, 10);
                timeThreshold = parseInt(timeThreshold, 10);

                if (!handler || !angular.isFunction(handler)) {
                    handler = angular.noop;
                }

                jQuery($window).bind('scroll', function ()
                {
                    var remaining = (element[0].clientHeight - jQuery($window).scrollTop());
                    //if we have reached the threshold and we scroll down
                    if (remaining < lengthThreshold && (remaining - lastRemaining) < 0) {

                        //if there is already a timer running which has no expired yet we have to cancel it and restart the timer
                        if (promise !== null) {
                            timeout.cancel(promise);
                        }
                        promise = timeout(function ()
                        {
                            var waitingElement = jQuery('.waiting-for-load');
                            if (waitingElement.length === 0) {
                                jQuery(element[0]).after('<div class="waiting-for-load"></div>');
                            }
                            handler();
                            promise = null;
                        }, timeThreshold);
                    }
                    lastRemaining = remaining;
                });
                scope.$on('productLoading', function ()
                {
                    jQuery('.waiting-for-load').remove();
                });
            }

        };
    }

    angular.module('pl.itcrowd.directives').directive('itcInfiniteScroll', ['$window', '$timeout', itcInfiniteScroll]);

})();

(function ()
{
    'use strict';

    function itcKeepInView()
    {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs)
            {
                var $window = jQuery(window);
                var container = element.parents('.ui-layout-pane');

                function reattach()
                {
                    if (element.filter(':visible').size() < 1) {
                        return;
                    }
                    var container = element.parents('.ui-layout-pane');
                    //noinspection JSUnresolvedVariable
                    var parent = element.parents(attrs.ngKeepInView);
                    if (parent.size() === 0) {
                        return;
                    }
                    element.children().css({width: '100%'});
                    var elementOuterHeight = element.outerHeight();
                    if (parent.offset().top + parent.innerHeight() + container.scrollTop() <= container.height()) {
                        element.css({
                            position: 'static',
                            width: '100%'
                        });
                        parent.css({paddingBottom: 0});
                    } else {
                        var bottom = $window.innerHeight() - (container.innerHeight() + container.offset().top);
                        element.css({
                            position: 'fixed',
                            bottom: bottom,
                            width: parent.innerWidth()
                        });
                        parent.css({paddingBottom: elementOuterHeight + 'px'});
                    }
                }

                element.resize(reattach);
                $window.resize(reattach);
                container.resize(reattach);
                scope.$watch(attrs.ngModel, function ()
                {
                    reattach();
                });
                scope.$on('$destroy', function ()
                {
                    element.unbind('resize', reattach);
                    $window.unbind('resize', reattach);
                    container.unbind('resize', reattach);
                });
            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcKeepInView', itcKeepInView);
})();

(function ()
{
    'use strict';

    function itcKeyTip()
    {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs)
            {
                function doKeyTip(value)
                {
                    if (value) {
                        jQuery(element).keyTips();
                    }
                }

                //noinspection JSUnresolvedVariable
                var watchExpressions = attrs.itcKeyTip.split(',');
                for (var i = 0; i < watchExpressions.length; i++) {
                    var expression = watchExpressions[i];

                    scope.$watch(expression, doKeyTip);
                }
            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcKeyTip', itcKeyTip);
})();

/*global Ladda*/
(function ()
{
    'use strict';

    function itcLaddaButtons(laddaConfig)
    {
        return {
            restrict: 'A',
            link: function postLink($scope, element, attrs)
            {
                attrs.style = attrs.style || laddaConfig.style;
                element.attr('data-style', attrs.style);
                if (!element.hasClass('ladda-button')) {
                    element.addClass('ladda-button');
                }
                if (!element[0].querySelector('.ladda-label')) {
                    var label = angular.element('<span class="ladda-label"></span>');
                    angular.forEach(element.contents(), function (item)
                    {
                        label.append(item);
                    });
                    element.append(label);
                }
                var ladda = Ladda.create(element[0]);
                $scope.$watch(attrs.ladda, function (newVal)
                {
                    if (null == newVal) {
                        return;
                    }
                    var progress = parseInt(newVal, 10);
                    if (progress) {
                        if (!ladda.isLoading()) {
                            ladda.start();
                        }
                        ladda.setProgress(progress / 100);
                    } else {
                        if (newVal) {
                            ladda.start();
                        } else {
                            ladda.stop();
                        }
                    }
                });
            }
        };
    }

    var module = angular.module('pl.itcrowd.directives');

    module.directive('itcLaddaButtons', ['laddaConfig', '$timeout', itcLaddaButtons]);
    module.constant('laddaConfig', {
        'style': 'slide-left'
    });

})();



/**
 * Directive has the following options:
 * - It can show all messages or only those of specific type. To display all messages use itc-messages attribute with no parameters.
 *   To display messages of certain type use itc-messages="[type]" ex. itc-messages="error". Note that you can have several itc-messages tags on page,
 *   each displaying different type of messages.
 * - Message bubbles can stay until they are closed by the user (default option) or fade out after given time. For the latter use attribute
 *   stay-time="[time in millis]" .
 */
(function ()
{
    'use strict';

    function itcMessages($compile, $timeout, MessageFactory)
    {
        return {
            scope: {
                stayTime: '@'
            },
            template: '<div id="messages" ng-repeat="message in messages"></div>',
            link: function ($scope, element, attr)
            {
                function show(message, type)
                {
                    var messageTemplate = '<div class="alert"><button type="button" class="close" data-dismiss="alert">&times;</button>' + message + '</div>';
                    var messageElement = $compile(messageTemplate)($scope);
                    messageElement.addClass('alert-' + (type === 'error' ? 'danger' : (type === 'warn' ? 'warning' : type)));
                    element.append(messageElement);
                    if ($scope.stayTime) {
                        $timeout(function ()
                        {
                            messageElement.fadeOut(400, function ()
                            {
                                messageElement.remove();
                            });
                        }, $scope.stayTime);
                    }
                }

                $scope.$on('$destroy', function ()
                {
                    MessageFactory.clean();
                });

                MessageFactory.subscribe(show, attr.itcMessages);
            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcMessages', ['$compile', '$timeout', 'MessageFactory', itcMessages]);
})();

(function ()
{
    'use strict';

    function itcMetadata()
    {
        return {
            restrict: 'E',
            scope: {
                name: '@',
                content: '@'
            },
            link: function (scope)
            {
                scope.$watch('content', function ()
                {
                    var meta = jQuery('meta[name=' + scope.name + ']');
                    if (0 === meta.size()) {
                        meta = jQuery('<meta name="' + scope.name + '">');
                        jQuery('head').append(meta);
                    }
                    meta.attr('content', scope.content);
                });

            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcMetadata', itcMetadata);
})();

(function ()
{
    'use strict';

    function itcScrollTo()
    {
        return {
            restrict: 'A',
            compile: function ()
            {
                return function (scope, element)
                {
                    element.find('a').smoothScroll({offset: -100});
                    angular.forEach(element.find('a'), function (field)
                    {
                        jQuery(field).click(function (event)
                        {
                            event.preventDefault();
                        });
                    });
                };
            }
        }
    }

    angular.module('pl.itcrowd.directives').directive('itcScrollTo', itcScrollTo);
})();


(function ()
{
    'use strict';

    function itcShowdown($showdown)
    {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, iElement, attrs)
            {
                //noinspection JSUnresolvedVariable
                var content = attrs.itcShowdown;
                if (null == content || content.length < 1) {
                    content = iElement.html();
                    iElement.html($showdown.makeHtml(content));
                } else {
                    scope.$watch(content, function (newValue)
                    {
                        if (null != newValue) {
                            iElement.html($showdown.makeHtml(newValue));
                        } else {
                            iElement.html('');
                        }
                    }, true);
                }
            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcShowdown', ['$showdown', itcShowdown]);
})();

(function ()
{
    'use strict';

    function itcSmartFloat()
    {
        var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl)
            {
                ctrl.$parsers.unshift(function (viewValue)
                {
                    if (FLOAT_REGEXP.test(viewValue)) {
                        ctrl.$setValidity('float', true);
                        if (typeof viewValue === 'number') {
                            return viewValue;
                        } else {
                            return parseFloat(viewValue.replace(',', '.'));
                        }
                    } else {
                        ctrl.$setValidity('float', false);
                        return undefined;
                    }
                });
            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcSmartFloat', itcSmartFloat);
})();

/*global Spinner*/
(function ()
{
    'use strict';

    function itcSpinner()
    {
        return {
            restrict: 'A',
            link: function (scope, element, attrs)
            {
                var spinner;
                var start = function ()
                {
                    var height = element.height(), opts = {
                        length: Math.round(height / 8),
                        radius: Math.round(height / 5),
                        width: Math.round(height / 10),
                        color: element.css('color'),
                        className: 'spinner'
                    };
                    attrs.$set('disabled', true);
                    spinner = new Spinner(opts).spin(element[0]);
                };

                scope.$watch(attrs.itcSpinner, function (newVal)
                {
                    if (newVal) {
                        start();
                    } else if (spinner) {
                        attrs.$set('disabled', false);
                        spinner.stop();
                    }
                });
            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcSpinner', ['$timeout', itcSpinner]);
})();

(function ()
{
    'use strict';

    function itcStopEventPropagation()
    {
        return {
            restrict: 'A',
            link: function (scope, element, attr)
            {
                element.bind(attr.itcStopEventPropagation, function (e)
                {
                    e.stopPropagation();
                });
            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcStopEventPropagation', itcStopEventPropagation);
})();

(function ()
{
    'use strict';

    function itcSubmit()
    {
        return {
            restrict: 'A',
            link: function (scope, element, attributes)
            {
                var PRISTINE_CLASS = 'ng-pristine', DIRTY_CLASS = 'ng-dirty';

                if (!attributes.name) {
                    throw new Error('Directive must be set on an element that has a "name" attribute');
                }

                // Add novalidate to the form element if not exist.
                if (angular.isUndefined(attributes.novalidate)) {
                    attributes.$set('novalidate', '');
                }

                element.bind('submit', function (e)
                {
                    e.preventDefault();

                    // Remove the class pristine from all form elements and add the dirty class
                    element.find('.ng-pristine').removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS);

                    // Get the form object.
                    var formName = attributes.name;
                    var form = scope[formName];
                    form.$setDirty(true);
                    // Set all the fields to dirty and apply the changes on the scope so that
                    // validation errors are shown on submit only.
                    angular.forEach(form, function (field, fieldName)
                    {
                        // If the field name starts with a '$' sign, it means it's an Angular object so we should skip those items
                        if (fieldName[0] === '$') {
                            return;
                        }
                        field.$dirty = true;
                        field.$pristine = false;
                    });

                    // Do not continue if the form is invalid.
                    if (form.$invalid) {
                        scope.$apply();
                        if (angular.isUndefined(attributes.itcSubmitWithoutFocus)) {
                            // Focus on the first field that is invalid
                            element.find('.ng-invalid').first().focus();
                        }
                        scope.$emit('formValidationErrors', formName);

                    } else {
                        form.$setPristine();
                        scope.$apply(attributes.itcSubmit);
                    }

                });
            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcSubmit', itcSubmit);
})();

(function ()
{
    'use strict';

    function itcSuggest($timeout)
    {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, iElement, iAttrs)
            {
                iElement.autocomplete({
                    source: scope[iAttrs.itcSuggest],
                    select: function (event, ui)
                    {
                        $timeout(function ()
                        {
                            iElement.val('');
                            var suggestSelect = scope[iAttrs.suggestSelect];
                            if (suggestSelect instanceof Function) {
                                suggestSelect(ui.item);
                            } else if (null != iAttrs.suggestSelect) {
                                throw new Error('Method ' + iAttrs.suggestSelect + ' not found in scope');
                            }
                        }, 0);
                        return false;
                    }
                });
            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcSuggest', ['$timeout', itcSuggest]);
})();

(function ()
{
    'use strict';

    function itcEquals()
    {
        return {
            restrict: 'A',
            require: '^ngModel',
            link: function (scope, elem, attrs, ctrl)
            {
                var validate = function ()
                {
                    //get the model value of the first input
                    //noinspection JSUnresolvedVariable
                    var val1 = scope.$eval(attrs.itcEquals);

                    //get the model value of the second input
                    var val2 = scope.$eval(attrs.ngModel);

                    return val1 === val2;
                };
                scope.$watch(validate, function (validity)
                {
                    ctrl.$setValidity('equals', validity);
                });
            }
        };
    }

    function itcLessThan()
    {
        return {
            restrict: 'A',
            require: '^ngModel',
            link: function (scope, elem, attrs, ctrl)
            {
                var validate = function ()
                {

                    //get the model value of the first input
                    var val1 = scope.$eval(attrs.itcLessThan);

                    //get the model value of the second input
                    var val2 = scope.$eval(attrs.ngModel);

                    return val2 < val1;
                };
                scope.$watch(validate, function (validity)
                {
                    ctrl.$setValidity('lessthan', validity);
                });
            }
        };
    }

    var module = angular.module('pl.itcrowd.directives');

    module.directive('itcEquals', itcEquals);
    module.directive('itcLessThan', itcLessThan);
})();

(function ()
{
    'use strict';

    function itcValidationMessages(ValidationMessages)
    {
        return {
            restrict: 'A',
            link: function (scope, element, attributes)
            {
                var DEFAULT_LANGUAGE = 'en';

                if (!attributes.name) {
                    throw new Error('Directive must be set on an element that has a "name" attribute');
                }

                var event = attributes.itcValidationMessagesEvent;

                var type = attributes.itcValidationMessagesType;

                // Get the form object.
                var formName = attributes.name;
                var form = scope[formName];

                scope.$on('fieldValidationError', function (evt, args)
                {
                    if (formName === args.formName) {
                        findErrors(args.field, args.fieldName);
                    }
                });

//                    On this event all fields in the form will be check
                scope.$on('formValidationErrors', function (evt, data)
                {
                    if (formName === data) {
                        checkFieldsValidity();
                    }
                });

                angular.forEach(form, function (field, fieldName)
                {
                    // If the field name starts with a '$' sign, it means it's an Angular property or function and we should skip those items.
                    if (fieldName[0] === '$') {
                        return;
                    }
                    var input = angular.element(element.context[fieldName]);
                    if (angular.isUndefined(event)) {
                        input.bind('blur', function ()
                        {
                            findErrors(field, fieldName);
                        });
                    } else {
                        scope.$watch(function ()
                        {
                            // Watching the class attribute to capture validations errors
                            return input.attr('class');
                        }, function ()
                        {
                            scope.$emit('fieldValidationError', {
                                formName: formName,
                                field: field,
                                fieldName: fieldName
                            });
                        });
                    }
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
                    var input = angular.element(element.context[fieldName]);
                    var popover = getPopover(input);
                    var tooltip;

                    function whenTypeUndefinedInvalidAndDirty()
                    {
                        var error = getFirstError(field);
                        if (angular.isUndefined(popover)) {
                            createPopover(input, error.key);
                            showPopover(input);
                        } else {
                            tooltip = popover.$tip;
                            if (!angular.isUndefined(tooltip)) {
                                replacePopoverMessage(popover, getMessageContent(input, error.key));
                                tooltip.addClass('error');
                                showPopover(input);
                            }
                        }
                    }

                    function whenTypeDefinedInvalidAndDirty()
                    {
                        var error = getFirstError(field);
                        if (block.length === 0) {
                            createBlock(input, error.key);
                        } else {
                            replaceBlockMessage(block, getMessageContent(input, error.key));
                            showBlock(block);
                        }
                    }

                    if (angular.isUndefined(type)) {
                        if (field.$valid && !angular.isUndefined(popover)) {
                            hidePopover(input);
                            tooltip = popover.$tip;
                            tooltip.removeClass('error');
                        } else if (field.$invalid && field.$dirty) {
                            whenTypeUndefinedInvalidAndDirty();
                        }
                    } else {
                        var block;
                        if (type !== 'block') {
                            block = $(type + '-' + fieldName);
                        } else {
                            block = getBlock(input);
                        }
                        if (field.$valid && block.length !== 0) {
                            hideBlock(block);
                        } else if (field.$invalid && field.$dirty) {
                            whenTypeDefinedInvalidAndDirty();
                        }
                    }

                };

                var getFirstError = function (field)
                {
                    var error = {};
                    angular.forEach(field.$error, function (value, key)
                    {
                        if (value && $.isEmptyObject(error)) {
                            error = {
                                value: value,
                                key: key
                            };
                        }
                    });
                    return error;
                };

                var createPopover = function (input, key)
                {
                    input.popover({
                        placement: input.attr('popover-placement') || attributes.popoverPlacement || 'right',
                        trigger: 'manual',
                        content: getMessageContent(input, key),
                        template: '<div class="popover error"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
                    });
                };

                var replacePopoverMessage = function (popover, newMessage)
                {
                    popover.options.content = newMessage;
                };

                var showPopover = function (input)
                {
                    if (input.is(':visible')) {
                        input.popover('show');
                    }
                };

                var hidePopover = function (input)
                {
                    input.popover('hide');
                };

                var getPopover = function (input)
                {
                    return input.data('bs.popover');
                };

                var getMessageContent = function (input, key)
                {
                    var customMessage = input.attr(key + '-message');
                    if (angular.isUndefined(customMessage)) {
                        var selectedLanguage = scope.selectedLanguage;
                        if (!angular.isUndefined(selectedLanguage)) {
                            return ValidationMessages.validationMessages[selectedLanguage][key];
                        } else {
                            return ValidationMessages.validationMessages[DEFAULT_LANGUAGE][key];
                        }
                    } else {
                        return customMessage;
                    }
                };

                var createBlock = function (input, key)
                {
                    input.after('<div class="alert alert-danger alert-' + input.attr('name') + '">' + getMessageContent(input, key) + '</div>');
                };

                var replaceBlockMessage = function (block, newMessage)
                {
                    block.html(newMessage);
                };

                var showBlock = function (block)
                {
                    block.show();
                };

                var hideBlock = function (block)
                {
                    block.hide();
                };

                var getBlock = function (input)
                {
                    return input.parent().find('.alert-' + input.attr('name'));
                };

            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcValidationMessages', ['ValidationMessages', itcValidationMessages]);
})();

/**
 * This directive will find itself inside HTML as a class,
 * and will remove class after translation event, so CSS will remove loading image and will show app content AFTER translations are prepared.
 * Docs for $translate events: http://pascalprecht.github.io/angular-translate/docs/en/#/guide/16_events
 */
(function ()
{
    'use strict';

    function itcWaitingForAngular()
    {
        return {
            restrict: 'C',
            link: function (scope, elem)
            {
                var unbindWatch = scope.$on('$translateChangeEnd', function ()
                {
                    elem.removeClass('itc-waiting-for-angular');
                    unbindWatch(); //it should run only once
                });
            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcWaitingForAngular', itcWaitingForAngular);
})();

(function ()
{
    'use strict';

    function itcYoutubeSlidein()
    {
        return {
            restrict: 'E',
            transclude: false,
            scope: {
                event: '@',
                logo: '@',
                href: '@',
                title: '@',
                seeMore: '@',
                left: '@',
                width: '@'
            },
            template: '<div><div class="youtube-slidein-inner">' + '<a href="{{ href }}" title="{{ title }}" target="_blank">' +
                    '<img src="{{ logo }}" width="39" height="39"/>' + '<h4>{{ title }}</h4>' + '<p>{{ seeMore }} &raquo;</p>' + '</a>' + '</div></div>',
            link: function (scope, element)
            {
                var left = (/^true$/i).test(scope.left);
                element.addClass(left ? 'youtube-slidein-left' : 'youtube-slidein-right');
                element.append(angular.element('<span class="anchor"><span class="icon"></span></span>'));
                var magicNumber = 43, nextState;
                var hide = function ()
                {
                    var value = '-' + (parseInt(scope.width, 10) + magicNumber) + 'px';
                    var properties = left ? {left: value} : {right: value};
                    element.stop().animate(properties, 400);
                    nextState = show;
                };
                var show = function ()
                {
                    var value = '-' + magicNumber + 'px';
                    var properties = left ? {left: value} : {right: value};
                    element.stop().animate(properties, 400);
                    nextState = hide;
                };
                element.css(left ? 'left' : 'right', '-' + (parseInt(scope.width, 10) + magicNumber) + 'px');
                function toggle()
                {
                    nextState();
                }

                if ('click' === scope.event) {
                    element.click(toggle);
                } else {
                    element.hover(show, hide);
                }
                hide();
            },
            replace: true
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcYoutubeSlidein', itcYoutubeSlidein);
})();

angular.module('pl.itcrowd.services', []);

(function ()
{
    'use strict';

    /* Start angularLocalStorage */

    var angularLocalStorage = angular.module('pl.itcrowd.services');

// You should set a prefix to avoid overwriting any local storage variables from the rest of your app
// e.g. angularLocalStorage.constant('prefix', 'youAppName');
    angularLocalStorage.value('prefix', 'localStorageService');
// Cookie options (usually in case of fallback)
// expiry = Number of days before cookies expire // 0 = Does not expire
// path = The web path the cookie represents
    angularLocalStorage.constant('cookie', { expiry: 30, path: '/'});
    angularLocalStorage.constant('notify', { setItem: true, removeItem: false});

    angularLocalStorage.service('localStorageService', [
        '$rootScope', 'prefix', 'cookie', 'notify', function ($rootScope, prefix, cookie, notify)
        {

            // If there is a prefix set in the config lets use that with an appended period for readability
            //var prefix = angularLocalStorage.constant;
            if (prefix.substr(-1) !== '.') {
                prefix = !!prefix ? prefix + '.' : '';
            }

            // Checks the browser to see if local storage is supported
            var browserSupportsLocalStorage = function ()
            {
                try {
                    return ('localStorage' in window && window.localStorage !== null);
                } catch (e) {
                    $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
                    return false;
                }
            };

            // Directly adds a value to local storage
            // If local storage is not available in the browser use cookies
            // Example use: localStorageService.add('library','angular');
            var addToLocalStorage = function (key, value)
            {

                // If this browser does not support local storage use cookies
                if (!browserSupportsLocalStorage()) {
                    $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
                    if (notify.setItem) {
                        $rootScope.$broadcast('LocalStorageModule.notification.setitem', {key: key, newvalue: value, storageType: 'cookie'});
                    }
                    return addToCookies(key, value);
                }

                // Let's convert undefined values to null to get the value consistent
                if (typeof value === 'undefined') {
                    value = null;
                }

                try {
                    if (angular.isObject(value) || angular.isArray(value)) {
                        value = angular.toJson(value);
                    }
                    localStorage.setItem(prefix + key, value);
                    if (notify.setItem) {
                        $rootScope.$broadcast('LocalStorageModule.notification.setitem', {key: key, newvalue: value, storageType: 'localStorage'});
                    }
                } catch (e) {
                    $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
                    return addToCookies(key, value);
                }
                return true;
            };

            // Directly get a value from local storage
            // Example use: localStorageService.get('library'); // returns 'angular'
            var getFromLocalStorage = function (key)
            {
                if (!browserSupportsLocalStorage()) {
                    $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
                    return getFromCookies(key);
                }

                var item = localStorage.getItem(prefix + key);
                // angular.toJson will convert null to 'null', so a proper conversion is needed
                // FIXME not a perfect solution, since a valid 'null' string can't be stored
                if (!item || item === 'null') {
                    return null;
                }

                if (item.charAt(0) === '{' || item.charAt(0) === '[') {
                    return angular.fromJson(item);
                }
                return item;
            };

            // Remove an item from local storage
            // Example use: localStorageService.remove('library'); // removes the key/value pair of library='angular'
            var removeFromLocalStorage = function (key)
            {
                if (!browserSupportsLocalStorage()) {
                    $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
                    if (notify.removeItem) {
                        $rootScope.$broadcast('LocalStorageModule.notification.removeitem', {key: key, storageType: 'cookie'});
                    }
                    return removeFromCookies(key);
                }

                try {
                    localStorage.removeItem(prefix + key);
                    if (notify.removeItem) {
                        $rootScope.$broadcast('LocalStorageModule.notification.removeitem', {key: key, storageType: 'localStorage'});
                    }
                } catch (e) {
                    $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
                    return removeFromCookies(key);
                }
                return true;
            };

            // Return array of keys for local storage
            // Example use: var keys = localStorageService.keys()
            var getKeysForLocalStorage = function ()
            {

                if (!browserSupportsLocalStorage()) {
                    $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
                    return false;
                }

                var prefixLength = prefix.length;
                var keys = [];
                for (var key in localStorage) {
                    // Only return keys that are for this app
                    if (key.substr(0, prefixLength) === prefix) {
                        try {
                            keys.push(key.substr(prefixLength));
                        } catch (e) {
                            $rootScope.$broadcast('LocalStorageModule.notification.error', e.Description);
                            return [];
                        }
                    }
                }
                return keys;
            };

            // Remove all data for this app from local storage
            // Example use: localStorageService.clearAll();
            // Should be used mostly for development purposes
            var clearAllFromLocalStorage = function ()
            {

                if (!browserSupportsLocalStorage()) {
                    $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
                    return clearAllFromCookies();
                }

                var prefixLength = prefix.length;

                for (var key in localStorage) {
                    // Only remove items that are for this app
                    if (key.substr(0, prefixLength) === prefix) {
                        try {
                            removeFromLocalStorage(key.substr(prefixLength));
                        } catch (e) {
                            $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
                            return clearAllFromCookies();
                        }
                    }
                }
                return true;
            };

            // Checks the browser to see if cookies are supported
            var browserSupportsCookies = function ()
            {
                try {
                    return navigator.cookieEnabled ||
                            ('cookie' in document && (document.cookie.length > 0 || (document.cookie = 'test').indexOf.call(document.cookie, 'test') > -1));
                } catch (e) {
                    $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
                    return false;
                }
            };

            // Directly adds a value to cookies
            // Typically used as a fallback is local storage is not available in the browser
            // Example use: localStorageService.cookie.add('library','angular');
            var addToCookies = function (key, value)
            {

                if (typeof value === 'undefined') {
                    return false;
                }

                if (!browserSupportsCookies()) {
                    $rootScope.$broadcast('LocalStorageModule.notification.error', 'COOKIES_NOT_SUPPORTED');
                    return false;
                }

                try {
                    var expiry = '', expiryDate = new Date();
                    if (value === null) {
                        // Mark that the cookie has expired one day ago
                        expiryDate.setTime(expiryDate.getTime() + (-1 * 24 * 60 * 60 * 1000));
                        expiry = '; expires=' + expiryDate.toGMTString();

                        value = '';
                    } else if (cookie.expiry !== 0) {
                        expiryDate.setTime(expiryDate.getTime() + (cookie.expiry * 24 * 60 * 60 * 1000));
                        expiry = '; expires=' + expiryDate.toGMTString();
                    }
                    if (!!key) {
                        document.cookie = prefix + key + '=' + encodeURIComponent(value) + expiry + '; path=' + cookie.path;
                    }
                } catch (e) {
                    $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
                    return false;
                }
                return true;
            };

            // Directly get a value from a cookie
            // Example use: localStorageService.cookie.get('library'); // returns 'angular'
            var getFromCookies = function (key)
            {
                if (!browserSupportsCookies()) {
                    $rootScope.$broadcast('LocalStorageModule.notification.error', 'COOKIES_NOT_SUPPORTED');
                    return false;
                }

                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var thisCookie = cookies[i];
                    while (thisCookie.charAt(0) === ' ') {
                        thisCookie = thisCookie.substring(1, thisCookie.length);
                    }
                    if (thisCookie.indexOf(prefix + key + '=') === 0) {
                        return decodeURIComponent(thisCookie.substring(prefix.length + key.length + 1, thisCookie.length));
                    }
                }
                return null;
            };

            var removeFromCookies = function (key)
            {
                addToCookies(key, null);
            };

            var clearAllFromCookies = function ()
            {
                var thisCookie = null;
                var prefixLength = prefix.length;
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    thisCookie = cookies[i];
                    while (thisCookie.charAt(0) === ' ') {
                        thisCookie = thisCookie.substring(1, thisCookie.length);
                    }
                    var key = thisCookie.substring(prefixLength, thisCookie.indexOf('='));
                    removeFromCookies(key);
                }
            };

            return {
                isSupported: browserSupportsLocalStorage,
                set: addToLocalStorage,
                add: addToLocalStorage, //DEPRECATED
                get: getFromLocalStorage,
                keys: getKeysForLocalStorage,
                remove: removeFromLocalStorage,
                clearAll: clearAllFromLocalStorage,
                cookie: {
                    set: addToCookies,
                    add: addToCookies, //DEPRECATED
                    get: getFromCookies,
                    remove: removeFromCookies,
                    clearAll: clearAllFromCookies
                }
            };

        }
    ]);
}).call(this);
(function ()
{
    'use strict';

    function AsyncQueue($log, $timeout)
    {
        var defaultQueueName = 'default';
        var queue = [];
        var queueConfig = {};
        queueConfig[defaultQueueName] = {timeout: 0};

        function isDuplicate(queueItem, callback, options)
        {
            if (null != options.groupingId || null != queueItem.options.groupingId) {
                return options.groupingId === queueItem.options.groupingId;
            }
            return queueItem.callback === callback;
        }

        function createQueueItem(callback, config, options)
        {
            config = angular.extend({}, config, options);
            var promise = $timeout(callback, config.timeout);
            promise.then(function removeQueueItem()
            {
                for (var i = 0; i < queue.length; i++) {
                    if (queue[i].promise === promise) {
                        queue.splice(i, 1);
                        return;
                    }
                }
            });
            return {callback: callback, options: options, promise: promise};
        }

        function add(callback, options)
        {
            options = angular.extend({queueId: defaultQueueName}, options);

            for (var i = 0; i < queue.length; i++) {
                if (isDuplicate(queue[i], callback, options)) {
                    $timeout.cancel(queue[i].promise);
                    queue.splice(i, 1);
                    break;
                }
            }

            if (null == queueConfig[options.queueId]) {
                $log.warn('No queue `' + options.queueId + '` defined');
                options.queueId = defaultQueueName;
            }

            var config = angular.extend({}, queueConfig[options.queueId], options);

            if (config.timeout > 0) {
                queue.push(createQueueItem(callback, config, options));
            } else {
                callback();
            }
        }

        function configure(config, queueId)
        {
            if (null == queueId) {
                queueId = defaultQueueName;
            }
            queueConfig[queueId] = angular.extend(queueConfig[queueId] || {}, config);
        }

        return {
            add: add,
            configure: configure
        };
    }

    angular.module('pl.itcrowd.services').factory('AsyncQueue', ['$log', '$timeout', AsyncQueue]);
})();

(function ()
{
    'use strict';

    function config($httpProvider)
    {
        function interceptor($location, $rootScope, $q)
        {

            function success(response)
            {
                return response;
            }

            function error(response)
            {
                /*jshint maxcomplexity:false*/
                var status = response.status;
                $rootScope.errorDate = new Date();
                if (null != response.config && null != response.config.skipDefaultInterceptors && null != response.config.skipDefaultInterceptors.codes &&
                        response.config.skipDefaultInterceptors.codes.indexOf(status) > -1) {
                    return $q.reject(response);
                }
                switch (status) {
                    case 400:
                        $rootScope.errorMessage = 'Request cannot be fulfilled due to bad syntax!';
                        break;
                    case 401:
                        return response; // Let http-auth-interceptor.js handle this response
                    case 403:
                        $rootScope.errorMessage = 'You don\'t have access to this page or resource!';
                        break;
                    case 404:
                        $rootScope.errorMessage = 'The page or resource your are looking for does not exist!';
                        break;
                    case 405:
                        $rootScope.errorMessage = 'Request method not supported!';
                        break;
                    case 408:
                        $rootScope.errorMessage = 'The server timed out waiting for the request!';
                        break;
                    case 412:
                        $rootScope.errorMessage = 'Precondition failed: ' + response.data;
                        break;
                    case 415:
                        $rootScope.errorMessage = 'This media type is not supported!';
                        break;
                    case 503:
                        $rootScope.errorMessage = 'The server is currently unavailable (overloaded or down)!';
                        break;
                    case 505:
                        $rootScope.errorMessage = 'The server does not support the HTTP protocol version used in the request!';
                        break;
                    default:
                        $rootScope.errorMessage = response.message ? response.message : 'Internal Server Error! Something went really wrong...';

                }
                $location.path('/error');
                $location.replace();
                return $q.reject(response);
            }

            return function (promise)
            {
                return promise.then(success, error);
            };
        }

        $httpProvider.responseInterceptors.push(['$location', '$rootScope', '$q', interceptor]);
    }

    /**
     * ExceptionHandler must be loaded after http-auth-interceptor i.e.:
     *
     * angular.module('restbase', ['http-auth-interceptor','pl.itcrowd.services']);
     */
    angular.module('pl.itcrowd.services').config(['$httpProvider', config]);
})();

(function ()
{
    'use strict';

    function GoogleAnalytics($rootScope)
    {
        return {
            sendEvent: function (category, action, label, value)
            {
                $rootScope.$broadcast('GoogleAnalytics:event', category, action, label, value);
            },
            sendPageview: function (location, page, title)
            {
                $rootScope.$broadcast('GoogleAnalytics:pageview', location, page, title);
            },
            ecommerce: function (id, affiliation, revenue, shipping, tax)
            {
                var transaction = {
                    id: id,
                    affiliation: affiliation,
                    revenue: revenue,
                    shipping: shipping,
                    tax: tax,
                    items: []
                };
                return {
                    addItem: function (id, name, sku, category, price, quantity)
                    {
                        transaction.items.push({id: id, name: name, sku: sku, category: category, price: price, quantity: quantity});
                    },
                    send: function ()
                    {
                        $rootScope.$broadcast('GoogleAnalytics:ecommerce', transaction);
                    }
                };
            }
        };
    }

    angular.module('pl.itcrowd.services').factory('GoogleAnalytics', ['$rootScope', GoogleAnalytics]);
})();

(function ()
{
    'use strict';

    function MessageFactory()
    {
        var subscribers = [];
        return {
            notify: function (type, message)
            {
                angular.forEach(subscribers, function (subscriber)
                {
                    if (!subscriber.type || subscriber.type === type) {
                        subscriber.cb(message, type);
                    }
                });
            },
            clean: function ()
            {
                subscribers = [];
            },
            subscribe: function (subscriber, type)
            {
                subscribers.push({
                    cb: subscriber,
                    type: type
                });
            },
            success: function (message)
            {
                this.notify('success', message);
            },
            info: function (message)
            {
                this.notify('info', message);
            },
            warn: function (message)
            {
                this.notify('warn', message);
            },
            error: function (message)
            {
                this.notify('error', message);
            }
        };
    }

    angular.module('pl.itcrowd.services').factory('MessageFactory', MessageFactory);
})();

(function ()
{
    'use strict';


    function paginationSupport()
    {
        /*jshint validthis:true*/
        var defaultConfig = {maxResults: 20};

        this.setDefaultConfig = function (config)
        {
            defaultConfig = config;
        };

        this.$get = ['AsyncQueue', function (AsyncQueue)
        {

            function AbstractPagination($scope, refreshFunction, asyncQueueOptions)
            {
                $scope.filter = $scope.filter || {};
                $scope.filter = angular.extend({firstResult: 0, maxResults: defaultConfig.maxResults}, $scope.filter);

                var doRefreshDueToPagination = angular.bind(null, refreshFunction, function (resultCount)
                {
                    $scope.resultCount = resultCount;
                }, false);

                var doRefreshDueToFiltersChange = angular.bind(null, refreshFunction, function (resultCount)
                {
                    $scope.resultCount = resultCount;
                }, true);

                function refreshDueToPagination()
                {
                    AsyncQueue.add(doRefreshDueToPagination, asyncQueueOptions);
                }

                function refreshDueToFiltersChange()
                {
                    AsyncQueue.add(doRefreshDueToFiltersChange, asyncQueueOptions);
                }

                function modelListener(newValue, oldValue)
                {
                    if (newValue === oldValue) {
                        return;
                    }
                    refreshDueToPagination();
                }

                function pageAwareModelListener(newValue, oldValue)
                {
                    if (newValue === oldValue) {
                        return;
                    }
                    $scope.currentPage = 1;
                    if (newValue === oldValue) {
                        return;
                    }
                    refreshDueToFiltersChange();
                }

                angular.forEach($scope.filter, function (value, key)
                {
                    var listener = 'firstResult' === key || 'maxResults' === key ? modelListener : pageAwareModelListener;
                    $scope.$watch('filter.' + key, listener, true);
                });

                $scope.isPaginationNeeded = function ()
                {
                    return $scope.resultCount > $scope.filter.maxResults;
                };

                $scope.$watch('currentPage', function (newValue, oldValue)
                {
                    if (newValue === oldValue) {
                        return;
                    }
                    $scope.filter.firstResult = (newValue - 1) * $scope.filter.maxResults;
                }, true);

                return refreshDueToFiltersChange;
            }

            return AbstractPagination;
        }];
    }

    angular.module('pl.itcrowd.services').provider('paginationSupport', paginationSupport);
})();

/*global Showdown*/
(function ()
{
    'use strict';

    function $showdown()
    {
        return new Showdown.converter();
    }

    angular.module('pl.itcrowd.services').factory('$showdown', $showdown);
})();
