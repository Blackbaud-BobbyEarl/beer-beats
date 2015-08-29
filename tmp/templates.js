angular.module('singingbeer.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('pages/beer/beermatch.html',
        '<div>\n' +
        '    Beer Match Page\n' +
        '</div>');
    $templateCache.put('pages/login/login.html',
        '<div>\n' +
        '    Login Page\n' +
        '</div>');
}]);
