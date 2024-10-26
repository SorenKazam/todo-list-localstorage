const btnAddTask = document.getElementById("btn-add-task");
const openAddTaskBtn = document.getElementById("addTaskBox-btn");
const addTaskBox = document.getElementById("addTask-box");
const taskTitleInput = document.getElementById("input-task-title");
const taskDetailInput = document.getElementById("input-task-detail");
const taskImportance = document.getElementById("select-task-importance");
const alertMessage = document.getElementById("alert-message");
const taskList = document.getElementById("task-list");
const app = document.getElementById("app");
const appTop = document.getElementById("appTop");

/* After reload check is there is any data */
window.addEventListener("load", () => {
    listRefresh();
});

function changeLayout() {
    /* RESET APP LAYOUT */
    app.style.alignContent = "";
    app.style.justifyContent = "";
    app.style.flexWrap = "";

    appTop.style.flexDirection = "";
    appTop.style.flexWrap = "";
    appTop.style.gap = "";
}

function starScreenLayout() {
    app.style.alignContent = "center";
    app.style.justifyContent = "center";
    app.style.flexWrap = "wrap";
    appTop.style.flexDirection = "column";
    appTop.style.flexWrap = "wrap";
    appTop.style.gap = "20px";
}

/* TIME MANAGER */
function timeManager() {
    /* YYYY/MM/DD HH:mm */

    /* General system date */
    const systemDate = new Date();

    /* Day manager */
    const systemDateYear = systemDate.getFullYear().toString();
    let systemDateMonth = systemDate.getMonth().toString();

    /* Give each month the full month name and not only its number! */
    switch (systemDateMonth) {
        case "0":
            systemDateMonth = "Jan";
            break;
        case "1":
            systemDateMonth = "Fev";
            break;
        case "2":
            systemDateMonth = "Mar";
            break;
        case "3":
            systemDateMonth = "Apr";
            break;
        case "4":
            systemDateMonth = "May";
            break;
        case "5":
            systemDateMonth = "Jun";
            break;
        case "6":
            systemDateMonth = "Jul";
            break;
        case "7":
            systemDateMonth = "Aug";
            break;
        case "8":
            systemDateMonth = "Sep";
            break;
        case "9":
            systemDateMonth = "Oct";
            break;
        case "10":
            systemDateMonth = "Nov";
            break;
        case "11":
            systemDateMonth = "Dec";
            break;
    }

    let systemDateDay = systemDate.getDate();

    /* Hour manager */
    let systemDateHours = systemDate.getHours();
    let systemDateMinutes = systemDate.getMinutes();

    /* Here the script checks if the minutes is less than zero, because if not, it would display like 12:8 instead of 12:08 */
    if (systemDateMinutes < 10) {
        systemDateMinutes = systemDateMinutes.toString().padStart(2, "0");
    }

    let dateTime = systemDateYear.concat(
        "/",
        systemDateMonth,
        "/",
        systemDateDay,
        " ",
        systemDateHours,
        ":",
        systemDateMinutes
    );

    return dateTime;
}

/* OPEN ADD TASK BOX */
openAddTaskBtn.addEventListener("click", () => {
    console.log("Open add task box");

    if (addTaskBox.style.display == "none") {
        addTaskBox.style.display = "block";
        openAddTaskBtn.textContent = "Close";
    } else {
        addTaskBox.style.display = "none";
        openAddTaskBtn.textContent = "Add task";
        modifyAlert("", "close");
    }
});

/* ADD TASK */
btnAddTask.addEventListener("click", () => {
    console.log("Add button clicked");
    let taskTitleValue = taskTitleInput.value;
    let taskDetailValue = taskDetailInput.value;
    let taskImportanceValue = taskImportance.value;

    /* Checking if task has a title */
    if (taskTitleValue) {
        modifyAlert(`Task ${taskTitleValue} added`, "success");
        taskTitleInput.style.border = "";

        /* Send information to the handler */
        handleTasks(taskTitleValue, taskDetailValue, taskImportanceValue);

        /* Clean the text inputs */
        taskTitleInput.value = "";
        taskDetailInput.value = "";
    } else {
        modifyAlert("Please insert task title", "danger");
        taskTitleInput.style.border = "1px solid red";
    }
});

/* Task data handler */
function handleTasks(taskTitle, taskDetail, taskImportance) {
    console.log("Task handler called");

    let title = taskTitle;
    let detail = taskDetail;
    let importance = taskImportance;
    let time = timeManager();

    /* send data to storage */
    console.log("Saving data into memory");
    storageManager(title, detail, importance, time);
}

/* Store tasks information */
function storageManager(title, detail, importance, time) {
    const task = {
        id: Date.now(),
        title: title,
        detail: detail,
        importance: importance,
        time: time,
    };

    localStorage.setItem(task.id, JSON.stringify(task));

    /* refresh list */
    listRefresh();
}

function getAllTasks() {
    const tasks = [];

    /* loop for all tasks in localstorage memory */
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const task = JSON.parse(localStorage.getItem(key));

        /* Verify if task has title! */
        if (task && task.title) {
            tasks.push(task);
        }
    }

    return tasks;
}

/* ALERTS */
function modifyAlert(message, type) {
    console.log("Alert called");
    let msg = message;
    let alertType = type;
    alertMessage.style.display = "block";
    alertMessage.textContent = msg;

    switch (alertType) {
        case "danger":
            alertMessage.style.backgroundColor = "#bc7676";
            break;
        case "success":
            alertMessage.style.backgroundColor = "#76bc76";
            break;
        case "close":
            alertMessage.style.display = "none";
    }
}

/* Refrsh list with task items */
function listRefresh() {
    console.log("list refresh");

    /* Reset preview lists */
    taskList.innerHTML = "";

    /* Checks if there is any data inside the localstorage */
    /* If there isnt any data inside, execute the start screen layout */
    if (localStorage.length > 0) {
        console.log("Welcome back");
        changeLayout();
    } else {
        console.log("Welcome");
        /* Center the screen app */
        starScreenLayout();
    }

    /* Rendering every list item for each task inside localstorage */
    getAllTasks().forEach((item) => {
        const itemContainer = document.createElement("div");
        itemContainer.className = "item";
        itemContainer.id = item.id;
        taskList.appendChild(itemContainer);

        const itemTop = document.createElement("section");
        itemTop.className = "item-top";
        itemContainer.appendChild(itemTop);

        const itemImportance = document.createElement("div");
        itemImportance.className = "item-importance";
        switch (item.importance) {
            case "veryImportant":
                itemImportance.textContent = "Very important";
                itemImportance.style.backgroundColor = "#bc7676";
                break;
            case "normal":
                itemImportance.textContent = "Normal";
                itemImportance.style.backgroundColor = "#99bc76";
                break;
            case "notImportant":
                itemImportance.textContent = "Not important";
                itemImportance.style.backgroundColor = "#7699bc";
                break;
        }
        itemTop.appendChild(itemImportance);

        const itemSettingsBtn = document.createElement("button");
        itemSettingsBtn.className = "btn";
        itemSettingsBtn.textContent = "Delete";
        itemSettingsBtn.onclick = () => removeTask(item.id);
        itemTop.appendChild(itemSettingsBtn);

        const itemBody = document.createElement("section");
        itemBody.className = "item-body";
        itemContainer.appendChild(itemBody);

        const itemTitle = document.createElement("div");
        itemTitle.className = "title";
        itemTitle.textContent = item.title;
        itemBody.appendChild(itemTitle);

        const itemDetail = document.createElement("div");
        itemDetail.className = "detail";
        itemDetail.textContent = item.detail;
        itemBody.appendChild(itemDetail);

        const itemDate = document.createElement("div");
        itemDate.className = "date";
        itemDate.textContent = item.time;
        itemBody.appendChild(itemDate);

        if (item.title == "/drmods") {
            itemContainer.style.backgroundColor = "#00e6e6";
            itemDetail.textContent = "Hello, my name is DrMods and I´m nerd! ";
            const egLink = document.createElement("a");
            egLink.href = "https://github.com/zModz";
            egLink.textContent = "Github";
            egLink.target = "_blank";
            itemDetail.appendChild(egLink);
        } else if (item.title == "/soren") {
            itemContainer.style.backgroundColor = "#ff4dff";
            itemDetail.textContent =
                "Hello, my name is Soren and I´m the best! ";
            const egLink = document.createElement("a");
            egLink.href = "https://github.com/SorenKazam";
            egLink.textContent = "Github";
            egLink.target = "_blank";
            itemDetail.appendChild(egLink);
        }
    });
}

/* REMOVE TASK */
function removeTask(taskID) {
    /* Get the localstorage data and save it into x */
    const x = localStorage.getItem(taskID);

    /* doing some json thing to be readable on js, ig, not sure */
    const item = JSON.parse(x);

    /* Getting the task title to display on the removed message */
    const itemName = item.title;

    /* Removing the item */
    localStorage.removeItem(taskID);

    /* Checks if the item with that id is still on the localstorage */
    if (localStorage.getItem(taskID) === null) {
        console.log("Task deleted");
        modifyAlert(`Task ${itemName} removed!`, "success");
        listRefresh();
    } else {
        console.log("Something went wrong");
        return;
    }
}
