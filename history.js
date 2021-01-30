// Get form, item, and trip
var tripDestination = document.querySelector('#where-did-you-travel');
var tripItem = document.querySelector('#trip-item');
var trip = document.querySelector('#tripItem');
tripDestination.addEventListener('submit', function (event) {
    // Don't submit the form
    event.preventDefault();
    // Ignore it if the trip item is empty
    if (tripItem.value.length < 1) return;
    // Add item to trip
    trip.innerHTML += '<li>' + tripItem.value + '</li>';
    // Clear input
    tripItem.value = '';
    // Save the list to localStorage
    localStorage.setItem('tripItems', trip.innerHTML);
}, false);
// Check for saved trip items
var savedTrip = localStorage.getItem('tripItems');
// If there are any saved items, update our list
if (savedTrip) {
    trip.innerHTML = savedTrip;
}
// Get form, item, and trip
var tripDescription = document.querySelector('#what-did-you-do-there');
var descriptionItem = document.querySelector('#trip-description');
var description = document.querySelector('#descriptionItem');
tripDescription.addEventListener('submit', function (event) {
    // Don't submit the form
    event.preventDefault();
    // Ignore it if the trip item is empty
    if (descriptionItem.value.length < 1) return;
    // Add item to trip
    description.innerHTML += '<li>' + descriptionItem.value + '</li>';
    // Clear input
    descriptionItem.value = '';
    // Save the list to localStorage
    localStorage.setItem('descriptionItems', description.innerHTML);
}, false);
// Check for saved trip items
var savedDestination = localStorage.getItem('descriptionItems');
// If there are any saved items, update our list
if (savedDestination) {
    description.innerHTML = savedDestination;
}
// Get form, item, and trip
var tripDate = document.querySelector('#when-did-you-go');
var dateItem = document.querySelector('#trip-date');
var date = document.querySelector('#dateItem');
tripDate.addEventListener('submit', function (event) {
    // Don't submit the form
    event.preventDefault();
    // Ignore it if the trip item is empty
    if (dateItem.value.length < 1) return;
    // Add item to trip
    date.innerHTML += '<li>' + dateItem.value + '</li>';
    // Clear input
    dateItem.value = '';
    // Save the list to localStorage
    localStorage.setItem('dateItems', date.innerHTML);
}, false);
// Check for saved trip items
var savedDate = localStorage.getItem('dateItems');
// If there are any saved items, update our list
if (savedDate) {
    date.innerHTML = savedDate;
}
 