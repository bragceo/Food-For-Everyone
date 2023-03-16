// Set up global variables
const apiKey = 'zx1VZlQltbz1kB0xXAhJkdkPlKlwxvxlaj_g2QPEv6H5rLPkkccl6fs2LXUws5vZQZYnF4PADaO7BFeUDqfkDqvsvwvAAtBOCq-gUSIdbpcxXeJWNcL4BxDqAx8FZHYx';
const apiURL = 'https://corsproxy.io/?https://api.yelp.com/v3/businesses/search';
const defaultLocation = 'New York City';
const defaultRadius = 1609; // 1 mile in meters
const spoonacularKey = '8c8d8ffa5e3b4633bde62c51888d6623';
const spoonacularURL = 'https://api.spoonacular.com/recipes/findByIngredients';
const openMenuURL = 'https://openmenu.com/api/v2/location.php';
const omKey = '30be1698-bcee-11ed-bee9-525400552a35';

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
  const response = await fetch(`${openMenuURL}?key=${omKey}&city=${defaultLocation}&postal_code=${location}&country=${"US"}`, {
    method: 'GET',
  });
  const data = await response.json();
  return data.response.result.restaurants;
}

// Function to handle OpenMenu API request
async function getMenuItems(restaurantId, allergies) {
  const response = await fetch(`https://openmenu.com/api/v2/restaurant.php?key=${omKey}&id=${restaurantId}`, {
  });
  let data = await response.json();
  data = data.response.result;

  const yelpSearch = await fetch(`${apiURL}?term=${data.restaurant_info.restaurant_name}&longitude=${data.restaurant_info.longitude}&latitude=${data.restaurant_info.latitude}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const yelpData = await yelpSearch.json();

  const yelpBusinessID = yelpData.businesses[0].id;
  const yelpBusinessResponse = await fetch(`https://corsproxy.io/?https://api.yelp.com/v3/businesses/${yelpBusinessID}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  const yelpBusinessData = await yelpBusinessResponse.json();

  let addr = data.restaurant_info.address_1 ? data.restaurant_info.address_1 + ',' : '';
  let photos = '<div class="photos is-flex is-align-items-center is-justify-content-center">';
  yelpBusinessData.photos.forEach(photo => {
    photos += `<div class="card m-3"><img src="${photo}" alt="${yelpBusinessData.name}" style="height: 300px; width: auto;"></div>`;
  });
  photos += '</div>';

  let stars = '';
  for (let i = 0; i < yelpBusinessData.rating; i++) {
    stars += '⭐';
  }

  let categories = '';
  yelpBusinessData.categories.forEach(category => {
    categories += `<span class="tag mx-2 is-success">${category.title}</span>`;
  });

  let transactions = '';
  yelpBusinessData.transactions.forEach(transaction => {
    transactions += `<span class="tag mx-2 is-info">${transaction}</span>`;
  });

  placeInfo.innerHTML = `
    <div class="is-flex is-align-items-center is-justify-content-center is-flex-direction-column my-3">
    <h3 class='has-text-success my-3 is-size-2'>${data.restaurant_info.restaurant_name}</h3>
    <p class="mt-1">${data.restaurant_info.brief_description}</p>
    <p class="mt-1">${addr} ${data.restaurant_info.city_town} ${data.restaurant_info.state_province}</p>
    <p class="mt-1">${stars}</p>
    <p class="mt-2">${categories}</p>
    <p class="mt-2">${transactions}</p>
    </div>
    ${photos}
    <div id="map" style="height: 400px; width: ${screen.width * 0.8}px; margin: auto;"></div>
    <button class="back-btn button is-success is-outlined mt-3">Back to Search Results</button>
    <button class="items-btn button is-success is-outlined mt-3">View Items</button>
    `;

  placeInfo.classList.remove('is-hidden');
  resultsList.classList.add('is-hidden');

  let lat = data.restaurant_info.latitude;
  let lng = data.restaurant_info.longitude;
  let map = L.map('map').setView([lat, lng], 16);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 23
  }).addTo(map);

  let marker = L.marker([lat, lng]).addTo(map);

  const menus = data.menus;
  return menus;
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
      resultItem.style.width = '300px';
      let addr = result.address_1 ? result.address_1 + ', ' : '';
      resultItem.innerHTML = `
        <h3 class='has-text-success my-3'>${result.restaurant_name}</h3>
        <span class="tag mx-2 is-success">${result.cuisine_type_primary}</span>
        <p class="my-2">${result.brief_description}</p>
        <p class="my-2">${addr}${result.city_town}, ${result.state_province}</p>
        <button class="menu-btn button is-success is-outlined" data-id="${result.id}">View Restaurant</button>
      `;
      resultsList.appendChild(resultItem);
    });
  }
}

// Function to render menu items
function renderMenuItems(menuItems) {
  console.log("Menu Items: ", menuItems);

  menuList.innerHTML = '';
  if (menuItems.length === 0) {
    menuList.innerHTML = '<p>No menu items found</p>';
  } else {
    menuItems[0].menu_groups.forEach(menuItem => {
      menuList.innerHTML += `<h2 class='has-text-info my-3 is-size-2'>${menuItem.group_name}</h2>`;
      const menuGroup = document.createElement('div');
      menuGroup.classList.add('menu-group');
      menuGroup.classList.add('has-text-centered');
      menuGroup.classList.add('p-4');
      menuGroup.classList.add('m-auto');
      menuGroup.classList.add('is-flex');
      menuGroup.classList.add('is-flex-wrap-wrap');
      menuGroup.classList.add('is-justify-content-center');
      menuGroup.style.width = '100%';
      console.log(menuItem);

      menuItem.menu_items.forEach(item => {
        let userAllergens = allergiesInput.value.split(',');

        let allergenPresent = false;
        userAllergens.forEach(allergen => {
          if (item.menu_item_allergy_information_allergens && (item.menu_item_allergy_information_allergens).lower().includes(allergen.lower())) {
            allergenPresent = true;
          }
        });
        userAllergens.forEach (allergen =>{ 
          if (item.menu_item_description.includes(allergen)){
            allergenPresent = true;
          }

        })

      //   const filteredMenus = menus.filter(item => {
      //     let allergenPresent = false;
      
      //     const menu_groups = item.menu_groups;
      //     menu_groups.forEach(group => {
      //         const items = group.menu_items;
      //         items.forEach(food => {
      //             if(food.menu_item_allergy_information.includes(allergies.join(""))) {
      //                 allergenPresent = true;
      //             }
      //         })
      //     })
      
      //     return !allergenPresent;
      //   })
      
      //   return filteredMenus;
      // }
        

        if (!allergenPresent) {
          const menuItemItem = document.createElement('div');
          menuItemItem.classList.add('menu-item');
          menuItemItem.classList.add('card');
          menuItemItem.classList.add('card-body');
          menuItemItem.classList.add('has-text-centered');
          menuItemItem.classList.add('p-5');
          menuItemItem.classList.add('m-3');
          menuItemItem.style = 'width: 320px;';
          menuItemItem.innerHTML = `
          <h3 class='has-text-success my-3 is-size-5'>${item.menu_item_name}</h3>
          <p class="my-2">${item.menu_item_description}</p>
          ${item.gluten_free && item.gluten_free != '0' ? '<span class="tag m-2 is-success">Gluten Free</span>' : ''}
          ${item.vegetarian && item.vegetarian != '0' ? '<span class="tag m-2 is-success">Vegetarian</span>' : ''}
          ${item.vegan && item.vegan != '0' ? '<span class="tag m-2 is-success">Vegan</span>' : ''}
          ${item.halal && item.halal != '0' ? '<span class="tag m-2 is-success">Halal</span>' : ''}
          ${item.kosher && item.kosher != '0' ? '<span class="tag m-2 is-success">Kosher</span>' : ''}
          ${item.menu_item_allergy_information ? '<p class="my-2">Allergy Information: ' + item.menu_item_allergy_information + '</p>' : ''}
          ${item.menu_item_allergy_information_allergens ? '<p class="my-2">Allergens: ' + item.menu_item_allergy_information_allergens + '</p>' : ''}
        `;
          menuGroup.appendChild(menuItemItem);
        }
      })
      menuList.appendChild(menuGroup);
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
    //const menuItems = await getMenuItems(restaurantId, allergiesInput.value.split(',').map(allergy => allergy.trim()));
    const menuItems = await getMenuItems(restaurantId);
    //const allergiesArr = allergiesInput.value.split(',').map(allergy => allergy.trim())
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