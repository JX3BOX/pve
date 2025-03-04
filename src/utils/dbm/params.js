export const removeEmptyParams = (obj) => {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
        if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
            newObj[key] = obj[key];
        }
    });
    return newObj;
}
