import { useState } from 'react';
import { useLoaderData, NavLink } from 'react-router-dom';
import { Box, Button, Dialog, DialogTitle, Chip, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import PendingIcon from '@mui/icons-material/Pending';
import { fetchForLoader, fetchWithResult } from '../constants';
import { useAlert } from '../components/useAlert';

export async function loader() {
    const responses = await fetchForLoader('/bour/responses');
    console.log(responses);
    return { responses };
}

export default function IncomingResponses() {
    function openDialog() {
        setDialogOpen(true);
    }
    function closeDialog() {
        setDialogOpen(false);
    }
    function selectResponse(id) {
        setSelectedResponse(responses.find(r => r.id === id));
        openDialog();
    }
    function formatDate(period) {
        return period[0] ? `С ${period[0]}${period[1] ? (' по ' + period[1]) : ''}` : period[1] ? `До ${period[1]}` : 'Временной промежуток не указан';
    }
    function setResponseStatus(status) {
        fetchWithResult('/bour/responses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                responseId: selectedResponse.id,
                newStatus: status
            })
        }, showAlert, () => { location.reload(); });
    }
    function Experience(experiences) {
        return <Box>{ experiences.length > 0 ? <>Опыт {experiences.map((exp, index) => {
            return <Accordion key={index} expandIcon={<ExpandMoreIcon/>}>
                <AccordionSummary>{ exp.place }</AccordionSummary>
                <AccordionDetails>
                    { exp.function }
                    { formatDate(exp.period) }
                    { exp.commentary }
                </AccordionDetails>
            </Accordion>
        })}</> : "Без опыта" }</Box>
    }
    function Education(educations) {
        console.log('ed', educations)
        return <Box>{ educations.length > 0 ? <>Образование {educations.map((exp, index) => {
            return <Accordion key={index} expandIcon={<ExpandMoreIcon/>}>
                <AccordionSummary>{ exp.institution }</AccordionSummary>
                <AccordionDetails>
                    { exp.speciality }
                    { formatDate(exp.period) }
                </AccordionDetails>
            </Accordion>
        })}</> : "Без образования" }</Box>
    }
    function getStatusIcon(status) {
        return {
            'X': <ThumbDownIcon sx={{color:"red"}} />,
            'Y': <ThumbUpIcon sx={{color:"green"}} />,
            'W': <PendingIcon sx={{color:"orange"}} />
        }[status]
    }

    const [selectedResponse, setSelectedResponse] = useState({
        id: -1,
        status: 'W',
        cv: {
            skills: [],
            id: -1,
            name: 'I\'m serious, how did you open it?',
            applicant: {
                name: '',
                experience: [],
                education: []
            }
        },
        vacancy: {
            id: -1,
            name: 'How did you open it?'
        }
    });
    const showAlert = useAlert();
    const [dialogIsOpen, setDialogOpen] = useState(false);
    const { responses } = useLoaderData();
    return (<>
        <Dialog className='response-dialog' onClose={closeDialog} open={dialogIsOpen}>
            <DialogTitle sx={{textAlign: 'center'}}>{ selectedResponse.vacancy.name }</DialogTitle>
            <Box>Резюме: { selectedResponse.cv.name }</Box>
            <Box><Box>Соискатель:</Box>
                <Box>Имя: { selectedResponse.cv.applicant.name }</Box>
                { Education(selectedResponse.cv.applicant.education) }
                { Experience(selectedResponse.cv.applicant.experience) }
                <NavLink to={`/reviews/regular/${selectedResponse.cv.applicant.id}`}>Отзывы о кандидате</NavLink>
            </Box>
            <Box>Навыки: { selectedResponse.cv.skills.length > 0 ?
                selectedResponse.cv.skills.map(s => <Chip key={s} label={s}/>) :
                "No skills" }</Box>
            <NavLink to={`/vacancy/${selectedResponse.vacancy.id}`}>Вакансия</NavLink>
            { selectedResponse.status === 'W' ? <>
                <Button onClick={() => { setResponseStatus('Y') }}>Принять</Button>
                <Button onClick={() => { setResponseStatus('X') }}>Отказать</Button>
            </> : <></> }
        </Dialog>
        <Box id='general-wrapper'>
            { responses.length > 0 ? 
                responses.map(r => 
                <Paper elevation={3} key={r.id} className='incoming-response'><Box>{getStatusIcon(r.status)}</Box>
                    <Box className='cell'>{ r.vacancy.name }</Box>
                    <Box className='cell'>{ r.cv.name }</Box>
                    <Box className='cell'>{ r.cv.applicant.name }</Box>
                    <Button onClick={() => selectResponse(r.id)}>Просмотреть</Button>
                </Paper>) : "No incoming responses. Loser. Post a vacancy or something"
            }
        </Box>
    </>);
}