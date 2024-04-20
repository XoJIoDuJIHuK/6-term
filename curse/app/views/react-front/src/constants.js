export const schedules = ['Вахта', 'Полный день', 'Частичная занятость', 'Проектная занятость', 'Стажировка'];
export const experiences = ['Не важно', 'Без опыта', '1-3 года', '3-6 лет', '6+ лет'];
export const userTypeDict = {
    'regular': 'prol',
    'company': 'bour',
    'admin': 'admin'
}
export function getCookie(name) {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(c => c.startsWith(`${name}=`));
    return cookie ? cookie.split('=').pop() : undefined;
}
export async function fetchForLoader(path) {
    return fetch(path).then(r => {
        if (r.ok) return r.json();
        else throw r.json();
    })
    .catch(async err => {
        err = await err;
        console.log(err);
        if (err.code === 401) {
            location.href = '/signout';
        } else if (err.code === 403) {
            location.href = '/';
        } else {
            alert(err.code, err.message);
        }
    })
    .then(d => {
        return d;
    });
}
export async function fetchWithResult(path, options, showAlert, onSuccess, onError) {
    fetch(path, options)
    .then(r => {
        if (r.ok) return r.json();
        else throw r.json();
    })
    .then(d => {
        console.log(d)
        showAlert(d.message, 'success');
        console.log('onSuccess', onSuccess);
        if (onSuccess) onSuccess(d); 
    })
    .catch(async err => { 
        err = await err;
        console.log(err);
        showAlert(err.message, 'error');
        if (onError) onError(err);
    });
}