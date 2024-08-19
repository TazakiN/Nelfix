document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.querySelector(
    '[data-collapse-toggle="navbar-cta"]',
  );
  const navbarMenu = document.getElementById('navbar-cta');
  const authSection = document.getElementById('auth-section');
  const username = extractFromToken()?.username;

  toggleButton.addEventListener('click', function () {
    navbarMenu.classList.toggle('hidden');
  });

  if (username) {
    authSection.innerHTML = `
        <a onclick="handleAccountDetail()" class="flex items-center space-x-2 text-white cursor-pointer hover:underline" >
          <span>${username}</span>
          <img src="/assets/avatar.svg" class="w-8 h-8 rounded-full" alt="Avatar" />
        </a>
          `;
  } else {
    authSection.innerHTML = `
    <a href="/login">
      <button type="button" class="text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login</button>
    </a>
      <span class="border-l border-gray-300"></span>
    <a href="/register">
      <button type="button" class="text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register</button>
    </a>
    `;
  }
});

function removeToken() {
  localStorage.removeItem('token');
}

function extractFromToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token not found');
    return null;
  }

  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return payload;
  } catch (error) {
    console.error('Invalid token', error);
    return null;
  }
}

function handleAccountDetail() {
  const token = localStorage.getItem('token');
  const userId = extractFromToken().sub;

  if (!userId) {
    return (window.location.href = '/login');
  }

  fetch(`/users/${userId}/detail`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else if (response.status === 401) {
        alert('You must log in first.');
        removeToken();
        return (window.location.href = '/login');
      } else {
        alert('You must log in first.');
        removeToken();
        return (window.location.href = '/login');
      }
    })
    .then((html) => {
      document.open();
      document.write(html);
      document.close();
      history.pushState(null, '', `/users/${userId}/detail`);
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('There was a problem loading the user details.');
    });
}

function toMyListPage() {
  const userId = extractFromToken().sub;
  if (userId) {
    window.location.href = `/browse/${userId}`;
  } else {
    alert('Kamu harus login terlebih dahulu');
  }
}
