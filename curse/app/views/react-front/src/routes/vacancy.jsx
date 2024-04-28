import { Box, Typography, Button, Dialog, List, ListItem, ListItemText, ListItemButton, DialogTitle } from '@mui/material';
import { experiences, schedules, getCookie, fetchForLoader, fetchWithResult, SalaryToString } from '../constants';
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
    function responsePart(open) {
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
    const [vacancyState, setVacancy] = useState(vacancy)

    const isSecure = location.protocol === "https:";
    const url = (isSecure ? "wss://" : "ws://") + location.host + "/_ws";
    const wsConnection = new WebSocket(url);
    wsConnection.addEventListener('message', event => {
        const changedVacancy = event.data ? JSON.parse(event.data) : null;
        if (!changedVacancy || !changedVacancy.active) {
            alert('Вакансия больше не доступна');
            location.href = '/';
        }
        setVacancy({ ...changedVacancy, company: vacancyState.company });
    })

    const [dialogIsOpen, setDialogOpen] = useState(false);
    const showAlert = useAlert();
    return (<Box>
        <Typography variant='h3'>{ vacancyState.name }</Typography>
        <Typography variant='h4'><NavLink to={`/company/${company.id}`}>{ company.name }</NavLink></Typography>
        <Typography variant='h5'>{ vacancyState.release_date }</Typography>
        <Typography variant='h5'>{ vacancyState.region || 'Регион не указан' }</Typography>
        <Typography variant='h5'>{ experiences[vacancyState.experience] }</Typography>
        <Typography variant='h5'>{ schedules[vacancyState.schedule - 1] }</Typography>
        { SalaryToString(vacancyState) }
        <Box>{ vacancyState.min_hours_per_day ? <>От { vacancyState.min_hours_per_day }{ vacancyState.max_hours_per_day ? 
            <> до { vacancyState.max_hours_per_day } часов в день</> : ' часов в день' }</> : vacancyState.max_hours_per_day ? 
            <>До { vacancyState.max_hours_per_day } часов в день</> : 'Количество рабочих часов не указано'}</Box>
        <Box>{ vacancyState.description }</Box>
        { (cookies.user_type === 'regular') ? responsePart(dialogIsOpen) : <></> }
    </Box>);
}