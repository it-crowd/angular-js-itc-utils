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

                function modelListener(newValue, oldValue)
                {
                    if (newValue === oldValue) {
                        return;
                    }
                    AsyncQueue.add(doRefreshDueToPagination, asyncQueueOptions);
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
                    AsyncQueue.add(doRefreshDueToFiltersChange, asyncQueueOptions);
                }

                for (var key in $scope.filter) {
                    if ($scope.filter.hasOwnProperty(key)) {
                        var listener = 'firstResult' === key || 'maxResults' === key ? modelListener : pageAwareModelListener;
                        $scope.$watch('filter.' + key, listener, true);
                    }
                }

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

                return doRefreshDueToFiltersChange;
            }

            return AbstractPagination;
        }];
    }

    angular.module('restbase.services').provider('paginationSupport', paginationSupport);
})();
