const url = `https://api.github.com/search/repositories?q=`;
const search = document.querySelector(".main__input");
const list = document.querySelector(".main__list");
const repoList = document.querySelector(".main__result");

const debounce = (fn, debounceTime) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), debounceTime);
  };
};

const createAutocompleteTemplate = (repoName, id) => {
  return `<li class="list__item">
      <button id=${id} class="list__button" type="button">${repoName}</button>
    </li>`;
};

const createRepoList = (obj) => {
  const { name, owner, stargazers_count } = obj;
  return `<li class="result__item">
        <p class="result__el">Name: ${name}</p>
        <p class="result__el">Owner: ${owner.login}</p>
        <p class="result__el">Stars: ${stargazers_count}</p>
      
        <button class="result__btn" type="button"></button>  
    </li>`;
};

const createElement = (template) => {
  const parent = document.createElement(`div`);
  parent.innerHTML = template;

  return parent.firstChild;
};

const render = (container, element) => {
  container.append(element);
};

const getData = async (url, query) => {
  if (query === "") {
    return [];
  }

  const res = await fetch(`${url}${query}`);
  if (!res.ok) {
    console.log("Error");
  }

  if (res.status === 403) {
    return [];
  }
  return await res.json();
};

const onChange = debounce((evt) => {
  let searchValue = evt.target.value;

  getData(url, searchValue)
    .then(({ items }) => {
      if (searchValue === "") {
        list.innerHTML = "";
        return [];
      }

      items = items.slice(0, 5);

      if (list.hasChildNodes()) {
        list.innerHTML = "";
      }

      items.forEach((item) => {
        const element = createElement(
          createAutocompleteTemplate(item.name, item.id)
        );
        render(list, element);
        const btn = element.querySelector(".list__button");

        btn.addEventListener("click", () => {
          if (btn.id == item.id) {
            search.value = "";
            list.innerHTML = "";
            const repoListItem = createElement(createRepoList(item));
            render(repoList, repoListItem);
            const deleteBtn = repoListItem.querySelector(".result__btn");
            deleteBtn.addEventListener("click", () => {
              if (btn.id == item.id) {
                repoList.removeChild(repoListItem);
              }
            });
          }
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}, 250);

search.addEventListener("input", onChange);
