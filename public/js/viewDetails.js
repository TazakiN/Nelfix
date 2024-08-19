function viewFilmDetails(filmId) {
  fetch(`/films/details/${filmId}`, {
    method: 'GET',
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      }
      throw new Error('Network response was not ok.');
    })
    .then((html) => {
      document.open();
      document.write(html);
      document.close();
      history.pushState(null, '', `/films/details/${filmId}`);
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('There was a problem loading the film details.');
    });
}
