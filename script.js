const API = 'https://657ade3a394ca9e4af12e5d9.mockapi.io';

const METHOD = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
};

const characterForm = document.getElementById('characterForm');
const characterTableBody = document.getElementById('characterTableBody');
const comicsSelect = document.getElementById('comics');

async function controller(endpoint, method = METHOD.GET, body) {
  const headers = {
    'Content-type': 'application/json; charset="UTF-8"',
  };
  const request = {
    method,
    headers,
  };

  if (body) request.body = JSON.stringify(body);

  const response = await fetch(`${API}/${endpoint}`, request);
  const data = await response.json();

  return data;
}

async function getHeroByName(heroName) {
  const heroes = await controller('heroes');
  return heroes.find(hero => hero.name === heroName);
}

function appendHeroToTable(hero) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${hero.name}</td>
    <td>${hero.comics}</td>
    <td>
      <label class="favourite">
        Favourite:
        <input type="checkbox" ${hero.favourite ? 'checked' : ''}>
      </label>
    </td>
    <td>
      <button class="deleteBtn" data-id="${hero.id}">Delete</button>
    </td>
  `;

  characterTableBody.appendChild(row);

  const deleteButton = row.querySelector('.deleteBtn');
  deleteButton.addEventListener('click', async function () {
    await deleteHero(hero.id);
    row.remove();
  });
}

async function deleteHero(heroId) {
  await controller(`heroes/${heroId}`, METHOD.DELETE);
}

characterForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const nameInput = document.getElementById('name');
  const favouriteCheckbox = document.querySelector('.favourite');

  const hero = {
    name: nameInput.value,
    comics: comicsSelect.value,
    favourite: favouriteCheckbox.checked,
  };

  const existingHero = await getHeroByName(hero.name);

  if (existingHero) {
    console.log('Hero with this name already exists in the database.');
  } else {
    const addedHero = await controller('heroes', METHOD.POST, hero);
    appendHeroToTable(addedHero);
  }

  nameInput.value = '';
  comicsSelect.value = 'Marvel';
  favouriteCheckbox.checked = false;
});