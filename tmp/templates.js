angular.module('singingbeer.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('pages/beer/beermatch.html',
        '<div>\n' +
        '    Beer Match Page\n' +
        '</div>');
    $templateCache.put('pages/login/login.html',
        '<div class="panel panel-default panel-spotify">\n' +
        '    <div class="panel-heading">\n' +
        '        <h4 class="panel-title">Login with your Facebook account</h4>\n' +
        '    </div>\n' +
        '    <div class="panel-body">\n' +
        '        <button class="btn btn-lg btn-block btn-primary" ng-click="welcome.login()">\n' +
        '            <i class="fa fa-facebook"></i> Login\n' +
        '        </button>\n' +
        '    </div>\n' +
        '</div>\n' +
        '');
}]);
