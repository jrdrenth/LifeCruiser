$(document).ready(function() {

  var hotels = [];

  // Functions
  function search() {
    //var searchTextBox = $('#search-value');
    //var searchValue = searchTextBox.val();
    var searchValue = 'Tustin';
    //searchTextBox.val(''); // clear textbox after getting value

    var apiKey = '76b9415c4fmshc171dbb08bd999ep1338b7jsn01fe30d91026';
    var queryURL = 'https://hotels4.p.rapidapi.com/locations/search?query=' + searchValue + '&locale=en_US';

    $.ajax({
      url: queryURL,
      method: "GET",
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'hotels4.p.rapidapi.com'
      }
    }).then(function(response) {
      
      if (response.suggestions !== undefined && response.suggestions.length > 0) {
        var hotelGroup;
        var pageInfo = $('#page-info');

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
          console.log(currentHotel.name);

          let paragraphEl = $('<p>');
          paragraphEl.text = currentHotel.name;
          pageInfo.append(paragraphEl);


        }

      }

    });

  }

  // Event Listener for clicking the Search Button
  $('#search-button').click(search);

  search();

});