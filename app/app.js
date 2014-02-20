var App = angular.module('App', ['ngRoute']);

App.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/templates/home.html'
    })
    .when('/beers/:beerId', {
      templateUrl: '/templates/beer.html',
      controller: 'BeerCtrl'
    });
});

App.controller('StoreCtrl', function($scope, Beers, Cart) {
  Beers.getItems().then(function(items) {
    $scope.beers = items;
  });

  $scope.addToCart = function(beer) {
    Cart.addItem(beer);
  };

  $scope.sort = 'name';
});

App.service('Beers', function($http) {
  return {
    items: [],
    getItems: function() {
      return $http.get('/api/beers').then(function(response) {
        return response.data;
      });
    },
    find: function(id) {
      return $http.get('/api/beers/' + id).then(function(response) {
        return response.data;
      });
    }
  }
});

App.controller('CartCtrl', function($scope, Cart) {
  $scope.cart = Cart;
});

App.factory('Cart', function() {
  return {
    items: [],
    total: 0,
    addItem: function(item) {
      var existing = this.find(item._id);

      if(existing) {
        existing.amount += 1;
      } else {
        this.items.push({
          id: item._id,
          title: item.title,
          price: item.price,
          amount: 1
        });
      }
      this.update();
    },
    removeItem: function(item) {
      this.items.splice(this.items.indexOf(item), 1);
      this.update();
    },
    find: function(id) {
      for(var i = 0, total = this.items.length; i < total; i++) {
        if(this.items[i].id == id) return this.items[i];
      }
    },
    update: function() {
      this.total = 0;
      for(var i = 0, total = this.items.length; i < total; i++) {
        this.total += this.items[i].price * this.items[i].amount;
      }
    },
    clear: function() {
      this.items = [];
      this.total = 0;
    }
  }
});

App.directive('gbCart', function() {
  return {
    controller: 'CartCtrl',
    templateUrl: '/templates/cart.html'
  }
});

App.directive('gbBeers', function() {
  return {
    controller: 'StoreCtrl',
    templateUrl: '/templates/beer-list.html'
  }
});

App.controller('BeerCtrl', function($scope, $routeParams, Beers) {
  Beers.find($routeParams.beerId).then(function(beer) {
    $scope.beer = beer;
  });
});

App.filter('price', function(numberFilter, currencyFilter) {
  return function(price) {
    return currencyFilter(numberFilter(price / 100), '€ ');
  };
});
