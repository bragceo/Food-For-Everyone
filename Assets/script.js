// Set up global variables
const apiKey = 'zx1VZlQltbz1kB0xXAhJkdkPlKlwxvxlaj_g2QPEv6H5rLPkkccl6fs2LXUws5vZQZYnF4PADaO7BFeUDqfkDqvsvwvAAtBOCq-gUSIdbpcxXeJWNcL4BxDqAx8FZHYx';
const apiURL = 'https://corsproxy.io/?https://api.yelp.com/v3/businesses/search';
const defaultLocation = 'New York City';
const defaultRadius = 1609; // 1 mile in meters
const spoonacularKey = '8c8d8ffa5e3b4633bde62c51888d6623';
const spoonacularURL = 'https://api.spoonacular.com/recipes/findByIngredients';


// DOM elements
const form = document.querySelector('#search-form');
const locationInput = document.querySelector('#location');
const radiusInput = document.querySelector('#radius');
const allergiesInput = document.querySelector('#allergies');
const resultsList = document.querySelector('#results-list');
const placeInfo = document.querySelector('#place-info');
const menuList = document.querySelector('#menu-list');
const menuListContainer = document.querySelector('.menu-list-container');


// Function to handle Yelp API request
async function getRestaurants(location, radius, allergies) {
 const response = await fetch(`${apiURL}?location=${location}&radius=${radius}&categories=restaurants&term=${allergies.join(' ')}&sort_by=rating&limit=10`, {
   method: 'GET',
   headers: {
     'accept': 'application/json',
     'Authorization': `Bearer ${apiKey}`
   }
 });
 const data = await response.json();
 return data.businesses;
}


// Function to handle Spoonacular API request
async function getMenuItems(restaurantId, allergies) {
 const response = await fetch(`https://corsproxy.io/?https://api.yelp.com/v3/businesses/${restaurantId}`, {
   headers: {
     'Authorization': `Bearer ${apiKey}`
   }
 });
 const data = await response.json();
 let addr = data.location.address1 ? data.location.address1 + ',' : '';
 let photos = '<div class="photos is-flex is-align-items-center is-justify-content-center">';
 data.photos.forEach(photo => {
   photos += `<div class="card m-3"><img src="${photo}" alt="${data.name}" style="height: 300px; width: auto;"></div>`;
 });
 photos += '</div>';


 let stars = '';
 for (let i = 0; i < data.rating; i++) {
   stars += '⭐';
 }


 let categories = '';
 data.categories.forEach(category => {
   categories += `<span class="tag mx-2 is-success">${category.title}</span>`;
 });


 let transactions = '';
 data.transactions.forEach(transaction => {
   transactions += `<span class="tag mx-2 is-info">${transaction}</span>`;
 });


 placeInfo.innerHTML = `
   <div class="is-flex is-align-items-center is-justify-content-center is-flex-direction-column my-3">
   <h3 class='has-text-success my-3 is-size-2'>${data.name}</h3>
   <p class="mt-1">${addr} ${data.location.city} ${data.location.zip_code}</p>
   <p class="mt-1">${stars}</p>
   <p class="mt-2">${categories}</p>
   <p class="mt-2">${transactions}</p>
   </div>
   ${photos}
   <button class="back-btn button is-success is-outlined mt-3">Back to Search Results</button>
   <button class="items-btn button is-success is-outlined mt-3">View Items</button>
   `;


 placeInfo.classList.remove('is-hidden');
 resultsList.classList.add('is-hidden');


 const restaurantTags = data.categories.map(category => category.title);


 const menuItemResponse = await fetch(`${spoonacularURL}?apiKey=${spoonacularKey}&ingredients=${restaurantTags.join(',')}&ranking=1&ignorePantry=true`);
 const menuItemData = await menuItemResponse.json();
 console.log(menuItemData);
 return menuItemData;
}


//displayMenu
function displayMenuItems() {
 menuListContainer.classList.remove('is-hidden');
 placeInfo.classList.add('is-hidden');
}


// Function to render search results
function renderResults(results) {
 resultsList.innerHTML = '';
 if (results.length === 0) {
   resultsList.innerHTML = '<p>No results found</p>';
 } else {
   results.forEach(result => {
     const resultItem = document.createElement('div');
     resultItem.classList.add('result-item');
     resultItem.classList.add('card');
     resultItem.classList.add('card-body');
     resultItem.classList.add('has-text-centered');
     resultItem.classList.add('p-5');
     resultItem.classList.add('m-3');
     resultItem.classList.add('is-flex');
     resultItem.classList.add('is-flex-direction-column');
     resultItem.classList.add('is-justify-content-space-evenly');
     resultItem.classList.add('is-align-items-center');
     let addr = result.location.address1 ? result.location.address1 + ', ' : '';
     resultItem.innerHTML = `
       <h3 class='has-text-success my-3'>${result.name}</h3>
       <img src="${result.image_url}" alt="${result.name}" style="height: 200px; width: auto;">
       <p class="my-2">${addr}${result.location.city}</p>
       <button class="menu-btn button is-success is-outlined" data-id="${result.id}">View Restaurant</button>
     `;
     resultsList.appendChild(resultItem);
   });
 }
}


// Function to render menu items
function renderMenuItems(menuItems) {
 menuList.innerHTML = '';
 if (menuItems.length === 0) {
   menuList.innerHTML = '<p>No menu items found</p>';
 } else {
   menuItems.forEach(menuItem => {
     let contains = '';
     menuItem.usedIngredients.forEach(ingredient => {
       contains += `<span class="tag mx-2 is-success is-capitalized">${ingredient.name}</span>`;
     });
     const menuItemItem = document.createElement('div');
     menuItemItem.classList.add('menu-item');
     menuItemItem.classList.add('card');
     menuItemItem.classList.add('card-body');
     menuItemItem.classList.add('has-text-centered');
     menuItemItem.classList.add('p-5');
     menuItemItem.classList.add('m-3');
     menuItemItem.style = 'width: 320px;';
     menuItemItem.innerHTML = `
       <h3 class='has-text-success my-3 is-size-5'>${menuItem.title}</h3>
       <p>Contains: ${contains}</p>
       <img src="${menuItem.image}" alt="${menuItem.title}" style="height: 250px; width: auto;" class="my-3">
     `;
     menuList.appendChild(menuItemItem);
   });
 }
}




// Event listener for search form submission
form.addEventListener('submit', async (e) => {
 e.preventDefault();
 const location = locationInput.value || defaultLocation;
 const radius = radiusInput.value || defaultRadius;
 const allergies = allergiesInput.value.split(',').map(allergy => allergy.trim());
 const restaurants = await getRestaurants(location, radius, allergies);
 renderResults(restaurants);
});


// Event listener for menu button click
resultsList.addEventListener('click', async (e) => {
 if (e.target.classList.contains('menu-btn')) {
   const restaurantId = e.target.dataset.id;
   const menuItems = await getMenuItems(restaurantId, allergiesInput.value.split(',').map(allergy => allergy.trim()));
   renderMenuItems(menuItems);
 }
});


placeInfo.addEventListener('click', (e) => {
 if (e.target.classList.contains('back-btn')) {
   placeInfo.classList.add('is-hidden');
   resultsList.classList.remove('is-hidden');
 }
});


placeInfo.addEventListener('click', (e) => {
 if (e.target.classList.contains('items-btn')) {
   displayMenuItems();
 }
});


menuListContainer.addEventListener('click', (e) => {
 if (e.target.classList.contains('back-btn')) {
   menuListContainer.classList.add('is-hidden');
   placeInfo.classList.remove('is-hidden');
 }
});

