export const formatString = (string, format) => {
    switch (format) {
        case "kebab":
            return string.toLowerCase().split(" ").join("-")
        case "snake":
            return string.toLowerCase().split(" ").join("_")
        case "title":
            return string.replace(
                /\w\S*/g,
                t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()
            )
        case "kebab to title":
            const skipWords = ['of', 'de']
            return string
                .split("-")
                .join(" ")
                .replace(/\w\S*/g, t => {
                    if (skipWords.includes(t)) return t
                    return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()
                })
        default:
            return string
    }
}
