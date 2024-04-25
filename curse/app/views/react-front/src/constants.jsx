import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import PendingIcon from '@mui/icons-material/Pending';
import { Box, Pagination } from '@mui/material';

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
export function getStatusIcon(status) {
    return {
        'X': <ThumbDownIcon sx={{color:"red"}} />,
        'Y': <ThumbUpIcon sx={{color:"green"}} />,
        'W': <PendingIcon sx={{color:"orange"}} />
    }[status]
}

export function getQueryMap(request) {
    const url = new URL(request.url);
    return { query: Object.fromEntries(url.searchParams.entries()), searchParams: url.searchParams };
}

export function CustomPagination(query, totalElements, callback) {
    return (<Box sx={{display: 'flex', justifyContent: 'center', width: '100%'}}>
    <Pagination count={Math.ceil(totalElements / 20 || 1)}
     page={Math.floor((query.offset ?? 0) / 20) + 1}
      onChange={callback}/>
  </Box>);
}