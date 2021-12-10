export const API = {
    GET_PAINTINGS: "https://test-front.framework.team/paintings",
    GET_AUTHORS: "https://test-front.framework.team/authors",
    GET_LOCATIONS: "https://test-front.framework.team/locations"
}

export function requestOptions(method) {
    return {
        method: method,
        headers: {'Content-Type': 'application/json'},
        mode: "cors",
        referrer: "origin-when-cross-origin",
    }
}
