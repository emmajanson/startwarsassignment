let menuOpen = false;
const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector(".mobile-menu");
const links = document.getElementsByClassName("mobile-link");
const documentBody = document.body;

function toggleMenu() {
  if (!menuOpen) {
    menuBtn.classList.add("open");
    menuOpen = true;
    menu.style.right = "0%";
    documentBody.style.overflow = "hidden";
  } else {
    menuBtn.classList.remove("open");
    menuOpen = false;
    menu.style.right = "-100%";
    documentBody.style.overflow = "auto";
  }
}

window.addEventListener("load", function () {
  menuBtn.addEventListener("click", function () {
    toggleMenu();
  });
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function () {
      toggleMenu();
    });
  }
});

/* Turn an Array of character URLs into an array of fetched data objects */
async function resolveCharacterURLs(urls) {
    return await Promise.all(
        urls.map(url => fetch(url)
            .then(response => response.json())
        )
    )
}

/* Get JSON data for Star Wars films and their characters */
async function getFilms() {
    const rawFilmsData = await fetch("https://swapi.py4e.com/api/films")
        .then((res) => res.json())
        .then((json) => json.results)
        document.querySelector(".lds-roller ").style.display = "none" /* Turn the display to none, of the loader, when results have loaded */
    return await Promise.all(rawFilmsData
        .map(async film => {
            film.characters = await resolveCharacterURLs(film.characters)

            return film
        })
    )
}

/* Create the HTML for the cards, in a way that new cards will be created if new movies will be added to the API */
function renderFilmCards(films) {
    const cardsHTML = films
        .map(film => `
      <article class="about-card">
          <div class="about-card-header-wrapper">
              <h3 class="title">${film.title}</h3>
          </div>
          <p class="year">${film.release_date}</p>
      </article>
    `)
        .join("")

    document.querySelector("#about-section").innerHTML = cardsHTML
}

/* Attach events to update the modal with appropriate film data */
function createCardEventListener(card, film) {
    return card.addEventListener("click", () => {
        const charactersHTML = film.characters
            .map((char) => `<p>${char.name}</p>`).sort()
            .join("");

        document.querySelector(".modal-header #titles")
            .innerHTML = film.title
        document.getElementById("about-modal-wrapper").style.display = "flex"; /* Change the display from none to flex, so each card will appear on the site. */
        document.querySelector("#about-modal-content #characters")
            .innerHTML = charactersHTML
    })
}

/* Main function */
async function main() {
    const films = await getFilms()

    renderFilmCards(films)

    document.querySelectorAll('.about-card')
        .forEach((card, index) => createCardEventListener(card, films[index]))
}

/* Close the card-arrow function. Changing display style on about-modal-wrapper (HTML document) from flex to none. */
const closeAboutModal = () => {
  document.getElementById("about-modal-wrapper").style.display = "none";
};

