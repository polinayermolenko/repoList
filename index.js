const url = `https://api.github.com/search/repositories?q=`;
const search = document.querySelector(".main__input");
const list = document.querySelector(".main__list");
const repoList = document.querySelector(".main__result");
let repoData = [];

const debounce = (fn, debounceTime) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), debounceTime);
  };
};

const createAutocompleteTemplate = (repoName, id) => {
  return `<li class="list__item" id=${id}>
     ${repoName}
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

const liItemClickHandler = (evt) => {
  const liItem = evt.target;

  const dataItem = repoData.find((item) => item.id == liItem.id);
  if (dataItem) {
    search.value = "";
    list.innerHTML = "";
    const repoListItem = createElement(createRepoList(dataItem));
    render(repoList, repoListItem);
    const deleteBtn = repoListItem.querySelector(".result__btn");

    deleteBtn.addEventListener("click", () =>
      repoList.removeChild(repoListItem)
    );
  }
};

const createAutocompleteResults = (items) => {
  if (list.hasChildNodes()) {
    list.innerHTML = "";
  }
  return items.forEach((item) => {
    const liItem = createElement(
      createAutocompleteTemplate(item.name, item.id)
    );
    render(list, liItem);

    liItem.addEventListener("click", (evt) => liItemClickHandler(evt));
  });
};

const fetchingData = async (query) => {
  if (query === "") {
    return [];
  }

  return await fetch(`${url}${query}`)
    .then((res) => res.json())
    .then((data) => {
      repoData = [];
      data = data.items.slice(0, 5);
      repoData.push(...data);
      return data;
    })
    .then((data) => createAutocompleteResults(data))
    .catch((err) => console.log(err));
};

const debounced = debounce(fetchingData, 250);
const searchChangeHandler = (evt) => {
  let searchValue = evt.target.value;
  if (searchValue === "") {
    list.innerHTML = "";
    return [];
  }
  debounced(searchValue);
};

search.addEventListener("input", searchChangeHandler);
