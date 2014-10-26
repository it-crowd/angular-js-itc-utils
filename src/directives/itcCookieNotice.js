/**
 * class hidden should be assign to element
 */
(function ()
{
    'use strict';

    function itcCookieNotice()
    {
        return {
            restrict: 'C',
            link: function (scope, elem, attrs)
            {
                var close = elem.find('.cookie-close');

                if(undefined===$.cookie('isCookieAccepted')){
                    elem.show();
                } else {
                    elem.hide();
                }

                close.bind('click',function(){
                    $.cookie('isCookieAccepted',true, { expires: 365 });
                    elem.hide();
                });
            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcCookieNotice', itcCookieNotice);
})();
