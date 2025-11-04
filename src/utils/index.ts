export function formatWeaviateName(name: string) {
    if (!name) return 'UnnamedCollection';

    // Remove invalid characters and split by space, underscore, hyphen, or number boundaries
    const parts = name
        .replace(/[^a-zA-Z0-9]+/g, ' ') // remove special chars
        .trim()
        .split(/\s+/);

    // Capitalize each part
    const formatted = parts
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');

    // Ensure it starts with a letter
    if (!/^[A-Z]/.test(formatted)) {
        return 'A' + formatted; // prepend a capital letter if starts with number
    }

    return formatted;
}


export function random1000to9999() {
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
}