angular.module('singingbeer.templates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('pages/beer/beermatch.html',
        '<div>\n' +
        '    Beer Match Page\n' +
        '    <div ng-repeat="style in beerMatchCtrl.styles">\n' +
        '        <div>Id: {{style.id}}</div>\n' +
        '        <div>Name: {{style.name}}</div>\n' +
        '        <div>Description: {{style.description}}</div>\n' +
        '        <div>CategoryId: {{style.categoryId}}</div>\n' +
        '        <div>Category: {{style.category}}</div>\n' +
        '    </div>\n' +
        '</div>');
    $templateCache.put('pages/login/login.html',
        '<div class="panel panel-default panel-spotify">\n' +
        '    <div class="panel-heading">\n' +
        '        <h4 class="panel-title">Connect your Spotify account</h4>\n' +
        '    </div>\n' +
        '    <div class="panel-body">\n' +
        '        <button class="btn btn-lg btn-block btn-primary" ng-click="welcome.connect()">\n' +
        '            <i class="fa fa-spotify"></i> Connect\n' +
        '        </button>\n' +
        '    </div>\n' +
        '</div>\n' +
        '');
}]);
