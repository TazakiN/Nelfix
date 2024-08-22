async function handleWatch() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You need to be logged in to watch this film.');
    return (window.location.href = '/login');
  }

  const filmId = window.location.pathname.split('/').pop();

  fetch(`/films/watch/${filmId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else if (response.status === 403) {
        alert(
          'Kamu tidak memiliki film ini, harap untuk membeli film ini terlebih dahulu.',
        );
        const currentHTML = document.documentElement.outerHTML;
        return currentHTML;
      } else if (response.status === 401) {
        console.log(response);
        alert('Anda harus login terlebih dahulu.');
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

async function handleBuy() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You need to be logged in to watch this film.');
    return (window.location.href = '/login');
  }

  const filmId = window.location.pathname.split('/').pop();

  const userId = extractFromToken().sub;

  const response = await fetch(`/films/buy/${userId}/${filmId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  alert((await response.json()).message);
}
