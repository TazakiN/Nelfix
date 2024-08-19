async function reloadWithAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Session expired, please log in again.');
    return (window.location.href = '/login');
  }

  try {
    const response = await fetch(window.location.href, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const html = await response.text();
      document.open();
      document.write(html);
      document.close();
    } else if (response.status === 401) {
      alert('Session expired, please log in again.');
      removeToken();
      window.location.href = '/login';
    } else {
      throw new Error('Failed to reload the page');
    }
  } catch (error) {
    console.error('Error reloading page:', error);
    alert('Failed to reload page.');
  }
}

document
  .getElementById('addBalanceForm')
  .addEventListener('submit', async function (e) {
    e.preventDefault();
    const increment = document.getElementById('increment').value;
    const token = localStorage.getItem('token');
    const userId = extractFromToken().sub;
    const response = await fetch('/users/' + userId + '/balance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ increment: Number(increment) }),
    });
    const result = await response.json();
    alert(result.message);
    if (result.status === 'success') reloadWithAuth();
  });

document
  .getElementById('editUserForm')
  .addEventListener('submit', async function (e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = extractFromToken().sub;
    const username = document.getElementById('editUsername').value;
    const email = document.getElementById('editEmail').value;
    const response = await fetch('/users/' + userId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, email }),
    });
    const result = await response.json();
    alert(result.message);
    if (result.status === 'success') reloadWithAuth();
  });

document.getElementById('logoutButton').addEventListener('click', function () {
  localStorage.removeItem('token');
  window.location.href = '/login';
});
