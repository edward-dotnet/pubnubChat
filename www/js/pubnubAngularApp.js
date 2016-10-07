// single page application angular 1 controller
angular.module('myApp', ["pubnub.angular.service"])
.controller('ChatCtrl', function($rootScope, $scope, $location, PubNub) {
  // make up a user id
    $scope.userId   = "" + Math.round(Math.random() * 1000) + " - " + chance.first();
    // make up a channel name
    $scope.channel  = 'AIT 5141 Chat';
    // pre-populate any existing messages
    $scope.messages = ['Welcome to ' + $scope.channel];
    if (!$rootScope.initialized) {
        // Initialize the PubNub service on page load
        PubNub.init({
          subscribe_key: 'demo',
          publish_key: 'demo',
          uuid:$scope.userId
        });
        $rootScope.initialized = true;
      }
      // Subscribe to the Channel
        PubNub.ngSubscribe({ channel: $scope.channel });

        // Create a publish() function in the scope
        $scope.publish = function() {
            PubNub.ngPublish({
                channel: $scope.channel,
                message: "[" + $scope.userId + "] " + $scope.newMessage
            });
            $scope.newMessage = '';
        };
        // Register for message events
          $rootScope.$on(PubNub.ngMsgEv($scope.channel), function(ngEvent, payload) {
            $scope.$apply(function() {
              $scope.messages.push(payload.message);
            });
          });
          // Register for presence events
            $rootScope.$on(PubNub.ngPrsEv($scope.channel), function(ngEvent, payload) {
              $scope.$apply(function() {
                $scope.users = PubNub.ngListPresence($scope.channel);
              });
            });
            // Pre-Populate the user list
              PubNub.ngHereNow({
                channel: $scope.channel
              });
              // Populate message history
                PubNub.ngHistory({
                  channel: $scope.channel,
                  count: 500
                });
              });
