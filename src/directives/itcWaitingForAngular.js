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
                elem.removeClass('itc-waiting-for-angular');
            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcWaitingForAngular', itcWaitingForAngular);
})();
