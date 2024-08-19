document
  .getElementById('loginForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('username', result.data.username);
        if (result.data.username === 'admin') {
          window.location.href = 'https://labpro-fe.hmif.dev/dashboard';
        } else {
          window.location.href = '/';
        }
      } else {
        alert('Login gagal. Periksa kembali username dan password Anda.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    }
  });
