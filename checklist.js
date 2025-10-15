let checklistData = JSON.parse(localStorage.getItem("checklist")) || [];

function addItem() {
    const input = document.getElementById("check-input");
    if (input.value.trim()) {
        checklistData.push({ text: input.value, checked: false });
        input.value = "";
        saveChecklist();
        renderChecklist();
    }
}

function renderChecklist() {
    const list = document.getElementById("checklist");
    list.innerHTML = "";
    checklistData.forEach((item, i) => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.checked;
        checkbox.onchange = () => {
            item.checked = checkbox.checked;
            saveChecklist();
        };

        const label = document.createTextNode(" " + item.text);

        const del = document.createElement("button");
        del.textContent = "❌";
        del.onclick = () => {
            checklistData.splice(i, 1);
            saveChecklist();
            renderChecklist();
        };

        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(del);
        list.appendChild(li);
    });
}

function saveChecklist() {
    localStorage.setItem("checklist", JSON.stringify(checklistData));
}

function exportChecklist() {
    const blob = new Blob([JSON.stringify(checklistData)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "checklist.json";
    link.click();
}

function importChecklist(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        checklistData = JSON.parse(reader.result);
        saveChecklist();
        renderChecklist();
    };
    reader.readAsText(file);
}

renderChecklist();
