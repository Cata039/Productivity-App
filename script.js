// Select elements
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather";
const timezoneDbApiUrl = "https://api.timezonedb.com/v2.1/get-time-zone";
const newsApiUrl = "https://newsapi.org/v2/everything";

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
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const taskText = taskInput.value.trim();
    const urgencySelect = document.getElementById("urgencySelect");
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

    updateProductivity();    
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

// helper function move task to its original position
function moveTaskBackToPosition(taskItem, taskList) {
    const urgencyPriority = { red: 1, yellow: 2, green: 3 };

    const taskUrgency = taskItem.classList.contains("red")
        ? "red"
        : taskItem.classList.contains("yellow")
        ? "yellow"
        : "green";

    const children = Array.from(taskList.children);

    // Find the correct position based on urgency
    let inserted = false;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const childUrgency = child.classList.contains("red")
            ? "red"
            : child.classList.contains("yellow")
            ? "yellow"
            : "green";

        if (urgencyPriority[taskUrgency] < urgencyPriority[childUrgency]) {
            taskList.insertBefore(taskItem, child);
            inserted = true;
            break;
        }
    }

    // If not inserted, append it to the end of the uncompleted section
    if (!inserted) {
        taskList.appendChild(taskItem);
    }
}

function handleCompletion(taskItem, checkbox) {
    const taskList = document.getElementById("taskList");

    if (checkbox.checked) {
        // Mark the task as completed
        taskItem.querySelector(".task-text").style.textDecoration = "line-through"; // Add strikethrough
        taskItem.style.backgroundColor = "#181d5e"; // Blue for completed tasks

        // Move task to the bottom of the list
        taskList.appendChild(taskItem);
    } else {
        // Mark the task as pending
        taskItem.querySelector(".task-text").style.textDecoration = "none"; // Remove strikethrough

        // Restore original color based on urgency
        const urgency = taskItem.classList.contains("red")
            ? "red"
            : taskItem.classList.contains("yellow")
            ? "yellow"
            : taskItem.classList.contains("green")
            ? "green"
            : "meeting";

        taskItem.style.backgroundColor =
            urgency === "red" ? "#ff4d4d" :
            urgency === "yellow" ? "#ffeb3b" :
            urgency === "green" ? "#81c784" :
            "#ff9800"; // Orange for meetings

        // Move the task back to the correct section
        if (urgency === "meeting") {
            addMeetingToUI({ text: taskItem.querySelector(".task-text").textContent, urgency });
        } else {
            moveTaskBackToPosition(taskItem, taskList);
        }
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
    document.querySelector(".circle").style.background = `conic-gradient(#181d5e ${percentage}%, #6c63ff ${percentage}%)`;
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




// Select the "Add Meeting" button
const addMeetingBtn = document.querySelector(".addMeetingBtn");
// Add event listener for the Add Meeting button
addMeetingBtn.addEventListener("click", addMeeting);

function addMeeting() {
    // Capture meeting details
    const meetingInputs = document.querySelectorAll(".meetingInput");
    const meetingName = meetingInputs[0].value.trim();
    const startTime = meetingInputs[1].value.trim();
    const endTime = meetingInputs[2].value.trim();
    const emails = meetingInputs[3].value.trim().split(',');

    // Validation
    if (!meetingName || !startTime || !endTime || !emails.length) {
        alert("Please provide all meeting details!");
        return;
    }

    // Validate start and end time using a regex for HH:MM (24-hour format)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        alert("Start and end times must be in HH:MM format (24-hour clock).");
        return;
    }

    // Create the meeting task object
    const meetingTask = {
        text: `📅 ${meetingName} (🕒 ${startTime} - ${endTime})`,
        urgency: "meeting", // Use a special "meeting" urgency class
        completed: false,
    };

    // Add the meeting task to the UI
    addMeetingToUI(meetingTask);

    // Clear input fields after adding the meeting
    meetingInputs.forEach((input) => (input.value = ""));
    updateProductivity(); // Update productivity percentage
}

function addMeetingToUI(meetingTask) {
    // Create Task Item
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item", meetingTask.urgency); // Adds "meeting" class for styling

    // Checkbox for marking completion
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("task-checkbox");
    checkbox.addEventListener("change", () => handleCompletion(taskItem, checkbox));

    // Task Text
    const taskTextElement = document.createElement("span");
    taskTextElement.classList.add("task-text");
    taskTextElement.textContent = meetingTask.text;

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

    // Insert Meeting Above Red Tasks
    const urgentTasks = Array.from(taskList.children).filter((child) =>
        child.classList.contains("red")
    );

    if (urgentTasks.length > 0) {
        taskList.insertBefore(taskItem, urgentTasks[0]); // Place before the first red task
    } else {
        taskList.prepend(taskItem); // If no red tasks, place at the top
    }

    updateProductivity(); // Update the productivity circle
}






// Weather API Configuration
const weatherApiKey = "66a2d0a3c77ddab24129f829f0a22778"; // API Key
// Select elements for weather
const getWeatherBtn = document.getElementById("getWeatherBtn");
const weatherLocationInput = document.getElementById("weatherLocationInput");
const weatherResult = document.getElementById("weatherResult");

// Add event listener for the "Get Weather" button
getWeatherBtn.addEventListener("click", getWeather);

// Weather Function
async function getWeather() {
    const location = weatherLocationInput.value.trim();

    if (location === "") {
        alert("Please enter a city name!");
        return;
    }

    try {
        const response = await fetch(`${weatherApiUrl}?q=${location}&appid=${weatherApiKey}&units=metric`);
        const weatherData = await response.json();

        if (weatherData.cod === 200) {
            const temperature = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const cityName = weatherData.name;
            const country = weatherData.sys.country;

            weatherResult.innerHTML = `
                <p><strong>${cityName}, ${country}</strong></p>
                <p>🌡️ Temperature: ${temperature}°C</p>
                <p>☁️ Description: ${weatherDescription}</p>
            `;
        } else {
            weatherResult.innerHTML = `<p>City not found. Please try again.</p>`;
        }
    } catch (error) {
        weatherResult.innerHTML = `<p>Error fetching weather. Please check your network.</p>`;
    }
}







const apiKey = "N9J78PWRKF65"; 

async function fetchCurrentTime() {
    const selectedTimezone = timezoneSelect.value;

    if (!selectedTimezone) {
        alert("Please select a time zone!");
        return;
    }

    try {
        const response = await fetch(`${timezoneDbApiUrl}?key=${apiKey}&format=json&by=zone&zone=${selectedTimezone}`);
        const data = await response.json();

        if (data.status === "OK") {
            timeResult.innerHTML = `
                <p><strong>${data.zoneName}</strong></p>
                <p>🕒 Current Time: ${data.formatted}</p>
            `;
        } else {
            timeResult.innerHTML = `<p>Error fetching time: ${data.message}</p>`;
        }
    } catch (error) {
        console.error("Error fetching time:", error);
        timeResult.innerHTML = `<p>Error fetching time. Please check your network connection.</p>`;
    }
}

// Load time zones on page load
window.addEventListener("load", async () => {
    // Populate time zones manually for TimeZoneDB
    const timezones = ["America/New_York", "Europe/London", "Asia/Tokyo", "Australia/Sydney", "Europe/Chisinau"];
    timezones.forEach((zone) => {
        const option = document.createElement("option");
        option.value = zone;
        option.textContent = zone;
        timezoneSelect.appendChild(option);
    });
});

getTimeBtn.addEventListener("click", fetchCurrentTime); // Fetch time on button click






// Select elements
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const sendChatBtn = document.getElementById("sendChatBtn");

// NewsAPI Configuration
const newsApiKey = "04273a2221b54672bb80263c10289fe8";  

// Handle the "Get News" button click
sendChatBtn.addEventListener("click", fetchNews);

async function fetchNews() {
    const query = chatInput.value.trim();  // User input (news topic)
    if (query === "") {
        alert("Please enter a topic to search for news.");
        return;
    }

    // Display user's search topic
    const userMsgElem = document.createElement("p");
    userMsgElem.textContent = `You: Searching for "${query}"...`;
    chatMessages.appendChild(userMsgElem);
    chatInput.value = "";

    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=${newsApiKey}`);
        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
            const newsList = data.articles.slice(0, 5).map(article => `
                <p>
                    <a href="${article.url}" target="_blank" style="color: #ffd700; font-weight: bold; text-decoration: none;">
                        ${article.title}
                    </a>
                    <br>
                    ${article.description || "No description available"}
                </p>
            `).join("");
            chatMessages.innerHTML += `<div class="news-section">${newsList}</div>`;
        } else {
            chatMessages.innerHTML += `<p>No news found for "${query}".</p>`;
        }
    } catch (error) {
        console.error("Error fetching news:", error);
        chatMessages.innerHTML += `<p>Error fetching news. Please try again later.</p>`;
    }

    // Auto-scroll to the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle "Enter" key to trigger news fetch
chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        fetchNews();
    }
});


