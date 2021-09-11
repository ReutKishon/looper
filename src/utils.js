export const id = () => "_" + Math.random().toString(36).substr(2, 9);
export const randomHexColorCode = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return "#" + n.slice(0, 6);
};
