/**
 * 缓存服务
 * 提供两种缓存机制：1. $cacheFactory; 2. localStorage。如果想缓存数据必须在cf或ls中进行注册，这样可以方便统一管理缓存
 *
 */
lbApp.factory('CacheService', ['$cacheFactory', function($cacheFactory) {
    "use strict";
    // $cacheFactory的可缓存内容。例如{userCache: ['id', 'name']}
    var cf = {};
    // localStorage可缓存的内容。例如['env']
    var ls = [];
    for (var c in cf) {
        $cacheFactory(c);
    }

    return {
        /**
         * $cacheFactory的get和set方法
         *
         * @param cacheName
         * @param key
         * @param value
         * @returns {*}
         */
        cache: function(cacheName, key, value) {
            var cache = $cacheFactory.get(cacheName);
            if (cache && typeof key === 'string' && cf[cacheName].indexOf(key) > -1) {
                if (value !== undefined) {
                    cache.set(key, value);
                } else {
                    return cache.get(key);
                }
            }
        },
        /**
         * localStorage的get和set方法
         *
         * @param key
         * @param value
         */
        store: function(key, value) {
            if (typeof key === 'string' && ls.indexOf(key) > -1) {
                key = '__lbApp__' + key;
                if (value !== undefined) {
                    localStorage.setItem(key, value.toString());
                } else {
                    return localStorage.getItem(key);
                }
            }
        }
    };
}]);