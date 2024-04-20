import { NavLink, useLoaderData } from "react-router-dom";
import { Box,Rating, Paper } from '@mui/material';
import { fetchForLoader } from "../constants";

export async function loader() {
    const companies = await fetchForLoader('/public-companies');
    return { companies };
}

export default function PublicCompanies() {
    const { companies } = useLoaderData();
    return (<Box sx={{
        width: '100%'
    }} id='general-wrapper'>
        { companies.length > 0 ? companies.map(c => <Paper sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '5px',
            width: 'max-content',
        }} elevation={3} key={c.id}>
                <NavLink to={`/reviews/company/${c.id}`}>{ c.name }</NavLink>
                {c.rating === null ? 'Нет отзывов': <Rating readOnly value={c.rating}/>}
            </Paper>)
         : <Box>Компаний не существует</Box>}
    </Box>)
}