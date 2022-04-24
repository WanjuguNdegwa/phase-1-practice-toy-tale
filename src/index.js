let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyCollection = document.querySelector("#toy-collection");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetch('http://localhost:3000/toys')
    .then((res) => res.json())
    .then((res) => {
      res.forEach((toy) => {
        addToyToDOM(toy, toyCollection);
      })
    });

  const newToy = document.querySelector('form.add-toy-form');
  newToy.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('input[name="name"]').value;
    const image = document.querySelector('input[name="image"]').value;

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "name": name,
        "image": image,
        "likes": 0
      })
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
      })
      .then((toy) => {
        addToyToDOM(toy, toyCollection);
      });
  });
});

function addToyToDOM(toy, toyCollection) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
  `;
  
  const button = document.createElement('button');
  button.classList.add('like-btn');
  button.setAttribute('id', toy.id);
  button.innerText = 'Like ❤️';

  button.addEventListener('click', (e) => {
    fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          "likes": toy.likes + 1
        })
      })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((res) => {
        button.previousElementSibling.innerText = `${res.likes} likes`
      })
  });

  card.appendChild(button);

  toyCollection.appendChild(card);
}

