# ✈️Never Travel Board✈️

## **User Story**
As a travel enthusiast seeking new experiences,
I want to store setauls about my trip destinations and specific places within those locations,
so that I can plan my itinerary effectively and maximize my travel experiences.

|<span style="color:lightgreen;">**I Want...**</span>                  |<span style="color:lightgreen;">**So that...**</span>                                      |
|----------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
|To be able to have all my travel destinations in once place |  I can see my pinned places to visit within my travel destinations.                                        |

|<span style="color:red;">**When...**</span>                           |<span style="color:red;">**Then...**</span>                                                |
|----------------------------------------------------------------------|--------------------------------------------------------------
|                  I click "New Trip"                                  |     I can input my travel destination                             |
|                                       I can place filters on the travel destinations          |         I will be prompted with places in regaurd to those filters                                  |
|                   I save the locations i like                                |        I have them stored in my travel destination board              |

---

## Key Features
-Centralized Trip Organization: Keeping your destinatins and places in those destinations in one organized place.
-Seamless Itinerary Planning: Creating a comprehensive itinerary with ease, ensuring you font miss out on any of the attractions you would like to see.
-Maximized Travel Experiences: Having the places saved in the destination board. 
-Efficient Time Management: Reducing unnecessary travel time.
-Stress-Free Planning Process: Minimize stress and uncertainty during travel planning by having a clear overview of your trip itinerary.

### Base Logic
You are firstly prompted at the homescreen, this is going to show you your saved travel destination board. If the user would like to make a new travel board, there is a "Create a New Board" button that the user can press to do so. Once a new travel board has been created, the user can click on it and naviagte to that board's management page. The user can enter a Search Destination to select a general destination. There will also be a Filters search bar that the user can make to narrow down the search for places in said destination.\n
Once places have been chosen by the user, they will be tacked on the destination board, keeping it all in one seamless place!

#### Managing boards
- A user is prompted to log in or sign up.
- A user that logged in or just signed up will be taken to the Profile page.

#### Profile Page
- Boards can be created and deleted in the Profile page.
- Creating a new board will add it to the "Manage boards" list.
- Clicking on a board in the "Manage Boards" list will take the user to the boards page.

#### Boards Page
- The board page lists all the other users that can modify the board
- Entering a new username and clicking "Add" will add that user to access the board
- The board page lists all the chosen locations, its name, and its coordinates
- Each location can be deleted by clicking on the trash can icon.

- The board page contains a Google map centered around the Search Destination
- The locations chosen will be rendered on blue map markers on the map

- Entering a Search Destination, Search Filter, will search all the specified filters around the destination from Goolge Places.
- All searched locations are added to the board by default. Users need to delete locations that they do not want

#### Home Page
- Clicking on the "Never Travel Board" heading will take the user to the homepage, which renders all locations.


## API Used
[Google Places and Maps API](RESOURCES.md#APIs)

### Photo
<img src="public/images/never-travel-board-app.png" alt="never-travel-board-application-homepage-screenshot"/>

## Deployed Application
https://never--travel--board-e4faca7bab5b.herokuapp.com/login

## Resources

Click below for Database Diagrams and API information\
[RESOURCES.md](RESOURCES.md)

## Installation

Click [here](INSTALL.md) for installation instructions.

## Credits
Special thanks to Andrea Presto, Mark Alfano, and Hubert Nguyen for assistance in the debugging process and for providing base code to model our project off of. Also made use of the Xpert Learning Assistant tool. 

## License
This project is covered under the MIT license
