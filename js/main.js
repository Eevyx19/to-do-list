import { formatDate, priorityBackgroundColor, priorityTextColor } from "./utils.js"
import { saveTask, loadTask } from "./storage.js"

let tasks = loadTask()

const form = document.getElementById("form-task")
const listTask = document.getElementById("list-task")
const doneTask = document.getElementById("list-done-task")
const overdueTask = document.getElementById("list-overdue-task")
const today = document.getElementById("current-date")

const currentDate = new Date()

today.textContent = formatDate(currentDate)

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
        const liElement = document.createElement("li")
        liElement.classList = "text-(--primary-text) p-2 flex justify-between items-center"
        liElement.innerHTML = `
            <div class="flex items-center gap-4">
                <input type="checkbox" class="checkbox" ${item.isCompleted ? "checked" : ""}>
                <div class="flex flex-col gap-2 ${item.isCompleted ? "line-through" : ""}">
                    <p class="font-medium">${item.task}</p>
                    <div class="w-fit px-2 py-1 rounded-md ${priorityBackgroundColor(item.priority)}">
                         <p class="${priorityTextColor(item.priority)}">${item.priority}</p>
                    </div>
                    <time class="text-(--secondary-text)"><i class="fa-regular fa-calendar-days"></i> ${formatDate(item.currentDate)}</time>
                </div>
            </div>
            <button class="delete-btn text-white bg-(--error-default) rounded-lg cursor-pointer hover:bg-(--error-secondary) p-2">
                <i class="fa-regular fa-trash-can"></i> Hapus
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
        if (item.isCompleted) {
            const liElement = document.createElement("li")
            liElement.classList = "text-(--primary-text) p-2 items-center list-disc list-inside"
            liElement.textContent = item.task
            doneTask.appendChild(liElement)
        }
    })
}

function renderOverdueTask() {
    overdueTask.innerHTML = ""

    const now = new Date()

    tasks.forEach(item => {
        if (!item.isCompleted && item.deadlineDate < now) {
            const liElement = document.createElement("li")
            liElement.classList = "text-(--primary-text) p-2 items-center list-disc list-inside"
            liElement.textContent = item.task
            overdueTask.appendChild(liElement)
        }
    })
}

function deleteTask(id) {
    tasks = tasks.filter(item => item.id !== id)

    saveTask(tasks)

    renderAllTask()
}

function checkBox(id) {
    const taskCompleted = tasks.find(item => item.id === id)
    if (!taskCompleted) {
        return
    }
    taskCompleted.isCompleted = !taskCompleted.isCompleted

    saveTask(tasks)
    renderAllTask()
}

function renderAllTask() {
    renderListTask()
    renderDoneTask()
    renderOverdueTask()
}

renderAllTask()