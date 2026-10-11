const storageKey = "tasks"
const themeKey = "theme"

//Save Task
export function saveTask (tasks) {
    localStorage.setItem(storageKey, JSON.stringify(tasks))
}

//Load Task
export function loadTask () {
    const savedTasks = localStorage.getItem(storageKey)
    if (savedTasks === null || savedTasks === "undefined") {
        return []
    }
    return JSON.parse(savedTasks)
}

//Save Theme
export function saveTheme (theme) {
    localStorage.setItem(themeKey, theme)
}

export function loadTheme () {
    return localStorage.getItem(themeKey) === "true"
}