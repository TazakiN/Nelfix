document.addEventListener('DOMContentLoaded', function () {
  const token = localStorage.getItem('token');
  if (token) {
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    });
    fetch(window.location.href, {
      method: 'GET',
      headers: headers,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unauthorized');
        }
        return response.text();
      })
      .then((html) => {
        document.documentElement.innerHTML = html;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  } else {
    console.error('No token found');
  }
});
