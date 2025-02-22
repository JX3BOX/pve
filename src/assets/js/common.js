function to(path) {
    if (location.hostname == "localhost") {
        return path;
    } else {
        return "/team" + path;
    }
}

export { to };
