const storageKey = "tasks"

export function saveTask (tasks) {
    localStorage.setItem(storageKey, JSON.stringify(tasks))
}

export function loadTask () {
    const savedTasks = localStorage.getItem(storageKey)
    if (savedTasks === null || savedTasks === "undefined") {
        return []
    }
    return JSON.parse(savedTasks)
}