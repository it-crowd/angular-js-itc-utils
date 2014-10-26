(function ()
{
    'use strict';

    function CurrentUser($q, UserDAO)
    {
        var defer;

        var clear = function ()
        {
            defer = null;
        };
        var resolve = function ()
        {
            if (null == defer) {
                defer = $q.defer();
                UserDAO.getMeOrNull(function (data)
                {
                    defer.resolve(data);
                }, function ()
                {
                    //noinspection JSValidateTypes
                    defer.reject(arguments);
                });
            }
            return defer.promise;
        };
        return {
            clear: clear,
            reload: function ()
            {
                clear();
                return resolve();
            },
            resolve: resolve

        };
    }
    //noinspection JSValidateTypes
    angular.module('pl.itcrowd.services').factory('CurrentUser', ['$q', 'UserDAO', CurrentUser]);
})();
