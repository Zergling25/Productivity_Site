let mindmapData = JSON.parse(localStorage.getItem("mindmap")) || [];

function addNode() {
    const input = document.getElementById("node-input");
    if (input.value.trim()) {
        const node = createNode(input.value, 100, 100);
        document.getElementById("mindmap-area").appendChild(node);
        mindmapData.push({ text: input.value, x: 100, y: 100 });
        saveMindMap();
        input.value = "";
    }
}

function createNode(text, x, y) {
    const node = document.createElement("div");
    node.className = "mind-node";
    node.textContent = text;
    node.style.left = x + "px";
    node.style.top = y + "px";

    // Dragging
    node.onmousedown = function (e) {
        e.preventDefault();
        let offsetX = e.clientX - node.offsetLeft;
        let offsetY = e.clientY - node.offsetTop;

        function moveAt(e) {
            node.style.left = e.clientX - offsetX + "px";
            node.style.top = e.clientY - offsetY + "px";
        }

        function onMouseMove(e) {
            moveAt(e);
        }

        document.addEventListener("mousemove", onMouseMove);

        document.onmouseup = function () {
            document.removeEventListener("mousemove", onMouseMove);
            document.onmouseup = null;

            const updated = mindmapData.find(n => n.text === text);
            if (updated) {
                updated.x = node.offsetLeft;
                updated.y = node.offsetTop;
                saveMindMap();
            }
        };
    };

    // Double-click to delete
    node.ondblclick = function () {
        node.remove();
        mindmapData = mindmapData.filter(n => n.text !== text);
        saveMindMap();
    };

    return node;
}

function saveMindMap() {
    localStorage.setItem("mindmap", JSON.stringify(mindmapData));
}

function exportMindMap() {
    const blob = new Blob([JSON.stringify(mindmapData)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "mindmap.json";
    link.click();
}

function importMindMap(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        mindmapData = JSON.parse(reader.result);
        saveMindMap();
        renderMindMap();
    };
    reader.readAsText(file);
}

function renderMindMap() {
    const area = document.getElementById("mindmap-area");
    area.innerHTML = "";
    mindmapData.forEach(n => {
        const node = createNode(n.text, n.x, n.y);
        area.appendChild(node);
    });
}

renderMindMap();
