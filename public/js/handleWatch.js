async function handleWatch() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You need to be logged in to watch this film.');
    return (window.location.href = '/login');
  }

  const filmId = window.location.pathname.split('/').pop(); // Get the film ID from the URL

  fetch(`/films/watch/${filmId}`, {
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
        alert('An error occurred while trying to watch the film.');
        return (window.location.href = '/');
      }
    })
    .then((html) => {
      document.open();
      document.write(html);
      document.close();
      history.pushState(null, '', `/films/watch/${filmId}`);
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred while trying to watch the film.');
    });
}
