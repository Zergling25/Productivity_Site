const columns = ["To Do", "In Progress", "Done"];
let kanbanData = JSON.parse(localStorage.getItem("kanban")) || {
    "To Do": [],
    "In Progress": [],
    "Done": []
};

function createColumn(name) {
    const col = document.createElement("div");
    col.className = "kanban-column";

    const title = document.createElement("h2");
    title.textContent = name;
    col.appendChild(title);

    const input = document.createElement("input");
    input.placeholder = "Add task...";
    col.appendChild(input);

    const btn = document.createElement("button");
    btn.textContent = "Add";
    col.appendChild(btn);

    const list = document.createElement("div");
    list.className = "task-list";
    col.appendChild(list);

    btn.onclick = () => {
        if (input.value.trim()) {
            kanbanData[name].push(input.value);
            input.value = "";
            saveKanban();
            renderKanban();
        }
    };

    kanbanData[name].forEach((task, i) => {
        const taskBox = document.createElement("div");
        taskBox.className = "task-box";
        taskBox.textContent = task;

        const delBtn = document.createElement("button");
        delBtn.textContent = "❌";
        delBtn.onclick = () => {
            kanbanData[name].splice(i, 1);
            saveKanban();
            renderKanban();
        };

        taskBox.appendChild(delBtn);
        list.appendChild(taskBox);
    });

    document.getElementById("kanban-board").appendChild(col);
}

function renderKanban() {
    document.getElementById("kanban-board").innerHTML = "";
    columns.forEach(createColumn);
}

function saveKanban() {
    localStorage.setItem("kanban", JSON.stringify(kanbanData));
}

function exportKanban() {
    const blob = new Blob([JSON.stringify(kanbanData)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "kanban.json";
    link.click();
}

function importKanban(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        kanbanData = JSON.parse(reader.result);
        saveKanban();
        renderKanban();
    };
    reader.readAsText(file);
}

renderKanban();
