'use strict';
/* global $ */

const apiKey = 'U8CZMLtOvP2f6kNVhEcyEPCsEQbOQNrceOWVTFHi';
const searchURL = 'https://developer.nps.gov/api/v1/parks';
//'https://developer.nps.gov/api/v1/parks?parkCode=acad';

function formatQueryParams(params){
  //create array of the keys in the "params" object
  const queryItems = Object.keys(params)
    // for each of the keys in the array, create a string w/ the key and the key's value in the "params" object
    .map(key => { 
      let value = params[key];
      if (Array.isArray(value)){
        value = `${(value).join(`&${encodeURIComponent(key)}=`)}`;
      }
      else {
        value = encodeURIComponent(value);
      }
      return `${encodeURIComponent(key)}=${(value)}`;
    });
  //return a string of the keys and values, separated by "&"
  return queryItems.join('&');
}

function displayResults(responseJson, limit) {
  // remove any previous results
  $('#results-list').empty();

  //loop through data array, stopping at max number of reuslts 
  for (let i = 0; i < responseJson.data.length & i < limit; i++){
    $('#results-list').append(
      `<li>
        <h3><a href="${responseJson.data[i].url}">${responseJson.data[i].name}</a></h3>
      
        <p>${responseJson.data[i].description}</p>
      </li>`
    );
  }
  
  $('#results-parks').removeClass('hidden');
}

function getParks(query, stateCode, limit=10){
  const params = {
    api_key: apiKey,
    stateCode,
    q: query,
    limit,
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;
  console.log(url);

  /* const headerOptions = {
    headers: new Headers ({
      'Content-type': 'application/json',
      'X-Api-Key': apiKey, 
    })
  }; */

  fetch(url)
    .then (response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error (response.statusText);
    })
    .then(responseJson => displayResults(responseJson, limit))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm(){
  $('form').submit(event => {
    event.preventDefault();

    //capture value of user input
    const searchTerm = $('#js-nps-entry').val();
    const limit = $('#js-max-results').val();

    getParks('', searchTerm.split(', '), limit);
  });
}

$(watchForm);