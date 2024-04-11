import { useState } from 'react';
import { useLoaderData, NavLink } from 'react-router-dom';
import { Box, Button, Dialog, DialogTitle, Chip } from '@mui/material';

export async function loader() {
    const data = await (await fetch('/bour/responses')).json();
    console.log(data)
    const responses = data.responses.map(r => {
        return {
            ...r,
            cv: data.cvs.find(c => c.id === r.cv),
            vacancy: data.vacancies.find(v => v.id === r.vacancy),
        }
    });
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

    const [selectedResponse, setSelectedResponse] = useState({
        id: -1,
        status: 'W',
        cv: {
            skills_json: [],
            id: -1,
            name: 'I\'m serious, how did you open it?',
            applicant: {
                name: '',
                experience_json: [],
                education_json: []
            }
        },
        vacancy: {
            id: -1,
            name: 'How did you open it?'
        }
    });
    const [dialogIsOpen, setDialogOpen] = useState(false);
    const { responses } = useLoaderData();
    return (<>
        <Dialog onClose={closeDialog} open={dialogIsOpen}>
            <DialogTitle>{ selectedResponse.vacancy.name }</DialogTitle>
            <Box>CV: { selectedResponse.cv.name }</Box>
            <Box><Box>Applicant:</Box>
                <Box>Name: { selectedResponse.cv.applicant.name }</Box>
                <Box>Experience: { selectedResponse.cv.applicant.experience_json || "No experience" }</Box>
                <Box>Education: { selectedResponse.cv.applicant.education_json || "No education" }</Box>
            </Box>
            Skills: { selectedResponse.cv.skills_json.length > 0 ?
                selectedResponse.cv.skills_json.map(s => <Chip key={s} label={s}/>) :
                "No skills" }
            <NavLink to={`/vacancy/${selectedResponse.vacancy.id}`}>To vacancy</NavLink>
        </Dialog>
        <Box>{ responses.length > 0 ? 
                responses.map(r => <Box key={r.id}>{ r.vacancy.name } - { r.cv.name }
                <Button onClick={() => selectResponse(r.id)}>Open</Button>
            </Box>) : "No incoming responses. Loser. Post a vacancy or something" }
        </Box>
    </>);
}