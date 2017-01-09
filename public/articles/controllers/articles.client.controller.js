angular.module('articles').controller('ArticlesController', ['$scope', '$routeParams', '$location', 'Authentication', 'Articles', 
                         function($scope, $routeParams, $location, Authentication, Articles){
                            $scope.authentication = Authentication;
                            $scope.create = function(){
                                 var article = new Articles({ //factory
                                     title : this.title,
                                     content : this.content
                                 });

     /*
     non-GET "class" actions: Resource.action([parameters], postData, [success], [error])

     */                         //$save(url, data, [success], [error])
                                 article.$save(function(response){
                                     $location.path('articles/' + response._id);
                                 }, function(errorResponse){
                                     $scope.error = errorResponse.data.message;
                                 });
                             };

                             $scope.find = function(){
                                 $scope.articles = Articles.query(function(){
                                     console.log("number of articles: " + ($scope.articles).length);
                                 });
                                 
                             };

                             $scope.findOne = function(){
                                 $scope.article = Articles.get({
                                     articleId : $routeParams.articleId //from URL
                                 });
                             };

                             $scope.update = function(){
                                 console.log("articleId: " + $scope.article._id);
                                 console.log("current URL at update function: " + $location.path());
                                
                                 $scope.article.$update(function(){
                                     console.log("in $update() calback function");
                                     $location.path('articles/' + $scope.article._id);
                                 }, function(errorResponse){
                                      console.log("in $update() errorResponse function");
                                     $scope.error = errorResponse.data.message;
                                 });
                             };

                             $scope.delete = function(article){
                                if(article){ 
                                    console.log("in $scope.delete 'if' block");
                                    console.log("length of $scope.articles: " + $scope.articles.length);
                                    article.$remove(function(){
                                        for (var i in $scope.articles){// articles is an array in $scope
                                            if($scope.articles[i] === article){
                                                $scope.articles.splice(i,1);
                                            }
                                        }
                                    });
                                } else {
                                    console.log("in $scope.delete 'else' block");
                                    $scope.article.$remove(function(){
                                        window.location.reload();
                                    });
                                }
                             };
                             
                             $scope.deleteAll = function(){
                                     var range = function range(start, index, count) {
                                          return Array.apply(0, Array(count))
                                            .map(function (element, index) { 
                                              return index + start;  
                                          });
                                    };
                                console.log("in deleteAll");
                                    console.log("Starting out, number of articles to delete: " + $scope.articles.length);
                                    if($scope.articles.length){
                                         console.log("number of articles to delete: " + $scope.articles.length);
                                        for(var i in range(0, 1, $scope.articles.length)){
                                            console.log("i: " + i);
                                           $scope.articles[i].$remove(function(){
                                                window.location.reload();
                                            });
                                        };
                                    };
                                     $location.path('articles');
                                };
                        }]);


