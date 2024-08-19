document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('form');
  const searchInput = document.getElementById('default-search');
  const resultsContainer = document.getElementById('results-container');

  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const query = searchInput.value;

    try {
      const response = await fetch(`/browse?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.text();
          }
          throw new Error('Network response was not ok.');
        })
        .then((html) => {
          document.body.innerHTML = html;
          history.pushState(null, '', `/browse?q=${query}`);
        });
    } catch (error) {
      console.error('Error:', error);
      const errorElement = document.createElement('p');
      errorElement.textContent = 'Terjadi kesalahan saat mencari film.';
      resultsContainer.innerHTML = '';
      resultsContainer.appendChild(errorElement);
    }
  });
});
