(function ()
{
    'use strict';

    function itcTreeNode($compile)
    {
        return {
            restrict: 'E',
            transclude: false,
            scope: false,
            templateUrl: 'common/directives/treeNode.html',
            link: function (scope, elm)
            {
                var childTemplate = '<li ng-repeat="child in getChildren()"><itc-tree-node></itc-tree-node></li>';
                var children = $compile(childTemplate)(scope);
                elm.find('ul').append(children);
                var head = elm.find('.head');
                head.droppable({
                    drop: function (event, ui)
                    {
                        var draggable = angular.element(ui.draggable).scope();
                        if (scope.onBeforeDrop(draggable) !== false) {
                            scope.onDrop(draggable);
                        }
                    }
                });
                var isRoot = null == scope.$parent.child;
                if (!isRoot) {
                    head.draggable({
                        revert: true
                    });
                }
                scope.$on('$destroy', function ()
                {
                    if (!isRoot) {
                        try {
                            head.draggable('destroy');
                        } catch (e) {
                        }
                    }
                    try {
                        head.droppable('destroy');
                    } catch (e) {
                    }
                });
            },
            replace: true
        };
    }

    angular.module('pl.itcrowd.directives').directive('itcTreeNode', ['$compile', itcTreeNode]);
})();
