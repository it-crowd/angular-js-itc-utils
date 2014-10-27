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
            link: function (scope,elem,attrs)
            {
                scope.$watch('content', function (newValue, oldValue)
                {
                    if(''===oldValue && oldValue===newValue){
                        return;
                    }
                    var meta = jQuery('<meta>');
                    angular.forEach(attrs, function (value, key)
                    {
                        if(!(value instanceof Object)){
                            meta = meta.attr(key,value);
                        }
                    });
                    jQuery('head').append(meta);
                });

            }
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcMetadata', itcMetadata);
})();
