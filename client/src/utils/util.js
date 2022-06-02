export const makeDeepCopy = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}