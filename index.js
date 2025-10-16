// ===== Persistência =====
const STORAGE_KEY = "tasks_board_v1";

const loadTasks = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {}
};

// ===== App =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("task-form");
  const taskList = document.getElementById("taskList");
  const footerCounter = document.getElementById("footerCounter");

  const CHECK_ICON_PATH = "./checkedIcon.svg";

  // Inicializa o array de tarefas
  let tasks = loadTasks() ?? [
    {
      id: 1,
      name: "Implementar tela de listagem de tarefas",
        tag: "frontend",
        createdAt: "21/08/2024",
        done: false,
    },

    {
      id: 2,
      name: "Criar endpoint para cadastro de tarefas",
        tag: "backend",
        createdAt: "21/08/2024",
        done: false,
    },

    {
      id: 1,
      name: "Implementar protótipo da listagem de tarefas   ",
        tag: "ux",
        createdAt: "21/08/2024",
        done: true,
    },
  ];

  // Atualiza o contador de tarefas concluídas
  const updateCounter = () => {
    const done = tasks.filter((t) => t.done).length;
    footerCounter.textContent =
      done === 1 ? "1 tarefa concluída" : `${done} tarefas concluídas`;
  };

  // Função para renderizar uma tarefa
  const renderTask = (task) => {
    const row = document.createElement("div");
    row.className = "row" + (task.done ? " done" : "");

    // COLUNA 1 — Nome + meta
    const nameCell = document.createElement("div");
    nameCell.className = "name";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = task.name;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.innerHTML = `<span class="badge">${task.tag}</span> Criado em: ${task.createdAt}`;
    nameCell.appendChild(title);
    nameCell.appendChild(meta);

    // COLUNA 2 — Ação (botão ou ícone)
    const actionCell = document.createElement("div");
    actionCell.className = "action";

    if (task.done) {
      const doneBtn = document.createElement("button");
      doneBtn.className = "btn-check";
      doneBtn.innerHTML = `<img src="${CHECK_ICON_PATH}" alt="Concluído" />`;
      doneBtn.disabled = true;
      actionCell.appendChild(doneBtn);
    } else {
      const btn = document.createElement("button");
      btn.className = "btn-concluir";
      btn.textContent = "Concluir";
      btn.addEventListener("click", () => {
        task.done = true;
        row.classList.add("done");

        // Troca o botão pelo ícone verde
        actionCell.innerHTML = "";
        const doneBtn = document.createElement("button");
        doneBtn.className = "btn-check";
        doneBtn.innerHTML = `<img src="${CHECK_ICON_PATH}" alt="Concluído" />`;
        doneBtn.disabled = true;
        actionCell.appendChild(doneBtn);

        saveTasks(tasks);
        updateCounter();
      });
      actionCell.appendChild(btn);
    }

    // ✅ Agora o grid tem apenas 2 colunas (name + action)
    row.appendChild(nameCell);
    row.appendChild(actionCell);
    taskList.appendChild(row);
  };

  // Render inicial
  taskList.innerHTML = "";
  tasks.forEach(renderTask);
  updateCounter();
  saveTasks(tasks);

  // Submit do formulário (adicionar tarefa)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("taskName").value.trim();
    const tag = document.getElementById("taskTag").value.trim();
    if (!name || !tag) return;

    const newTask = {
      id: Date.now(),
      name,
      tag,
      createdAt: new Date().toLocaleDateString("pt-BR"),
      done: false,
    };

    tasks.push(newTask);
    renderTask(newTask);
    updateCounter();
    saveTasks(tasks);
    form.reset();
  });
});
