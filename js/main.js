import { formatDate, priorityBackgroundColor, priorityTextColor } from "./utils.js"
import { saveTask, loadTask, saveTheme, loadTheme } from "./storage.js"

let tasks = loadTask()

const form = document.getElementById("form-task")
const listTask = document.getElementById("list-task")
const doneTask = document.getElementById("list-done-task")
const overdueTask = document.getElementById("list-overdue-task")
const today = document.getElementById("current-date")
const currentDate = new Date()
today.textContent = formatDate(currentDate)

//theme
const theme = document.getElementById("theme")
const btnTheme = document.querySelector(".btn-theme")

theme.checked = loadTheme()
document.body.classList.toggle("dark", theme.checked)

theme.addEventListener("change", () => {
    document.body.classList.toggle("dark", theme.checked)
    saveTheme(theme.checked)
})


// Create To Do
form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(form)

    const task = formData.get("input-task").trim()
    const priority = formData.get("priority")
    const deadline = formData.get("deadline")

    const deadlineDate = new Date(`${deadline}T23:59:59`)

    if (!task) {
        alert("Detail tugas harus dimasukan")
        return
    }

    const toDoList = {
        id: Date.now(),
        task: task,
        priority: priority || "low",
        currentDate: currentDate,
        updateDate: currentDate,
        deadlineDate: deadlineDate,
        isCompleted: false
    }

    tasks.push(toDoList)


    form.reset()

    saveTask(tasks)
    renderAllTask()
})

//Render To Do List
function renderListTask() {
    listTask.innerHTML = ""

    tasks.forEach(item => {
        const deadlineDate = new Date(item.deadlineDate)
        const currentDate = new Date(item.currentDate)

        const isOverdue = !item.isCompleted && deadlineDate < currentDate

        const liElement = document.createElement("li")
        liElement.classList = "bg-(--primary-bg) text-(--primary-text) text-sm sm:text-base p-4 md:p-6 flex justify-between items-center rounded-lg gap-2"
        liElement.innerHTML = `
            <div class="flex items-center gap-4">
                <input type="checkbox" class="checkbox" ${item.isCompleted ? "checked" : ""}>
                <div class="flex flex-col gap-2">
                    <p class="font-medium ${item.isCompleted ? "line-through" : ""}">${item.task}</p>
                    <div class="w-fit px-2 py-1 rounded-md ${priorityBackgroundColor(item.priority)}">
                         <p class="${priorityTextColor(item.priority)}">${item.priority}</p>
                    </div>
                    <time class="text-(--secondary-text)"><i class="fa-regular fa-calendar-days"></i> ${formatDate(item.currentDate)}</time>
                </div>
            </div>
            ${isOverdue ? `<span class="text-(--error-secondary) rounded-lg"><i class="fa-solid fa-circle-exclamation"></i> Late</span> ` : ""}
            <button class="delete-btn text-white bg-(--error-default) rounded-lg cursor-pointer hover:bg-(--error-secondary) p-2">
                <i class="fa-regular fa-trash-can"></i> <span class="hidden md:inline-block">Hapus</span>
            </button>
            `

        const checkBoxInput = liElement.querySelector(".checkbox")
        checkBoxInput.addEventListener("click", () => {
            checkBox(item.id)
        })

        const deleteButton = liElement.querySelector(".delete-btn")
        deleteButton.addEventListener("click", () => {
            deleteTask(item.id)
        })

        listTask.appendChild(liElement)
    })
}

// Render Done List
function renderDoneTask() {
    doneTask.innerHTML = ""

    tasks.forEach(item => {
        const updateDate = new Date(item.updateDate)
        const deadlineDate = new Date(item.deadlineDate)

        if (item.isCompleted && updateDate < deadlineDate) {
            const liElement = document.createElement("li")
            liElement.classList = "bg-(--primary-bg) text-(--primary-text) text-sm sm:text-base rounded-lg p-4 md:p-6 items-center list-disc list-inside"
            liElement.textContent = item.task
            doneTask.appendChild(liElement)
        }
    })
}

//Render Overdue Task
function renderOverdueTask() {
    overdueTask.innerHTML = ""

    tasks.forEach(item => {
        const deadlineDate = new Date(item.deadlineDate)
        const currentDate = new Date(item.currentDate)

        if (item.isCompleted && deadlineDate < currentDate) {
            const liElement = document.createElement("li")
            liElement.classList = "bg-(--primary-bg) text-(--primary-text) text-sm sm:text-base rounded-lg p-4 md:p-6 items-center list-disc list-inside"
            liElement.textContent = item.task
            overdueTask.appendChild(liElement)
        }
    })
}

//Delete Task
function deleteTask(id) {
    tasks = tasks.filter(item => item.id !== id)

    saveTask(tasks)

    renderAllTask()
}

//Checkbox Task
function checkBox(id) {
    const taskCompleted = tasks.find(item => item.id === id)
    const updateDate = new Date()
    if (!taskCompleted) {
        return
    }
    taskCompleted.isCompleted = !taskCompleted.isCompleted
    taskCompleted.updateDate = updateDate

    saveTask(tasks)
    renderAllTask()
}

//Render All Task
function renderAllTask() {
    renderListTask()
    renderDoneTask()
    renderOverdueTask()
}

renderAllTask()