/* Importing the model.js file. */
import * as MODEL from "./model.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, setPersistence, browserSessionPersistence, onAuthStateChanged } 
 from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getDatabase, ref, set, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBXi6HrIrpU9zoZRhijuE12C-_an8BFTZI",
  authDomain: "jungle-cook-ff7.firebaseapp.com",
  projectId: "jungle-cook-ff7",
  storageBucket: "jungle-cook-ff7.appspot.com",
  messagingSenderId: "729734828681",
  appId: "1:729734828681:web:7ee8f1d5cb1b55e383ec58"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);


// Set persistence to in-memory to control session duration manually
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error("Error setting persistence: ", error);
});

//set up our register function
function register(){
  $("#signupBtn").on("click", function (e){
  e.preventDefault();

  let firstName = $("#fName").val();
  let lastName = $("#lName").val();
  let email = $("#email").val();
  let password = $("#password").val();


  if (validate_field(firstName,lastName) == false){
    Swal.fire({
      icon: "error",
      title: "Missing Content Error",
      text: "Please Input Name Field Correctly",
      });
      return
  }

  if (validate_email(email) == false || validate_password(password) == false){
    Swal.fire({
    icon: "error",
    title: "Missing Content Error",
    text: "Please Input Email or Password Correctly",
    });
    return
  }

  createUserWithEmailAndPassword(auth, email, password)
  .then(
    () =>{
      const user = auth.currentUser
      const databaseRef = ref(database, 'users/' + user.uid)
      // var database_ref = database.ref('users/' + user.uid)
      
      var user_data = {
        firstName : firstName,
        lastName : lastName, 
        email : email,
        last_login : Date.now()
      }
            
      Swal.fire("Good job!", "Thanks for Signing Up!", "success");
       // Clear input fields
       $("#fName").val("");
       $("#lName").val("");
       $("#email").val("");
       $("#password").val("");
      //  replaceNav();
       MODEL.changePage("home");
      return set(databaseRef,user_data)
    })
    .catch(function(error){
      const errorMessage = error.message
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
      });
    });
  })
}



function login(){
  $("#logBtn").on("click", function (e){
  e.preventDefault();

  // get all our login fields
  let email = $("#login_em").val();
  let password = $("#login_pw").val();

  if (validate_email(email) == false || validate_password(password) == false){
    Swal.fire({
    icon: "error",
    title: "Missing Content Error",
    text: "Password or Email is incorrect",
    });
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
  .then(function(){
    var user = auth.currentUser
    var database_ref = ref(database, "users/" + user.uid);
    
    var user_data = {
      last_login : Date.now()
    }

    // database_ref.child('users/' + user.uid).update(user_data)
    update(database_ref, user_data).then(() =>{
      Swal.fire("Good job!", "Thanks for Logging In!", "success");
      // replaceNav();
      $("#login_em").val("");
      $("#login_pw").val("");
      MODEL.changePage("home");

    });
  })
  .catch(function(error){
    const errorMessage = error.message
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: errorMessage,
    });
    // console.log(errorMessage)

  })
})
}

function logout() {
  Swal.fire({
    title: "Do you want to Log Out?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, logout!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Logged Out!", "You have successfully logged out!", "success").then(() => {
        signOut(auth).then(() => {
         replaceNav(null)
         MODEL.changePage("home");
        }).catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Logout Failed",
            text: error.message,
          });
        });
      });
    }
  });
}



function replaceNav(user){
  if (user) {
    $(".mainMenu").html(`
      <li><a href="#home">Home</a></li>
      <li><a href="#recipes">Browse</a></li>
      <li><a href="#createrecipe">Create Recipe</a></li>
      <li><a href="#yourrecipe">Your Recipes</a></li>
      <button id="logOut">Logout</button>
      <div class="closeMenu"><i class="fa-sharp fa-solid fa-xmark"></i></div>
    `);
    $("#logOut").on("click", function () {
      logout();
    });
  } else {
    $(".mainMenu").html(`
      <li><a href="#home">Home</a></li>
      <li><a href="#recipes">Browse</a></li>
      <li><a href="#createrecipe">Create Recipe</a></li>
      <li><a href="#login"><button id="login_nav">Login</button></a></li>
      <div class="closeMenu"><i class="fa-sharp fa-solid fa-xmark"></i></div>
    `);
  }

  hamburgerMenuFn();
}

function validate_email(email){
  let expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true){
    return true
  } else {
    return false
  }
}

function validate_password(password){
  if (password.length < 6) {
    return false
  } else{
    return true
  }
}

function validate_field(field){
  if (field == null){
    return false
  } 
  if (field.length <= 0) {
    return false
  } else{
    return true
  }
}

var browseRecipe = [
  {
    image: "../img/recipe-pizza.jpg",
    name: "Supreme Pizza",
    desc: "Make pizza night super duper out of this world with homemade pizza. This recipe is supreme with vegetables and two types of meat. Yum!",
    time: "1h 24min",
    servings: "4 Servings",
    ingredients: [
      "1/4 batch pizza dough",
      "2 tablespoons Last-Minute Pizza Sauce",
      "10 slices pepperoni",
      "1 cup cooked and crumbled Italian sausage",
      "2 large mushrooms, sliced",
      "1/4 bell pepper, sliced",
      "1 tablespoon sliced black olives",
      "1 cup shredded mozzarella cheese",
    ],
    steps: [
      "Preheat the oven to 475°. Spray pizza pan with nonstick cooking or line a baking sheet with parchment paper.",
      "Flatten dough into a thin round and place on the pizza pan.",
      "Spread pizza sauce over the dough.",
      "Layer the toppings over the dough in the order listed.",
      "Bake for 8 to 10 minutes or until the crust is crisp and the cheese melted and lightly browned.",
    ],
  },
  {
    image: "../img/recipe-burger.jpg",
    name: "Classic Burger",
    desc: "Sink your teeth into a delicious restaurant-style, hamburger recipe made from lean beef. Skip the prepackaged patties and take the extra time to craft up your own, and that little extra effort will be worth it.",
    time: "30 Minutes",
    servings: "4 Servings",
    ingredients: [
      "2lbs of ground beef",
      "1 pack age of store-bought hamburger buns",
      "Condiments to taste",
    ],
    steps: [
      "Thaw frozen beef using hot water.",
      "Separate the ground beef into patties",
      "Grill patties on stove-top using vegetable oil until browned to preference",
      "Warm hamburger buns in the microwave for 30 seconds",
      "Construct burger using preferred condiments",
    ],
  },
  {
    image: "../img/recipe-pilaf.jpg",
    name: "Chicken Biryani",
    desc: "Chicken Biryani is a bold and flavorful Indian dish with crazy tender bites of chicken with bell peppers in a deliciously spiced and fragrant rice.",
    time: "1h 15min",
    servings: "4 Servings",
    ingredients: [
      "3 chicken breasts, cut into bite-sized pieces",
      "4 cups basmati rice, rinsed and soaked for 30 minutes",
      "2 full bell peppers, diced",
      "1 large onion, thinly sliced",
      "4 tomatoes, diced",
      "1/2 cup plain yogurt",
      "1/4 cup vegetable oil",
      "1/4 cup ghee (clarified butter)",
      "2 tablespoons ginger-garlic paste",
      "1 tablespoon biryani masala",
      "1 tablespoon ground cumin",
      "1 tablespoon ground coriander",
      "1 tablespoon chili powder",
      "1/2 teaspoon turmeric powder",
      "1/2 teaspoon saffron threads (optional)",
      "1/4 cup warm milk",
      "1/4 cup chopped cilantro (coriander leaves), for garnish",
      "1/4 cup fried onions, for garnish",
      "Salt, to taste",
      "Water, as needed",
    ],
    steps: [
      "In a small bowl, soak saffron threads in warm milk. Set aside.",
      "In a large pot, bring water to a boil. Add salt and soaked basmati rice. Cook rice until it is 70-80% cooked. Drain and set aside.",
      "In a separate large pan or Dutch oven, heat vegetable oil and ghee over medium heat.",
      "Add thinly sliced onions and sauté until golden brown.",
      "Add diced bell peppers and cook for 2-3 minutes until slightly softened.",
      "Add ginger-garlic paste and cook for another 2 minutes until fragrant.",
      "Add chicken pieces to the pan. Cook until the chicken is no longer pink, about 5-7 minutes.",
      "Stir in diced tomatoes and cook until they soften and release their juices.",
      "Add biryani masala, ground cumin, ground coriander, chili powder, turmeric powder, and salt. Mix well to coat the chicken and vegetables.",
      "Reduce the heat to low. Layer half of the partially cooked rice over the chicken mixture.",
      "Sprinkle half of the saffron-infused milk over the rice layer.",
      "Repeat the layering process with the remaining rice and saffron-infused milk.",
      "Cover the pan tightly with a lid or aluminum foil. Cook on low heat for 20-25 minutes until the rice is fully cooked and the flavors meld together.",
      "Once done, gently fluff the biryani with a fork, mixing the layers.",
      "Garnish with chopped cilantro and fried onions.",
      "Serve hot with raita (yogurt sauce) and enjoy your delicious Chicken Biryani!",
    ],
  },
  {
    image: "../img/recipe-chowmein.jpg",
    name: "Ch. Chow Mein",
    desc: "A great Chow Mein comes down to the sauce - it takes more than just soy sauce and sugar! Jam packed with a surprising amount of hidden vegetables, customize this Chicken Chow Mein recipe using your protein of choice!",
    time: "20 Minutes",
    servings: "4 Servings",
    ingredients: [
      "2 chicken breasts, thinly sliced",
      "200g egg noodles",
      "3 tablespoons soy sauce",
      "2 tablespoons oyster sauce",
      "1 tablespoon sesame oil",
      "2 tablespoons vegetable oil",
      "3 cloves garlic, minced",
      "1 tablespoon ginger, minced",
      "2 carrots, julienned",
      "1 bell pepper, thinly sliced",
      "2 cups cabbage, shredded",
      "4 spring onions, chopped",
      "1 cup bean sprouts",
      "Salt, to taste",
      "Black pepper, to taste",
    ],
    steps: [
      "Cook the egg noodles according to package instructions. Drain and set aside.",
      "In a small bowl, mix together soy sauce, oyster sauce, and sesame oil. Set aside.",
      "Heat vegetable oil in a large skillet or wok over medium-high heat.",
      "Add minced garlic and ginger. Stir-fry for 30 seconds until fragrant.",
      "Add thinly sliced chicken breasts to the skillet. Season with salt and black pepper. Cook until chicken is cooked through, about 5-7 minutes.",
      "Push the chicken to one side of the skillet. Add a little more oil if needed, then add julienned carrots, thinly sliced bell pepper, and shredded cabbage. Stir-fry for 3-4 minutes until vegetables are tender-crisp.",
      "Add cooked egg noodles, bean sprouts, and the sauce mixture to the skillet. Toss everything together until well combined and heated through, about 2-3 minutes.",
      "Adjust seasoning with salt and black pepper if needed.",
      "Garnish with chopped spring onions before serving.",
      "Serve hot and enjoy your delicious Chicken Chow Mein!",
    ],
  },
];

browseRecipe.forEach((recipe, index) => {
  set(ref(database, 'defaultRecipes/' + index), recipe)
  .then(() => {
    // console.log('Recipe added to database successfully:', recipe.name);
  })
  .catch((error) => {
    console.error('Error adding recipe to database:', error);
  });
});


/*This function allows the styling of the recipe tab to look the way that it does.
It also allows the users to click on the recipe name and pull the contents of the 
recipe based on its ID.*/
function generateRecipeHTML(recipe, recipeId, isPublic) {
  return `
    <div class="recipe-food ${isPublic ? 'public-recipe' : ''}" data-recipe-id="${recipeId}">
        <img src="${recipe.image}" alt="">
        <div class="ingredients-direction">
        <h2 class="recipe_name ${isPublic ? 'public-recipe' : ''}" data-recipe-id="${recipeId}">${recipe.name}</h2>
        <div class="title-underline"></div>
            <p>${recipe.desc}</p>
            <div class="icon">
                <img src="img/time.svg" alt="clock">
                <p class="minutes">${recipe.time}</p>
            </div>
            <div class="icon">
                <img src="img/servings.svg" alt="servings">
                <p class="servings">${recipe.servings}</p>
            </div>
        </div>
    </div>`;
}
/*This function allows the users to see the default recipes from
  the browse recipe tab. Via the Firebase Database */
function displayDefaultRecipes() {
  const recipesRef = ref(database, 'defaultRecipes');
  onValue(recipesRef, (snapshot) => {
    const recipes = snapshot.val();
    const recipesContainer = $("#recipes-container");
    if (recipes) {
      for (const recipeId in recipes) {
        const recipe = recipes[recipeId];
        const recipeHTML = generateRecipeHTML(recipe, recipeId, true);
        recipesContainer.append(recipeHTML);
      }
      attachRecipeClickHandlers(); // Attach click handlers after displaying recipes
    } else {
      recipesContainer.append("<p>No recipes found.</p>");
    }
  });
}

// Function to read and display recipes
function displayUserRecipes() {
  const user = auth.currentUser;
  if (user) {
    const recipesRef = ref(database, `users/${user.uid}/recipes`);
    onValue(recipesRef, (snapshot) => {
      const recipes = snapshot.val();
      const recipesContainer = $("#your-recipes-container");
      if (recipes) {
        for (const recipeId in recipes) {
          const recipe = recipes[recipeId];
          const recipeHTML = generateRecipeHTML(recipe, recipeId);
          recipesContainer.append(recipeHTML);
          // console.log(recipe)
        }
        attachRecipeClickHandlers(); // Attach click handlers after displaying recipes
      } else {
        recipesContainer.append("<p>No recipes found.</p>");
      }
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "User Not Authenticated",
      text: "Please log in to view this recipe.",
    });  }
}

// Function to handle recipe clicks
function attachRecipeClickHandlers() {
  $(document).on("click", ".recipe_name", function (event) {
    var recipeId = $(event.currentTarget).data("recipe-id");
    var isPublic = $(event.currentTarget).hasClass("public-recipe");

    // console.log("Recipe ID: " + recipeId);
    // Change the page to viewRecipe and pass the recipe ID as a parameter
    MODEL.changePage("viewRecipe", function () {
      // Callback function to populate the viewRecipe page with the clicked recipe's details
      populateViewRecipePage(recipeId, isPublic);
    });
  });
}

// Function to populate the viewRecipe page
function populateViewRecipePage(recipeId, isPublic) {
  let recipeRef;
  const user = auth.currentUser;

  // console.log("populateViewRecipePage called with:", { recipeId, isPublic });

  if (isPublic) {
    // Reference to public recipe
    // console.log("Fetching public recipe with ID:", recipeId);
    recipeRef = ref(database, `defaultRecipes/${recipeId}`);
  } else if (user) {
    // Reference to user-specific recipe
    // console.log("Fetching user-specific recipe with ID:", recipeId, "for user:", user.uid);
    recipeRef = ref(database, `users/${user.uid}/recipes/${recipeId}`);
  } else {
    // console.log("No user is authenticated and recipe is not public.");
  }

  if (recipeRef) {
    onValue(recipeRef, (snapshot) => {
      const recipe = snapshot.val();
      if (recipe) {
        // console.log("Recipe found:", recipe);
        $(".recipe-name").text(recipe.name);
        $(".recipe-image").attr("src", recipe.image);
        $(".recipe-desc").text(recipe.desc);
        $(".recipe-time").text(recipe.time);
        $(".recipe-servings").text(recipe.servings);

        // Populate ingredients list
        let ingredientsHtml = "";
        recipe.ingredients.forEach((ingredient) => {
          ingredientsHtml += `<p>${ingredient}</p>`;
        });
        $(".ingredients-instructions").html(ingredientsHtml);

        // Populate instructions list
        let instructionsHtml = "";
        recipe.steps.forEach((step) => {
          instructionsHtml += `<p>${step}</p>`;
        });
        $(".cooking-instructions").html(instructionsHtml);
        if (!isPublic && user) {
          $(".edit-recipe-button-container").html(`
            <button class="edit-recipe-button" data-recipe-id="${recipeId}">Edit Recipe</button>
            <button class="delete-recipe-button" data-recipe-id="${recipeId}">Delete Recipe</button>
          `);
        } else {
          $(".edit-recipe-button-container").empty();
        }
      } else {
        // console.log("Recipe not found");
      }
    });
  } else {
    if (!isPublic) {
     alertListener()
    }
  }
}

// This function allows the user to create a recipe using the form on 
// the create recipe tab. It gets pushed into the database and displays on the users "Your Recipe tab". It also checks to see if the user is logged in order to access the functionality. 
function createRecipe(recipe) {
  const user = auth.currentUser;
  // console.log("createRecipe called");
  if (user) {
    // console.log("User is logged in:", user);
    const recipesRef = ref(database, `users/${user.uid}/recipes`);
    const newRecipeRef = push(recipesRef);
    set(newRecipeRef, recipe)
      .then(() => {
        Swal.fire("Recipe Created", "Successfully Created a Recipe!", "success");
        clearRecipeForm(); // Clear input fields after creating a recipe
        MODEL.changePage("home");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Recipe Creation Failed",
          text: error.message,
        });
      });
  } else {
    // console.log("User not authenticated");
    Swal.fire({
      icon: "error",
      title: "User Not Authenticated",
      text: "Please log in to create a recipe.",
    });
    MODEL.changePage("login");
  }
}

// Function to clear the recipe form
function clearRecipeForm() {
  $("#recipe_image").val("");
  $("#recipe_name").val("");
  $("#recipe_desc").val("");
  $("#recipe_time").val("");
  $("#recipe_size").val("");
  $(".addIngredients input").val("");
  $(".addInstructions input").val("");
  $("#recipe_id").val("");
  $("#recipe_action_button").text("Create Recipe").removeClass("editRecipeBtn").addClass("createRecipeBtn");

}

function attachCreateRecipeListener() {
  $(".createRecipeBtn").on("click", (e) => {
    e.preventDefault();

    // let recipeImage = $("#recipe_image").val();
    let recipeName = $("#recipe_name").val();
    let recipeDesc = $("#recipe_desc").val();
    let recipeTime = $("#recipe_time").val();
    let recipeSize = $("#recipe_size").val();

    const file = $("#file_input")[0].files[0];
    let imageURL = "";
    if (file) {
      imageURL = URL.createObjectURL(file);
    }

    var ingredients = [];
    $(".addIngredients input").each(function () {
      ingredients.push($(this).val());
    });

    var instructions = [];
    $(".addInstructions input").each(function () {
      instructions.push($(this).val());
    });

    let newRecipe = {
      image: imageURL,
      name: recipeName,
      desc: recipeDesc,
      time: recipeTime,
      servings: recipeSize,
      ingredients: ingredients,
      steps: instructions,
    };

    createRecipe(newRecipe);
  });
} 

function attachImage() {
  $("#file_input").change(function () {
    const file = this.files[0];
    if (file) {
      // Create a FileReader object
      const reader = new FileReader();
      // Set up the FileReader onload event
      reader.onload = function (e) {
        // Get the data URL representing the file
        const imageUrl = e.target.result;
        
        // Display the image
        $("#preview_image").attr("src", imageUrl);
        
        // Set the value of the recipe image input field (optional)
        $("#recipe_image").val(file.name);
      };
      
      // Read the file as a data URL
      reader.readAsDataURL(file);
    }
  });
}

function loadRecipeData(recipeId, isPublic) {
  let recipeRef;
  const user = auth.currentUser;

  if (isPublic) {
    recipeRef = ref(database, `defaultRecipes/${recipeId}`);
  } else if (user) {
    recipeRef = ref(database, `users/${user.uid}/recipes/${recipeId}`);
    // console.log("User", recipeId)
  }

  if (recipeRef) {
    onValue(recipeRef, (snapshot) => {
      const recipe = snapshot.val();
      if (recipe) {
        $("#recipe_image").val(recipe.image);
        $("#recipe_name").val(recipe.name);
        $("#recipe_desc").val(recipe.desc);
        $("#recipe_time").val(recipe.time);
        $("#recipe_size").val(recipe.servings);

        // Load ingredients
        $(".addIngredients").empty(); // Remove existing inputs
        recipe.ingredients.forEach((ingredient, index) => {
          $(".addIngredients").append(
            `<input type="text" placeholder="Ingredient #${index + 1}:" size="60" value="${ingredient}">`
          );
        });

        // Load instructions
        $(".addInstructions").empty(); // Remove existing inputs
        recipe.steps.forEach((step, index) => {
          $(".addInstructions").append(
            `<input type="text" placeholder="Instruction #${index + 1}:" size="60" value="${step}">`
          );
        });

        // // Store the recipe ID and isPublic status for later use
        // $("#editRecipeBtn").data("recipe-id", recipeId);
        // $("#editRecipeBtn").data("is-public", isPublic);
        $("#recipe_id").val(recipeId);
        $("#recipe_action_button").text("Save Changes").removeClass("createRecipeBtn").addClass("editRecipeBtn");
      } else {
        // console.log("Recipe not found");
      }
    });
  }
}


function saveRecipeChanges() {
  const user = auth.currentUser;
  const recipeId = $("#recipe_id").val();
  const isPublic = $("#editRecipeBtn").data("is-public");

  if (user) {
    let recipeRef;
    recipeRef = ref(database, `users/${user.uid}/recipes/${recipeId}`);

    const updatedRecipe = {
      image: $("#recipe_image").val(),
      name: $("#recipe_name").val(),
      desc: $("#recipe_desc").val(),
      time: $("#recipe_time").val(),
      servings: $("#recipe_size").val(),
      ingredients: $(".addIngredients input").map(function () {
        return $(this).val();
      }).get(),
      steps: $(".addInstructions input").map(function () {
        return $(this).val();
      }).get()
    };

    update(recipeRef, updatedRecipe)
      .then(() => {
        Swal.fire("Recipe Updated", "Successfully updated the recipe!", "success");
        // Optionally, navigate back to the view recipe page
        MODEL.changePage("viewRecipe", function () {
          populateViewRecipePage(recipeId, isPublic);
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: error.message,
        });
      });
  } else {
    Swal.fire({
      icon: "error",
      title: "User Not Authenticated",
      text: "Please log in to edit this recipe.",
    });
  }
}

function attachEditRecipeListener() {
  $(".editRecipeBtn").on("click", function (e) {
    e.preventDefault();
    saveRecipeChanges();
  });
}

// Delete recipe function
function deleteRecipe(recipeId) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      const user = auth.currentUser;
      if (user) {
        const recipeRef = ref(database, `users/${user.uid}/recipes/${recipeId}`);
        remove(recipeRef)
          .then(() => {
            Swal.fire("Recipe Deleted", "Successfully deleted the recipe!", "success");
            MODEL.changePage("home");
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Delete Failed",
              text: error.message,
            });
          });
      } else {
        Swal.fire({
          icon: "error",
          title: "User Not Authenticated",
          text: "Please log in to delete this recipe.",
        });
      }
    }
  });
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    // console.log("User is signed in", user);
    replaceNav(user);
    attachCreateRecipeListener();
    attachImage(); // Attach the image function when user is signed in
    displayUserRecipes(); // Display recipes when user is signed in
  } else {
    // console.log("No user is signed in");
    replaceNav(null);
  }
});

// Initialize event listeners for adding ingredients and steps
$(document).ready(function () {

  $(".addBtn").on("click", (e) => {
    let ingredCnt = $(".addIngredients input").length;
    $(".addIngredients").append(
      `<input type="text" placeholder="Ingredient #${ingredCnt + 1}:" size="60" id="ingred${ingredCnt}">`
    );
  });

  $(".addStepBtn").on("click", (e) => {
    let stepCnt = $(".addInstructions input").length;
    $(".addInstructions").append(
      `<input type="text" placeholder="Instruction #${stepCnt + 1}:" size="60" id="step${stepCnt}">`
    );
  });

  $(document).on("click", ".edit-recipe-button", function () {
  var recipeId = $(this).data("recipe-id");
  var isPublic = $(this).data("is-public");

  MODEL.changePage("createrecipe", function () {
    loadRecipeData(recipeId, isPublic);
    attachEditRecipeListener();
  });
});

$(document).on("click", ".delete-recipe-button", function () {
  var recipeId = $(this).data("recipe-id");
  deleteRecipe(recipeId);
});

$(document).on("click", ".create-recipe-button", function () {
  MODEL.changePage("createrecipe", function () {
    clearRecipeForm();
    attachCreateRecipeListener(); // Ensure this is called here
  });
});
});




/**
 * When a user clicks on a link in the navigation bar, the function will log the id of the link to the
 * console.
 */
var stepCnt = 3;
var ingredCnt = 3;

function initListeners() {
  $("nav a").click((e) => {
    let btnID = e.currentTarget.id;
    // console.log("click" + btnID);
  });
}

/**
 * If the hash tag is empty, change the page to home, otherwise change the page to the hash tag.
 */
function route() {
  let hashtagLink = window.location.hash; //get page from hashtag in url
  let pageID = hashtagLink.replace("#", "");

  if (pageID == "") {
    MODEL.changePage("home");
  } else if (pageID == "login") {
    MODEL.changePage(
      pageID,
      register,
      login,
    );
  } else if (pageID == "createrecipe") {
    MODEL.changePage(
      pageID,
      addIngredListener,
      loadRecipeData,
      attachCreateRecipeListener,
      attachEditRecipeListener,
      attachImage,
    );
  } else if (pageID == "recipes") {
    MODEL.changePage(pageID, displayDefaultRecipes, generateRecipeHTML);
  } else if (pageID == "viewRecipe") {
    MODEL.changePage(
      pageID,
      attachRecipeClickHandlers,
      addIngredListener,
    );
  } else if (pageID == "yourrecipe") {
    MODEL.changePage(
      pageID,
      addIngredListener,
      attachImage,
      displayUserRecipes,
    );
  }else {
    MODEL.changePage(pageID);
  }
}

window.onpopstate = function () {
  route();
};
/**
 * When the hash changes, call the route function.
 */
function initApp() {
  $(window).on("hashchange", route);
  route();
}

function hamburgerMenuFn(){
const mainMenu = document.querySelector(".mainMenu");
const closeMenu = document.querySelector(".closeMenu");
const openMenu = document.querySelector(".openMenu");
const menuLinks = document.querySelectorAll(".mainMenu a");


openMenu.addEventListener("click", show);
closeMenu.addEventListener("click", close);

menuLinks.forEach(link => {
  link.addEventListener("click", close);
});

function show() {
  mainMenu.style.display = "flex";
  mainMenu.style.top = "0";
}

function close() {
  mainMenu.style.top = "-100%";
}

}

// function alertListener() {
//   if (MODEL.loginStatus == 1) {
//     Swal.fire({
//       icon: "error",
//       title: "Access Limit Error",
//       text: "Please Login to access page",
//     }).then(function () {
//       window.location.href = "#login";
//     });
//   }
// }

function addIngredListener() {
  $(".addStepBtn").on("click", (e) => {
    $(".addInstructions").append(
      `<input type="text" placeholder = "Instructions #${
        stepCnt + 1
      }"id="step${stepCnt}">`
    );
    stepCnt++;
  });

  $(".addBtn").on("click", (e) => {
    $(".addIngredients").append(
      `<input type="text" placeholder = "Ingredient #${
        ingredCnt + 1
      }"id="ingred${ingredCnt}">`
    );
    ingredCnt++;
  });
}

$(document).ready(function () {
  initApp();
  initListeners();
  hamburgerMenuFn()
});
