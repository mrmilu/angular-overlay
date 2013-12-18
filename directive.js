var app = angular.module('angular-overlay', []);

app.factory('angularOverlayService', [function(){
  return {
    overlays: {},
    mapped: false,
    add: function(overlay) {
      var that = this;
      this.overlays[overlay.overlayId] = overlay;
      if (!this.mapped) {
        this.mapped = true;
        angular.element('*').click(function(e) {
          if (!that.inOverlay(e.target)) {
            that.hideAll();
          }
        });
      }
    },
    hideVisible: function(exceptionId) {
      angular.forEach(this.overlays, function(overlay) {
        if ((overlay.overlayId != exceptionId) && overlay.visible) {
          overlay.hide();
        }
      });
    },
    hideAll: function() {
      angular.forEach(this.overlays, function(overlay) {
        if (overlay.visible) {
          overlay.hide();
        }
      });
    },
    inOverlay: function(target) {
      var found = false;
      angular.forEach(this.overlays, function(overlay) {
        if (!found && angular.element(target).is(overlay.$toggler)) {
          found = true;
        }
      });
      return found;
    }
  };
}]);

app.directive('angularOverlay', function(angularOverlayService) {
  return {
    restrict: 'A',
    scope: {},
    link: function(scope, element, attrs) {
      scope.overlayId = attrs.angularOverlay;
      scope.$toggler = angular.element('[angular-overlay-toggler="' + scope.overlayId + '"]');
      scope.$content = angular.element('[angular-overlay-content="' + scope.overlayId + '"]');
      scope.visible = false;
      scope.visibleCount = 0;
      scope.show = function() {
        scope.visible = true;
        element.addClass('active');
        scope.$toggler.addClass('active');
        scope.$content.stop().fadeIn();
      };
      scope.hide = function() {
        scope.visible = false;
        element.removeClass('active');
        scope.$toggler.removeClass('active');
        scope.$content.stop().fadeOut();
      };

      if (attrs.event == 'click') {
        scope.$toggler.click(function() {
          angularOverlayService.hideVisible(scope.overlayId);
          if (scope.visible) {
            scope.hide();
          }
          else {
            scope.show();
          }
        });
      }
      else {
        element.hover(function() {
          angularOverlayService.hideVisible(scope.overlayId);
          scope.show();
        }, function() {
          angularOverlayService.hideAll();
        });
      }
      angularOverlayService.add(scope);
    }
  }
});