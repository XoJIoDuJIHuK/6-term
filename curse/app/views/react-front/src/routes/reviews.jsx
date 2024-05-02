import { NavLink, useLoaderData } from 'react-router-dom';
import { Box, Button, Rating, Typography, Paper } from '@mui/material';
import { CustomPagination, fetchForLoader, fetchWithResult, getCookie, getQueryMap } from '../constants';
import { useAlert } from '../components/useAlert';

export async function loader({ params, request }) {
    const query = getQueryMap(request);
    const isCompany = params.userType === 'company';
    const { data, totalElements } = await fetchForLoader(`/${isCompany ? "company-reviews" : 
        "bour/review"}?id=${params.userId}`);
    return { data, isCompany, query, totalElements };
}

export default function Reviews() {
    const showAlert = useAlert();
    const { isCompany, query, data, totalElements } = useLoaderData();
    const { id, name, rating, reviews, myReviewId, reviewAllowed } = data;
    const userType = getCookie('user_type');
    return (<Box id='general-wrapper'>
        <Box>
            <Box>Имя: { isCompany ? <NavLink to={`/company/${id}`}>{ name }</NavLink> : name }</Box>
            <Box>{ Number.isFinite(rating) ? <Typography variant='h3'>{rating.toFixed(1)}</Typography> : "Нет оценок" }</Box>
            { reviewAllowed ? 
                <NavLink to={`/createReview`}>Оставить отзыв</NavLink> 
            : <></> }
            { reviews.length > 0 ? reviews.map(r => <Paper elevation={3} key={r.id} sx={{
                    padding: '5px',
                    width: '500px'
                }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    {r.author}; 
                    <Rating readOnly value={r.rating} />
                </Box>
                <Box>{r.text}</Box>
                <Box>
                    { r.id === myReviewId ? <Button onClick={() => {
                        fetchWithResult(`/${userType === 'company' ? 'bour' : 'prol'}/review?id=${r.id}`, 
                        { method: 'DELETE' }, showAlert, () => { location.reload(); });
                    }}>Удалить</Button> : <Button onClick={() => {
                        fetchWithResult(`/report-review?id=${r.id}`, { method: 'PUT' }, showAlert);
                    }}>Пожаловаться</Button> }
                </Box>
            </Paper>) 
            : <Box></Box>}
        </Box>
        {CustomPagination(query, totalElements, (e, value) => {
            query.offset = (value - 1) * 20;
            location.href = `${location.pathname}?offset=${query.offset}`
        })}
    </Box>)
}