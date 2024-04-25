import { NavLink, useLoaderData } from "react-router-dom";
import { Box,Rating, Paper } from '@mui/material';
import { CustomPagination, fetchForLoader, getQueryMap } from "../constants";

export async function loader({ request }) {
    const query = getQueryMap(request);
    const { companies, totalElements } = await fetchForLoader('/public-companies');
    return { companies, query, totalElements };
}

export default function PublicCompanies() {
    const { companies, query, totalElements } = useLoaderData();
    return (<Box sx={{
        width: '100%'
    }} id='general-wrapper'>
        <Box>{ companies.length > 0 ? companies.map(c => <Paper sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '5px',
            width: 'max-content',
        }} elevation={3} key={c.id}>
                <NavLink to={`/reviews/company/${c.id}`}>{ c.name }</NavLink>
                {c.rating === null ? 'Нет отзывов': <Rating readOnly value={c.rating}/>}
            </Paper>)
         : 'Компаний не существует'}</Box>
        {CustomPagination(query, totalElements, (e, value) => {
            query.offset = (value - 1) * 20;
            location.href = `/publicCompanies?offset=${query.offset}`
        })}
    </Box>)
}