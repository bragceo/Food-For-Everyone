// Set up global variables
const apiKey = 'zx1VZlQltbz1kB0xXAhJkdkPlKlwxvxlaj_g2QPEv6H5rLPkkccl6fs2LXUws5vZQZYnF4PADaO7BFeUDqfkDqvsvwvAAtBOCq-gUSIdbpcxXeJWNcL4BxDqAx8FZHYx';
const apiURL = 'https://api.yelp.com/v3/businesses/search';
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


// Function to handle Yelp API request
async function getRestaurants(location, radius, allergies) {
 const response = await fetch(`${apiURL}?location=${location}&radius=${radius}&categories=restaurants&term=${allergies.join(' ')}&sort_by=rating&limit=10`, {
   headers: {
     'Authorization': `Bearer ${apiKey}`
   }
 });
 const data = await response.json();
 return data.businesses;
}


// Function to handle Spoonacular API request
async function getMenuItems(restaurantId, allergies) {
 const response = await fetch(`https://api.yelp.com/v3/businesses/${restaurantId}/reviews`, {
   headers: {
     'Authorization': `Bearer ${apiKey}`
   }
 });
 const data = await response.json();
 const menuItems = data.reviews.filter(review => {
   return allergies.every(allergy => !review.text.toLowerCase().includes(allergy));
 });
 const menuItemIds = menuItems.map(menuItem => menuItem.menuItemId);
 const menuItemResponse = await fetch(`${spoonacularURL}?apiKey=${spoonacularKey}&ingredients=${menuItemIds.join(',')}&ranking=1&ignorePantry=true`);
 const menuItemData = await menuItemResponse.json();
 return menuItemData;
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
     resultItem.innerHTML = `
       <h3>${result.name}</h3>
       <p>${result.location.address1}, ${result.location.city}</p>
       <button class="menu-btn" data-id="${result.id}">View Menu</button>
     `;
     resultsList.appendChild(resultItem);
   });
 }
}


// Function to render menu items
async function renderMenuItems(menuItems) {
   resultsList.innerHTML = '';
   if (menuItems.length === 0) {
     resultsList.innerHTML = '<p>No menu items found</p>';
   } else {
     const menuItemIds = menuItems.map(menuItem => menuItem.id);
     const menuItemResponse = await fetch(`${spoonacularURL}/informationBulk?apiKey=${spoonacularKey}&ids=${menuItemIds.join(',')}&includeNutrition=false`);
     const menuItemData = await menuItemResponse.json();
     menuItemData.forEach(menuItem => {
       const menuItemItem = document.createElement('div');
       menuItemItem.classList.add('menu-item');
       menuItemItem.innerHTML = `
         <h3>${menuItem.title}</h3>
         <p>Ready in ${menuItem.readyInMinutes} minutes</p>
         <img src="${menuItem.image}" alt="${menuItem.title}">
       `;
       resultsList.appendChild(menuItemItem);
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
     await renderMenuItems(menuItems);
   }
 });
