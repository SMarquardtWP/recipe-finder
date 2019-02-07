'use strict'

const apiKey = '96256b7920msh83769b864ea6c5ep1396eejsn338f4bd8a887';

/*
const baseURL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search?diet=vegetarian&excludeIngredients=coconut&intolerances=egg%2C+gluten&number=10&offset=0&type=main+course&query=burger'

'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=5&ranking=1&ingredients=apples%2Cflour%2Csugar'

'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?number=1&tags=vegetarian%2Cdessert'
*/

const options = {
    headers: new Headers({ 'X-RapidAPI-Key': apiKey })
};

function formatQuery(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//generates a list of all fetched recipes and displays them for the user
function displayRecipe(jsonRecipe) {

}

//accesses API to retrieve a single random recipe for user. Only filters by cuisine
function randomRecipe() {

}

//accesses API to get information about different recipes based on advanced data received from user
function advancedRecipes() {

}

//accesses API to get information about different recipes based on basic data received from user
function basicRecipes() {

}

//receives input from watchForms, determines what type of search the user wanted to do, then calls appropriate function
function determineSearchType() {

}

//watches for form submissions
function watchForms() {
    $('.recipeSearch').on('click', determineSearchType)

}