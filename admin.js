document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("requestList");

  async function loadRequests() {
    const res = await fetch("/api/admin/requests");
    container.innerHTML = "";

    if (!res.ok) {
      container.innerText = "Нет доступа или произошла ошибка.";
      return;
    }

    const data = await res.json();
    if (!data.length) {
      container.innerText = "Заявок пока нет.";
      return;
    }

    data.forEach(entry => {
      const block = document.createElement("div");
      block.className = "request-block";

      const programs = entry.programs.join(", ");
      const time = new Date(entry.time).toLocaleString();

      block.innerHTML = `
        <div>
          <strong>${entry.username}</strong><br>
          <small>${time}</small><br>
          <span>Выбрал: ${programs}</span>
        </div>
        <div class="buttons">
          <button class="start-btn">Выполняется</button>
          <button class="delete-btn">Удалить</button>
        </div>
      `;

      block.querySelector(".start-btn").addEventListener("click", async () => {
        showToast(`Заявка "${entry.username}" выполняется`, "success");
      });

      block.querySelector(".delete-btn").addEventListener("click", async () => {
        const confirmed = confirm(`Удалить заявку от "${entry.username}"?`);
        if (!confirmed) return;

        const delRes = await fetch(`/api/admin/delete/${entry.id}`, { method: "DELETE" });
        if (delRes.ok) {
          showToast("Заявка удалена", "success");
          loadRequests();
        } else {
          showToast("Ошибка при удалении", "error");
        }
      });

      container.appendChild(block);
    });
  }

  function showToast(message, type = "success") {
    const containerId = "toast-container";
    let toastContainer = document.getElementById(containerId);

    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.id = containerId;
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }

  loadRequests();
});
