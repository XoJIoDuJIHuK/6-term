import { Box, Typography, Button, Dialog, List, ListItem, ListItemText, ListItemButton, DialogTitle } from '@mui/material';
import { experiences, schedules, getCookie, fetchForLoader, fetchWithResult } from '../constants';
import { NavLink, useLoaderData } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { useState } from 'react';
import { useAlert } from "../components/useAlert";

export async function loader({ params }) {
    const vacancy = await fetchForLoader(`/public-vacancies?id=${params.vacancyId}`);
    const company = await fetchForLoader(`/bour/info?id=${vacancy.company}`);
    const userType = getCookie('user_type');
    const cvs = userType === 'regular' ? await fetchForLoader(`/prol/cv?vacancy=${vacancy.id}`) : [];
    return { vacancy, company, cvs };
}

export default function Vacancy() {
    function makeResponse(cv) {
        fetchWithResult('/prol/responses', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cv: cv.id,
                vacancy: vacancy.id
            })
        }, showAlert, () => { location.reload(); });
    }
    function openDialog() {
        setDialogOpen(true);
    }
    function closeDialog() {
        setDialogOpen(false);
    }
    function responsePart(props) {
        const { open } = props;
        return (<>
            <Button onClick={openDialog}>Откликнуться</Button>
            <Dialog onClose={closeDialog} open={open}>
            <DialogTitle>Set backup account</DialogTitle>
            <List sx={{ pt: 0 }}>
                { cvs.length > 0 ? cvs.map((cv) => (
                <ListItem disableGutters key={cv.id}>
                    <ListItemButton onClick={() => makeResponse(cv)}>
                        <ListItemText primary={cv.name} />
                    </ListItemButton>
                </ListItem>
                )) : "Нет доступных резюме" }
                <ListItem disableGutters>
                <ListItemButton
                    autoFocus
                    onClick={() => { location.href = '/cv'; }}
                >
                    <ListItemText primary="Перейти к резюме" />
                </ListItemButton>
                </ListItem>
            </List>
            </Dialog>
        </>)
    }

    const [cookies] = useCookies();
    const { vacancy, company, cvs } = useLoaderData();
    const [dialogIsOpen, setDialogOpen] = useState(false);
    const showAlert = useAlert();
    return (<Box>
        <Typography variant='h3'>{ vacancy.name }</Typography>
        <Typography variant='h4'><NavLink to={`/company/${company.id}`}>{ company.name }</NavLink></Typography>
        <Typography variant='h5'>{ vacancy.release_date }</Typography>
        <Typography variant='h5'>{ vacancy.region || 'Регион не указан' }</Typography>
        <Typography variant='h5'>{ experiences[vacancy.experience - 1] }</Typography>
        <Typography variant='h5'>{ schedules[vacancy.schedule - 1] }</Typography>
        <Box>{ vacancy.min_salary ? <>От { vacancy.min_salary }{ vacancy.max_salary ? <>до { vacancy.max_salary }</> : ' рублей' }</> : 
            vacancy.max_salary ? <>До { vacancy.max_salary } рублей</> : 'З/п не указана'}</Box>
        <Box>{ vacancy.min_hours_per_day ? <>От { vacancy.min_hours_per_day }{ vacancy.max_hours_per_day ? 
            <> до { vacancy.max_hours_per_day } часов в день</> : ' часов в день' }</> : vacancy.max_hours_per_day ? 
            <>До { vacancy.max_hours_per_day } часов в день</> : 'Количество рабочих часов не указано'}</Box>
        <Box>{ vacancy.description }</Box>
        { (cookies.user_type === 'regular') ? responsePart({ open: dialogIsOpen }) : <></> }
    </Box>);
}