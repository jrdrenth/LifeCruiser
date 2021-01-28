$(document).ready(function() {
  var prevSearches;

  // Functions
  function loadSearchHistory() {
    prevSearches = JSON.parse(localStorage.getItem('prevRestaurants'));
    
    if (prevSearches == null) {
      prevSearches = [];
    } else if (prevSearches.length > 0) {
      repaintSearchHistory();
      getRestaurants(prevSearches[0]);
    }
  }
  
  function indexOfCaseInsensitive(array, text) {
    var index = -1;

    if (array != null) {
      for(let i = 0; i < array.length; i++) {
        if (array[i].toLowerCase() === text.toLowerCase().trim()) {
          index = i;
          break;
        }
      }
    }

    return index;
  }

  function addCity(text) {
    var index = indexOfCaseInsensitive(prevSearches, text);
    if (index > -1) {
      prevSearches.splice(index, 1);
    }

    prevSearches.unshift(text.trim());
    localStorage.setItem('prevRestaurants', JSON.stringify(prevSearches));
  }

  function repaintSearchHistory() {
    var searchHistory = $('#search-history');
    searchHistory.empty();

    for (let i = 0; i < prevSearches.length; i++)    
    {
      let newSearch = $('<li>');
      newSearch.addClass('list-group-item list-group-item-action');
      newSearch.text(prevSearches[i]);
      
      searchHistory.append(newSearch);
    }
  }
  
  function getCityId(cityName) {
    var cityId = -1;

    var apiKey = 'a01146ee9b5f4562d5c2452b43b5e308';
    var queryURL = 'https://developers.zomato.com/api/v2.1/cities?q=' + cityName;

    $.ajax({
      url: queryURL,
      method: "GET",
      async: false,
      headers: {
        'Accept': 'application/json',
        'user-key': apiKey
      }
    }).done(function(response) {

      if (response != null
          && response.location_suggestions != null
          && response.location_suggestions.length > 0) {
        
        // Just take the first location for now, there is no way to know exactly which one
        // the user is looking for right now without presenting them with all choices to choose from
        cityId = response.location_suggestions[0].id;
        
      }

    })
    .fail(function(response) {
      // Handle failed call here, do nothing for now
    });

    return cityId;
  }

  function getRestaurants(cityName, isNewSearch = false) {
    var apiKey = 'a01146ee9b5f4562d5c2452b43b5e308';
    var cityId = getCityId(cityName);
    var queryURL = 'https://developers.zomato.com/api/v2.1/search?entity_id=' + cityId + '&entity_type=city';

    $.ajax({
      url: queryURL,
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'user-key': apiKey
      }
    }).done(function(response) {
      
      if (isNewSearch) {
        addCity(cityName);
        repaintSearchHistory();
      }

      // Clear the current weather
      var currentRestaurants = $('#current-restaurants');
      currentRestaurants.empty();

      if (response.restaurants !== undefined) {

        for (let i = 0; i < response.restaurants.length; i++) {
          let currentRestaurant = response.restaurants[i].restaurant;

          var element = $('<p>').text(currentRestaurant.name);
          //element.text = currentRestaurant.name;
          currentRestaurants.append(element);
        }
      }

    })
    .fail(function(response) {
      // Handle failed call here, do nothing for now
    });

  }

  function getCityName() {
    var searchInputEl = $('#search-input');
    var cityName = searchInputEl.val();
    searchInputEl.val(''); // clear textbox after search
    
    return cityName;
  }

  // Event Listener for clicking the Search Button
  $('#search-button').click(function() {
    getRestaurants(getCityName(), true);
  });

  // Event Listener for pressing Enter in the Search text box
  $('#search-input').keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13') {
      getRestaurants(getCityName(), true);
    }
  });

  // Event Listener for clicking an item in the search history
  $("#search-history").on("click", "li", function() {
    var cityName = $(this).text();
    getRestaurants(cityName);
  });


  loadSearchHistory();

});