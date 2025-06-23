document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("softwareForm");
  const programList = document.getElementById("programList");
  const adminLink = document.getElementById("adminLink");
  const userNameEl = document.getElementById("userName");
  const userStatusEl = document.getElementById("userStatus");
  const adminPanelLink = document.getElementById("adminPanelLink");
  const logoutBtn = document.getElementById("logoutBtn");

  const programs = [
    "Chromium", "LanDocs", "Kasper", "NetAgent", "Office",
    "KriptoBot", "Plugins", "SecretNet", "Spark", "AdobeReader", "7zip"
  ];

  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    const container = document.getElementById("toast-container");
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4000);
  }

  programs.forEach(program => {
    const item = document.createElement("div");
    item.classList.add("program-item");
    item.textContent = program;
    item.addEventListener("click", () => item.classList.toggle("selected"));
    programList.appendChild(item);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedPrograms = Array.from(
      document.querySelectorAll(".program-item.selected")
    ).map(el => el.textContent);

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programs: selectedPrograms })
    });

    if (res.ok) {
      showToast("Заявка отправлена!", "success");
      userStatusEl.textContent = "Отправлена";
    } else {
      showToast("Ошибка при отправке", "error");
    }
  });

  if (document.cookie.includes("isAdmin=true")) {
    adminLink.innerHTML = `<a href="admin.html">Перейти в админ-панель</a>`;
    adminPanelLink.innerHTML = `<a href="admin.html">Админ панель</a>`;
  }
  const sidebar = document.getElementById("sidebar");
  const openSidebar = document.getElementById("openSidebar");
  const closeSidebar = document.getElementById("closeSidebar");

  openSidebar.addEventListener("click", () => sidebar.classList.add("active"));
  closeSidebar.addEventListener("click", () => sidebar.classList.remove("active"));
  logoutBtn.addEventListener("click", async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "index.html";
  });

  async function loadProfile() {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        userNameEl.textContent = data.username;
        userStatusEl.textContent = data.status || "Нет заявки";
      } else {
        userNameEl.textContent = "Ошибка";
      }
    } catch {
      userNameEl.textContent = "Ошибка";
    }
  }

  loadProfile();
});
