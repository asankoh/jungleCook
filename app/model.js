// Function to load page content
function loadPage(page) {
  return new Promise((resolve, reject) => {
    $.get(`pages/${page}.html`, function (data) {
      $("#app").html(data);
      resolve();
    }).fail(reject);
  });
}
// Change page function using async/await
export async function changePage(pageID, ...callbacks) {
  try {
    if (pageID == "" || pageID == "home") {
      await loadPage("home");
    } else if (pageID == "login") {
      await loadPage("login");
    } else if (pageID == "recipes") {
      await loadPage("recipes");
    } else if (pageID == "viewRecipe") {
      await loadPage("viewRecipe");
    } else if (pageID == "createrecipe") {
      await loadPage("createRecipe");
    } else if (pageID == "yourrecipe") {
      await loadPage("yourRecipe");
    } else if (pageID == "editRecipe") {
      await loadPage("editRecipe");
    }

    window.history.pushState({}, "", `#${pageID}`);
    // Execute all callbacks
    for (const callback of callbacks) {
      if (callback && typeof callback === "function") {
        callback();
      }
    }
  } catch (error) {
    console.error("Error loading page:", error);
  }
}


export var loginStatus = 1;
// the purpose of this function is to let the user know whether if they are logged in or not. if status = 1 then they aren't logged in. if status = 2 then they are logged in
export function setLoginStatus(status) {
  loginStatus = status;
}
