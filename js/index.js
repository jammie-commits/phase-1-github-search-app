const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-term');
const userList = document.getElementById('user-list');
const repoList = document.getElementById('repo-list');
const searchTypeButton = document.getElementById('search-type-toggle');

const BASE_URL = 'https://api.github.com';
const ACCEPT_HEADER = 'application/vnd.github.v3+json';

// Default search type
let searchType = 'user';

function getUserRepos(username) {
  const url = `${BASE_URL}/users/${username}/repos`;

  fetch(url, { headers: { Accept: ACCEPT_HEADER } })
    .then(response => response.json())
    .then(data => {
      repoList.innerHTML = ''; // Clear previous repo list
      displayRepos(data);
    })
    .catch(error => console.error(error));
}

function displayRepos(repos) {
  repos.forEach(repo => {
    const repoItem = document.createElement('li');
    repoItem.textContent = `- ${repo.name}`;
    repoList.appendChild(repoItem);
  });
  repoList.classList.remove('hidden');
}

function displayUsers(users) {
  userList.innerHTML = ''; // Clear previous user list
  users.forEach(user => {
    const userItem = document.createElement('li');
    userItem.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login} avatar">
      <a href="${user.html_url}" target="_blank">${user.login}</a>
    `;
    userItem.addEventListener('click', () => getUserRepos(user.login));
    userList.appendChild(userItem);
  });
}

function searchGitHub(searchTerm) {
  const url = searchType === 'user'
    ? `${BASE_URL}/search/users?q=${searchTerm}`
    : `https://api.github.com/search/repositories?q=${searchTerm}`;

  fetch(url, { headers: { Accept: ACCEPT_HEADER } })
    .then(response => response.json())
    .then(data => {
      userList.classList.add('hidden');
      repoList.classList.add('hidden');

      if (data.items && data.items.length > 0) {
        const users = searchType === 'user' ? data.items : data.items.map(item => item.owner);
        displayUsers(users);
      } else {
        console.log('No results found');
      }
    })
    .catch(error => console.error(error));
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const searchTerm = searchInput.value.trim();
  searchGitHub(searchTerm);
});

// Handle search type toggle button click
searchTypeButton.addEventListener('click', () => {
  searchType = searchType === 'user' ? 'repo' : 'user'; // Toggle between user and repo search
  searchInput.value = ''; // Clear search term on toggle
  userList.classList.add('hidden');
  repoList.classList.add('hidden');

  // Update button text based on search type
  searchTypeButton.textContent = searchType === 'user' ? 'Search Users' : 'Search Repositories';
});
