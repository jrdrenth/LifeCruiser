$(document).ready(function() {
  var prevSearches;

  // Functions
  function loadSearchHistory() {
    prevSearches = JSON.parse(localStorage.getItem('prevHotels'));
    
    if (prevSearches == null) {
      prevSearches = [];
    } else if (prevSearches.length > 0) {
      repaintSearchHistory();
      getHotels(prevSearches[0]);
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
    localStorage.setItem('prevHotels', JSON.stringify(prevSearches));
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
  
  function getHotels(cityName, isNewSearch = false) {
    var apiKey = '76b9415c4fmshc171dbb08bd999ep1338b7jsn01fe30d91026';
    var queryURL = 'https://hotels4.p.rapidapi.com/locations/search?query=' + cityName + '&locale=en_US';

    //console.log('isNewSearch:' + isNewSearch);
    //console.log('city: ' + cityName);

    $.ajax({
      url: queryURL,
      method: "GET",
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'hotels4.p.rapidapi.com'
      }
    }).done(function(response) {
      console.log(response);

      if (isNewSearch) {
        addCity(cityName);
        repaintSearchHistory();
      }

      // Clear the current weather
      var currentHotels = $("#current-hotels");
      currentHotels.empty();

      if (response.suggestions !== undefined && response.suggestions.length > 0) {
        var hotelGroup;

        // Get group: "HOTEL GROUP"
        for (let i = 0; i < response.suggestions.length; i++) {
          var currentSuggestion = response.suggestions[i];

          if (currentSuggestion.group === 'HOTEL_GROUP') {
            hotelGroup = currentSuggestion.entities;
            break;
          }
        }

        for (let i = 0; i < hotelGroup.length; i++) {
          let currentHotel = hotelGroup[i];

          var element = $('<p>').text(currentHotel.name);
          //element.text = currentHotel.name;
          currentHotels.append(element);
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
    getHotels(getCityName(), true);
  });

  // Event Listener for pressing Enter in the Search text box
  $('#search-input').keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13') {
      getHotels(getCityName(), true);
    }
  });

  // Event Listener for clicking an item in the search history
  $("#search-history").on("click", "li", function() {
    var cityName = $(this).text();
    getHotels(cityName);
  });


  loadSearchHistory();

});