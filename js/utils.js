export function formatDate(date) {
    const dateObject = new Date(date)
    const options = {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    }

    return dateObject.toLocaleDateString("en-ID", options)

}

export function priorityBackgroundColor(priority) {
    switch (priority) {
        case "low":
            return "bg-green-50"
        case "medium":
            return "bg-yellow-50"
        case "high":
            return "bg-red-50"
    }
}

export function priorityTextColor(priority) {
    switch (priority) {
        case "low":
            return "text-(--success-secondary)"
        case "medium":
            return "text-(--warning-secondary)"
        case "high":
            return "text-(--error-secondary)"
    }
}