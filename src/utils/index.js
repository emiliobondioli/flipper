export const resize = (el, w, h) => {
    el.width = w
    el.height = h
}

export const create = (tag, options = {}, container = null) => {
    const el = document.createElement(tag)
    for (const opt in options) {
        el[opt] = options[opt]
    }
    if (container) container.appendChild(el)
    return el
}

export const clamp = (num, min, max) => {
    return num <= min ? min : num >= max ? max : num;
}

export const random = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
