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



// Function to render menu items
function renderMenuItems(menu) {
    resultsList.innerHTML = '';
if (menuItems.length === 0) (
    resultsList.innerHTML = <p>No menu items found</p>;
)
console.log "renderMenuItems"
    else (
        const menuItemIds = menuItems.map (menuItem => menuItem.Id);
        const menuItemResponse = await

    )
)
}
  
  