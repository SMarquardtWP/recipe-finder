'use strict'

const SETTINGS = {
    headers: {
        'X-RapidAPI-Key': '96256b7920msh83769b864ea6c5ep1396eejsn338f4bd8a887'
    }
};
const BASE_URL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes';

//generates a list of all fetched recipes and displays them for the user
function displayRecipe(jsonRecipe) {
    console.log(jsonRecipe);
    $('.recipeResults').append(`
    <h4>${jsonRecipe.title}</h4>
    <img src='${jsonRecipe.image}'>
    <a href='${jsonRecipe.sourceUrl}'>${jsonRecipe.sourceUrl}</a><br>`);
}

/*-----------------------------------------------------------------------*/
/*-------------------Recipe retrieval functions -------------------------*/
/*-----------------------------------------------------------------------*/

//accesses API to retrieve a single random recipe for user. Only filters by cuisine
function randomRecipe() {
    fetch(`${BASE_URL}/random?number=1`, SETTINGS)
        .then(response => response.json())
        .then(responseJson => displayRecipe(responseJson.recipes[0]));
}

//accesses API to get information about different recipes based on advanced data received from user
function advancedRecipes(cuisine, query, ingredients) {
    console.log(ingredients);
    fetch(`${BASE_URL}/searchComplex?query=${query}&cuisine=${cuisine}&includeIngredients=${ingredients}&ranking=1`, SETTINGS)
        .then(response => response.json())
        .then(responseJson => findRecipeByID(responseJson, displayRecipe));
}

//accesses API to get information about different recipes based on basic data received from user
function basicRecipes(cuisine, query) {
    fetch(`${BASE_URL}/search?cuisine=${cuisine}&number=10&offset=0&query=${query}`, SETTINGS)
        .then(response => response.json())
        .then(responseJson => findRecipeByID(responseJson, displayRecipe));
}

//takes recipe ID found by either basicRecipes or advancedRecipes and looks up more detailed information, then calls for it to be displayed
function findRecipeByID(responseJsonID, callback) {
    for (let i = 0; i < responseJsonID.results.length; i++) {
        fetch(`${BASE_URL}/${responseJsonID.results[i].id}/information`, SETTINGS)
            .then(response => response.json())
            .then(responseJson => callback(responseJson));
    }
}

/*-----------------------------------------------------------------------*/
/*--------------form watching and data formatting functions -------------*/
/*-----------------------------------------------------------------------*/

// combines ingredients list from Clean Out the Pantry form into one string to be inserted into url, returns string
function formatIngredients() {
    let ingredientsList = '';
    let ingredient = '';
    for (let i = 0; i < 5; i++) {
        ingredient = $('.cleanPantry').find('input').eq(i).val();
        if (ingredient != '') {
            ingredientsList += '%2+' + ingredient;
        }
    }
    return ingredientsList;
}

function watchBasic() {
    $('.search1').click(event => {
        event.preventDefault();
        $('.recipeResults').empty();
        let cuisine = $('.cuisineTypes').children("option:selected").val();
        let query = $('.queries').val();
        basicRecipes(cuisine, query);
    });
}

function watchIngredients() {
    $('.search2').click(event => {
        event.preventDefault();
        $('.recipeResults').empty();
        let cuisine = $('.cuisineTypes').children("option:selected").val();
        let query = $('.queries').val();
        let ingredients = formatIngredients();
        advancedRecipes(cuisine, query, ingredients);
    });
}

function watchRandom() {
    $('.search3').click(event => {
        event.preventDefault();
        $('.recipeResults').empty();
        randomRecipe();
    });
}

function watchAllForms() {
    watchBasic();
    watchIngredients();
    watchRandom();
}

watchAllForms();
