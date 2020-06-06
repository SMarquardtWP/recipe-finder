'use strict'

const SETTINGS = {
    headers: {
        'X-RapidAPI-Key': 'SPOONACULAR_KEY'
    }
};
const BASE_URL = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes';

//generates a list of all fetched recipes and displays them for the user
function displayRecipe(jsonRecipe) {
    console.log(jsonRecipe);
    $('.recipeResults').removeClass('hidden');
    if (jsonRecipe.code != 404) {
        $('.recipeResults').append(`
    <div class='recipe'>
        <h4>${jsonRecipe.title}</h4>
        <img src='${jsonRecipe.image}'><br>
        <a href='${jsonRecipe.sourceUrl}' target="_blank">${jsonRecipe.sourceUrl}</a>
    </div>`);
    }
}

/*-----------------------------------------------------------------------*/
/*-------------------Recipe retrieval functions -------------------------*/
/*-----------------------------------------------------------------------*/

//accesses API to retrieve a single random recipe for user, then calls for it to be displayed
function randomRecipe() {
    fetch(`${BASE_URL}/random?number=1`, SETTINGS)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayRecipe(responseJson.recipes[0]))
        .catch(err => {
            $('.requestErrorMessage').text(`Sorry, something seems to have gone wrong: $err.message}`);
        });
}

//accesses API to get information about different recipes based on advanced data received from user, displays error message if there is an issue handling the request, displays notification if no results were found with specified search terms
function advancedRecipes(cuisine, query, ingredients) {


    if (ingredients == ''){
        $('.ingErrorMessage').html('<p>Please input at least one ingredient</p>');
        $('.ingErrorMessage').removeClass('hidden');
    }
    else {
        $('.errorText').addClass('hidden');
        fetch(`${BASE_URL}/searchComplex?query=${query}&cuisine=${cuisine}&includeIngredients=${ingredients}&ranking=1&limitLicense=false`, SETTINGS)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
            })
            .then(responseJson => {
                if (responseJson.results.length == 0) {
                    $('.requestErrorMessage').text('No results were found with the parameters given, please try a different search.');
                    $('.requestErrorMessage').removeClass('hidden');
                }
                else {
                    $('.requestErrorMessage').addClass('hidden');
                    findRecipeByID(responseJson, displayRecipe);
                }
            })
            .catch(err => {
                $('.requestErrorMessage').text(`Sorry, something seems to have gone wrong: $err.message}`);
            });
    }
}

//accesses API to get information about different recipes based on basic data received from user, displays error message if there is an issue handling the request, displays notification if no results were found with specified search terms
function basicRecipes(cuisine, query) {
    fetch(`${BASE_URL}/search?cuisine=${cuisine}&number=10&offset=0&query=${query}`, SETTINGS)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            console.log(responseJson);
            if (responseJson.results.length == 0) {
                $('.requestErrorMessage').text('No results were found with the parameters given, please try a different search.');
                $('.requestErrorMessage').removeClass('hidden');
            }
            else {
                findRecipeByID(responseJson, displayRecipe);
                $('.requestErrorMessage').addClass('hidden');
            }
        })
        .catch(err => {
            $('.requestErrorMessage').text(`Sorry, something seems to have gone wrong: $err.message}`);
        });
}

//takes recipe ID found by either basicRecipes or advancedRecipes and looks up more detailed information, then calls for it to be displayed
function findRecipeByID(responseJsonID, callback) {
    for (let i = 0; i < responseJsonID.results.length; i++) {
        fetch(`${BASE_URL}/${responseJsonID.results[i].id}/information`, SETTINGS)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error(response.statusText);
            })
            .then(responseJson => callback(responseJson))
            .catch(err => {
                $('..requestErrorMessage').text(`Sorry, something seems to have gone wrong: $err.message}`);
            });
    }
}

/*-----------------------------------------------------------------------*/
/*--------------form watching and data formatting functions -------------*/
/*-----------------------------------------------------------------------*/

// combines ingredients list from Clean Out the Pantry form into one string to be inserted into url, returns string
function formatIngredients() {
    let ingredientsList = '';
    let ingredient = '';
    for (let i = 0; i < 6; i++) {
        ingredient = $('.cleanPantry').find('input').eq(i).val();
        if (ingredient != '') {
            ingredientsList += '%2c+' + ingredient;
        }
    }
    return ingredientsList;
}

//below functions watch for form submissions
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
