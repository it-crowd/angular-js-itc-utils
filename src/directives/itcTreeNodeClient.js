(function ()
{
    'use strict';

    function itcTreeNodeClient($compile)
    {
        return {
            restrict: 'E',
            transclude: false,
            scope: false,
            templateUrl: 'common/directives/treeNodeMetronic.html',
            link: function (scope, elm)
            {
                var childTemplate = '<li ng-repeat="child in getChildren()" class="list-group-item clearfix"><itc-tree-node-client></itc-tree-node-client></li>';
                var children = $compile(childTemplate)(scope);
                elm.find('ul').append(children);
            },
            replace: true
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcTreeNodeClient', ['$compile', itcTreeNodeClient]);
})();
