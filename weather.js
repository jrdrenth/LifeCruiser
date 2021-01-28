$(document).ready(function () {
  $("#search-button").on("click", function () {
    let findCity = $("#search-value").val();
    $("#search-value").val("");
    searchWeather(findCity);
  });
  $(".history").on("click", "li", function () {
    searchWeather($(this).text());
  });
  function makeRow(text) {
    let li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(".history").append(li);
  }
  function searchWeather(findCity) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/weather?q=" + findCity + "&appid=3c8c1d9e76eadd902a53aa3ec8156094&units=imperial",
      dataType: "json",
      success: function (data) {
        if (history.indexOf(findCity) === -1) {
          history.push(findCity);
          window.localStorage.setItem("history", JSON.stringify(history));
          makeRow(findCity);
        }
        $("#today").empty();
        let title = $("<h3>").addClass("weatherBoard-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        let weatherBoard = $("<div>").addClass("weatherBoard");
        let wind = $("<p>").addClass("weatherBoard-text").text("Wind Speed: " + data.wind.speed + " MPH");
        let humid = $("<p>").addClass("weatherBoard-text").text("Humidity: " + data.main.humidity + "%");
        let temp = $("<p>").addClass("weatherBoard-text").text("Temperature: " + data.main.temp + " °F");
        let cardBody = $("<div>").addClass("weatherBoard-body");
        let img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
        title.append(img);
        cardBody.append(title, temp, humid, wind);
        weatherBoard.append(cardBody);
        $("#today").append(weatherBoard);
        getForecast(findCity);
        getUVIndex(data.coord.lat, data.coord.lon);
      }
    });
  }
  function getUVIndex(lat, lon) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/uvi?appid=3c8c1d9e76eadd902a53aa3ec8156094&lat=" + lat + "&lon=" + lon,
      dataType: "json",
      success: function (data) {
        let uv = $("<p>").text("UV Index: ");
        let btn = $("<span>").addClass("btn btn-sm").text(data.value);
        if (data.value < 3) {
          btn.addClass("btn-success");
        }
        else if (data.value < 7) {
          btn.addClass("btn-warning");
        }
        else {
          btn.addClass("btn-danger");
        }
        $("#today .weatherBoard-body").append(uv.append(btn));
      }
    });
  }
  let history = JSON.parse(window.localStorage.getItem("history")) || [];
  if (history.length > 0) {
    searchWeather(history[history.length - 1]);
  }
  for (let i = 0; i < history.length; i++) {
    makeRow(history[i]);
  }

  function getForecast(findCity) {
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/forecast?q=" + findCity + "&appid=3c8c1d9e76eadd902a53aa3ec8156094&units=imperial",
      dataType: "json",
      success: function (data) {
        $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
        for (let i = 0; i < data.list.length; i++) {
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            let col = $("<div>").addClass("col-md-2");
            let weatherBoard = $("<div>").addClass("weatherBoard text-tan");
            let body = $("<div>").addClass("weatherBoard-body p-3");
            let title = $("<weatherSearch>").addClass("weatherBoard-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
            let img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
            let p1 = $("<p>").addClass("weatherBoard-text").text("Temp: " + data.list[i].main.temp_max + " °F");
            let p2 = $("<p>").addClass("weatherBoard-text").text("Humidity: " + data.list[i].main.humidity + "%");
            col.append(weatherBoard.append(body.append(title, img, p1, p2)));
            $("#forecast .row").append(col);
          }
        }
      }
    });
  }
});
