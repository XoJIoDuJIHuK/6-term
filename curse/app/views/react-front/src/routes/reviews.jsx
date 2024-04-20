import { NavLink, useLoaderData } from 'react-router-dom';
import { Box, Button, Rating, Typography } from '@mui/material';
import { fetchForLoader, fetchWithResult, getCookie } from '../constants';

export async function loader({ params }) {
    const data = await fetchForLoader(`/${params.userType === 'company' ? "company-reviews" : 
        "bour/review"}?id=${params.userId}`);
    return data;
}

export default function Reviews() {
    const { id, name, rating, reviews, myReviewId, reviewAllowed } = useLoaderData();
    const userType = getCookie('user_type');
    return (<>
        <Box>Имя: { name }</Box>
        <Box>{ rating === null ? "Нет оценок" : <Typography variant='h3'>{rating.toFixed(1)}</Typography> }</Box>
        { myReviewId ? <Button onClick={() => {
            fetchWithResult(`/${userType === 'company' ? 'bour' : 'prol'}/review?id=${myReviewId}`, { method: 'DELETE' }, () => {
                location.reload();
            });
        }}>Удалить мой отзыв</Button> : <></> }
        { reviewAllowed ? 
            <NavLink to={`/createReview`}>Оставить отзыв</NavLink> 
        : <></> }
        { reviews.length > 0 ? reviews.map(r => <Box key={r.id}>
            author: {r.author}; 
            <Rating readOnly value={r.rating} />
            text: {r.text}</Box>) 
        : <Box></Box>}
    </>)
}