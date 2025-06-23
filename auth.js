document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    const container = document.getElementById("toast-container");
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 5000);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        })
      });

      if (res.ok) {
        showToast("Успешный вход!", "success");
        setTimeout(() => window.location.href = "dashboard.html", 1000);
      } else {
        showToast("Ошибка входа", "error");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: regUsername.value,
          password: regPassword.value,
        })
      });

      if (res.ok) {
        showToast("Регистрация прошла успешно", "success");
        setTimeout(() => window.location.href = "index.html", 1000);
      } else {
        showToast("Ошибка регистрации", "error");
      }
    });
  }
});
