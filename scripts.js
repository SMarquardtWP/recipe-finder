'use strict'

const SETTINGS = {
    headers: {
        'X-RapidAPI-Key': '96256b7920msh83769b864ea6c5ep1396eejsn338f4bd8a887'
    }
};

const BASE_URL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes';

function formatQuery(params) {

}

//generates a list of all fetched recipes and displays them for the user
function displayRecipe(jsonRecipe) {
    $('.recipeResults').append(`
    <img src='${jsonRecipe.image}' alt='${jsonRecipe.alt}'>
    <a href='${jsonRecipe.url}'>${jsonRecipe.url}</a><br>`)
}

//accesses API to retrieve a single random recipe for user. Only filters by cuisine
function randomRecipe() {

}

//accesses API to get information about different recipes based on advanced data received from user
function advancedRecipes(url, cuisine, query, ingredients) {
    fetch(`${url}/search?cuisine=${cuisine}&number=10&offset=0&query=${query}`, SETTINGS)
    .then(response => response.json())
    .then(responseJson => callback(responseJson));
}

//accesses API to get information about different recipes based on basic data received from user
function basicRecipes(url, cuisine, query) {
    fetch(`${url}search?cuisine=${cuisine}&number=10&offset=0&query=${query}`, SETTINGS)
    .then(response => response.json())
    .then(responseJson => findRecipeByID(url, responseJson));
}

function findRecipeByID(url,responseJsonID) {
    for(let i =0; i<responseJsonID.results.length; i++)
    fetch(`${url}/${responseJsonID.results[i].id}/information`, SETTINGS)
        .then(response => response.json())
        .then(responseJson => displayRecipe(responseJson));
}

//watches for form submissions
function watchBasic() {
    $('basicSearch').submit(event => {
        let url = BASE_URL;

        let cuisine = $('.cuisineTypes').children("option:selected").val();
        let query = $('.queries').val();

        findRecipeByID(url,recipeID);
    });
}

function formatIngredients(){
    let ingredients= '';
    for (let i=0; i<5; i++){
        if ($('cleanPantry').find('input').eq(i).val == ''){
            ingredients = `${ingredients}%2c${'cleanPantry'.find('input').eq(i).val}`
        }
    }
    return ingredients;
}

function watchIngredients() {
    $('cleanPantry').submit(event => {
        let url = BASE_URL + 'search?diet=vegetarian&query=burger&excludeIngredients=coconut&intolerances=egg,gluten&number=10&offset=0';

        let cuisine = $('.cuisineTypes').children("option:selected").val();
        let query = $('.queries').val();
        let ingredients = formatIngredients();

        findRecipeByID(url, getBySearch)
    })
}

function watchRandom() {
    $('randomRecipe').submit(event => {
        let url = BASE_URL + 'additional'
    })
}

function watchAllForms() {
    watchBasic();
    watchIngredients();
    watchRandom();
}

watchAllForms();
