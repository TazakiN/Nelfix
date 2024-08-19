document.addEventListener('DOMContentLoaded', function () {
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const form = document.querySelector('form');

  const errorMessage = document.createElement('p');
  errorMessage.style.color = 'lightcoral';
  errorMessage.style.fontSize = '0.875rem';
  errorMessage.style.marginTop = '0.5rem';
  errorMessage.style.display = 'none';
  errorMessage.style.textAlign = 'center';
  errorMessage.textContent = 'Password yang dimasukkan berbeda';
  confirmPasswordInput.parentNode.appendChild(errorMessage);

  confirmPasswordInput.addEventListener('input', function () {
    if (confirmPasswordInput.value !== passwordInput.value) {
      confirmPasswordInput.style.borderColor = 'red';
      errorMessage.style.display = 'block';
    } else {
      confirmPasswordInput.style.borderColor = '';
      errorMessage.style.display = 'none';
    }
  });

  form.addEventListener('submit', function (event) {
    if (confirmPasswordInput.value !== passwordInput.value) {
      event.preventDefault(); // Prevent form submission if passwords don't match
      confirmPasswordInput.style.borderColor = 'red';
      errorMessage.style.display = 'block';
    }
  });
});
