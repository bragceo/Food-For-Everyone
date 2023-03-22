# Food-For-Everyone

## Description 

Food For Everyone is an innovative app that helps people with dietary restrictions and allergies find restaurants that can cater to their needs. With Food For Everyone, users can easily search for restaurants in their area, view menus and allergy information, and even order their meals directly through the app. Our platform empowers people to enjoy dining out without the stress and uncertainty of finding safe and suitable options. Whether you have celiac disease, are vegan, or have any other dietary needs, Food For Everyone is here to make your dining experience stress-free and enjoyable.


## Audience: 

How Many People Have Food Allergies? Researchers estimate that 32 million Americans have food allergies, including 5.6 million children under age 18. That’s one in 13 children, or roughly two in every classroom. As such, this application addresses a very important need.


## User Story

As a user with food allergies,
I want to be able to search for restaurants that offer safe menu options,
So that I can enjoy a meal without risking an allergic reaction.

## Acceptance Criteria

Given that I have entered my location and food allergies into the search bar,
When I hit the search button,
Then I should be presented with a list of restaurants that offer safe menu options.
Given that I have selected a specific restaurant from the list,
When I click on the restaurant’s name,
Then I should be taken to a page with detailed information about the restaurant’s menu and allergen information.
Given that I have marked a restaurant as a favorite,
When I view my favorites list, then I should see the restaurant’s name and location.

## Deployed URL

To acces the Food-For-Everyone application site please click [here](https://whirlwindraven.github.io/Food-For-Everyone/)

## How the Code Works

HTML

The HTML code provides the structure and content of the website. It consists of a series of tags that define different elements of the website, such as headings, paragraphs, images, and links.

At the top of the HTML document, you'll typically see the <!DOCTYPE> declaration, which tells the web browser which version of HTML the document is using. This is followed by the <html> tag, which defines the root element of the document. Within the <html> tag, you'll typically see the <head> and <body> tags.

The <head> tag contains metadata about the document, such as the title of the page, any scripts or stylesheets that need to be included, and other information that's not visible on the webpage itself. The <body> tag contains the visible content of the webpage.

Within the <body> tag, you'll typically see a series of nested tags that define the structure and content of the webpage. For example, you might have a <header> tag that contains the logo and navigation menu, followed by a series of <section> tags that contain different sections of the webpage, such as an about us section, a services section, and so on.

Each HTML tag has a specific purpose and can contain various attributes and properties that control how it's displayed on the webpage. The HTML code for the Food for Everyone website uses a variety of different tags and attributes to create a well-structured and visually appealing webpage.

One important feature of HTML is the use of tags to create links to other webpages, images, or files. The <a> tag is used to create hyperlinks, and it can be given an href attribute that specifies the URL of the page or file to link to.

Images can be included in an HTML document using the <img> tag, which is also given an src attribute that specifies the URL of the image file. The alt attribute can be used to provide a text description of the image for accessibility purposes.

HTML also allows for the use of forms, which enable users to enter information and submit it to the website. The <form> tag is used to create a form, and it can contain a variety of different input fields, such as text boxes, checkboxes, radio buttons, and dropdown menus. When the user submits the form, the data is typically sent to a server-side script that processes it and performs some action based on the input.

Javascript 

The JavaScript code begins by declaring several global variables, including API keys, API endpoints, default location and radius values, and DOM elements.

Next, the code defines two main functions: getRestaurants() and getMenuItems(). The getRestaurants() function uses the OpenMenu API to retrieve a list of restaurants based on the user's search location, radius, and any allergy preferences. The function sends an HTTP GET request to the OpenMenu API endpoint and retrieves a JSON response containing a list of restaurants.

The getMenuItems() function uses the OpenMenu API to retrieve a list of menu items for a specific restaurant. The function sends an HTTP GET request to the OpenMenu API endpoint and retrieves a JSON response containing the menu data. The function then uses the retrieved data to create a dynamic HTML content that displays information about the restaurant, such as its name, address, rating, and images, and a list of menu items for that restaurant.

The code also includes several smaller functions that handle specific tasks, such as displayMenuItems(), which displays the menu items for a selected restaurant, and renderResults(), which renders the search results in a dynamically generated HTML list.

The JavaScript code listens for various user events on the webpage, such as form submissions and button clicks, and responds by calling the appropriate function or manipulating the DOM directly.



## Screenshot of the Food-For-Everyone 
Sample of the Food-For-Everyone application shown below video




https://user-images.githubusercontent.com/119948453/226770385-c9ac2b99-f346-4771-9629-363955f46e90.mov









## Authors 

edX bootcamps LLC<br>
Fady Khalil<br>
Lavell Juan<br>
Kyle Chaufixe

## Credits 

N/a

## Liscense 

Please refer to liscense in repo 
