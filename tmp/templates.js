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
        '        <button class="btn btn-lg btn-block btn-primary" ng-click="loginCtrl.login()">\n' +
        '            <i class="fa fa-facebook"></i> Login\n' +
        '        </button>\n' +
        '    </div>\n' +
        '</div>\n' +
        '');
    $templateCache.put('pages/search-music/search-music.html',
        '<div class="panel panel-default panel-spotify">\n' +
        '    <div class="panel-heading">\n' +
        '        <h4 class="panel-title">Search Music</h4>\n' +
        '    </div>\n' +
        '    <div class="panel-body">\n' +
        '        <div class="form-group">\n' +
        '            <input type="text" class="form-control">\n' +
        '            <button class="btn btn-lg btn-block btn-primary" ng-click="music.search()">\n' +
        '                <i class="fa fa-spotify"></i> Search\n' +
        '            </button>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '');
}]);
