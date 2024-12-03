// Select elements
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");
const urgencySelect = document.getElementById("urgencySelect");
const percentageDisplay = document.getElementById("percentage");

// Load tasks on page refresh (clear per requirement)
window.addEventListener("load", () => {
    taskList.innerHTML = "";
    updateProductivity();
});

// Add event listener for the "Enter" key
taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Add event listener for the Add Task button
addTaskBtn.addEventListener("click", addTask);

// Add Task Function
function addTask() {
    const taskText = taskInput.value.trim();
    const urgency = urgencySelect.value; // Get the selected urgency level
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    // Create Task Object
    const task = {
        text: taskText,
        urgency: urgency,
        completed: false,
    };

    // Add task to the UI
    addTaskToUI(task);

    // Clear input fields and update productivity
    taskInput.value = "";
    urgencySelect.value = "red"; // Reset urgency to default
    updateProductivity();
    sortTasks(); // Sort tasks based on urgency
}
    

// Add Task to UI
function addTaskToUI(task) {
    // Create Task Item
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item", task.urgency);

    // Checkbox for marking completion
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");
    checkbox.addEventListener("change", () => handleCompletion(taskItem, checkbox));

    // Task Text
    const taskTextElement = document.createElement("span");
    taskTextElement.classList.add("task-text");
    taskTextElement.textContent = task.text;

    // Actions (Edit and Delete)
    const actions = document.createElement("div");
    actions.classList.add("task-actions");

    // Edit Button
    const editButton = document.createElement("button");
    editButton.innerHTML = "✏️";
    editButton.title = "Edit Task";
    editButton.addEventListener("click", () => enableEditing(taskItem, taskTextElement));

    // Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "🗑️";
    deleteButton.title = "Delete Task";
    deleteButton.addEventListener("click", () => deleteTask(taskItem));

    // Append Buttons to Actions
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    // Add Checkbox, Text, and Actions to Task
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskTextElement);
    taskItem.appendChild(actions);

    // Append Task to List
    taskList.appendChild(taskItem);
}

// Enable Editing
function enableEditing(taskItem, taskTextElement) {
    const inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.value = taskTextElement.textContent;
    inputBox.classList.add("edit-input");
    taskItem.replaceChild(inputBox, taskTextElement);

    const doneButton = document.createElement("button");
    doneButton.innerText = "Done";
    doneButton.classList.add("done-btn");
    doneButton.addEventListener("click", () => saveEditedTask(taskItem, inputBox));

    taskItem.appendChild(doneButton);

    inputBox.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            saveEditedTask(taskItem, inputBox);
        }
    });

    inputBox.focus();
}

// Save Edited Task
function saveEditedTask(taskItem, inputBox) {
    const newText = inputBox.value.trim();
    if (newText === "") {
        alert("Task cannot be empty!");
        return;
    }

    // Update the task's text while keeping its urgency and position
    const taskTextElement = document.createElement("span");
    taskTextElement.classList.add("task-text");
    taskTextElement.textContent = newText;

    taskItem.replaceChild(taskTextElement, inputBox);

    // Remove the Done button
    const doneButton = taskItem.querySelector(".done-btn");
    if (doneButton) {
        doneButton.remove();
    }

    // Maintain the completed state
    const checkbox = taskItem.querySelector(".task-checkbox");
    if (checkbox.checked) {
        taskItem.querySelector(".task-text").style.textDecoration = "line-through"; // Add strikethrough
        taskItem.style.backgroundColor = "#181d5e"; // Completed color
    } else {
        taskItem.querySelector(".task-text").style.textDecoration = "none"; // Remove strikethrough
        const urgency = taskItem.classList.contains("red") ? "red" : taskItem.classList.contains("yellow") ? "yellow" : "green";
        taskItem.style.backgroundColor = urgency === "red" ? "#ff4d4d" : urgency === "yellow" ? "#ffeb3b" : "#81c784";
    }
}


// Handle Task Completion
function handleCompletion(taskItem, checkbox) {
    if (checkbox.checked) {
        taskItem.querySelector(".task-text").style.textDecoration = "line-through"; // Add strikethrough
    } else {
        taskItem.querySelector(".task-text").style.textDecoration = "none"; // Remove strikethrough
    }
    updateProductivity();
}

// Delete Task Function
function deleteTask(taskItem) {
    taskList.removeChild(taskItem);
    updateProductivity();
}

// Update Productivity Percentage
function updateProductivity() {
    const tasks = document.querySelectorAll(".task-item");
    const completedTasks = document.querySelectorAll(".task-item input:checked");
    const totalTasks = tasks.length;
    const completedCount = completedTasks.length;

    // Calculate the productivity percentage
    const percentage = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

    // Update the circle's gradient and the percentage text
    percentageDisplay.textContent = `${percentage}%`;
    document.querySelector(".circle").style.background = `conic-gradient(#6c63ff ${percentage}%, #181d5e ${percentage}%)`;
}

// Sort Tasks by Urgency
function sortTasks() {
    const tasks = Array.from(document.querySelectorAll(".task-item"));

    // Sort tasks based on urgency (Red > Yellow > Green)
    tasks.sort((a, b) => {
        const priority = { red: 1, yellow: 2, green: 3 };
        return priority[a.classList[1]] - priority[b.classList[1]];
    });

    // Re-append tasks to the task list in sorted order
    tasks.forEach((task) => taskList.appendChild(task));
}