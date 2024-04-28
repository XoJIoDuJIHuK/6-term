import { useLoaderData, NavLink } from 'react-router-dom';
import { Button, Box, Paper } from '@mui/material';
import { fetchForLoader, fetchWithResult } from '../constants';
import { useAlert } from '../components/useAlert';

export async function loader() {
    const cvs = await fetchForLoader('/prol/cv');
    return { cvs };
}
export default function CVs() {
    function createCV() {
        fetchWithResult('/prol/cv', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({
                name: 'Empty CV',
                skills: []
            })
        }, showAlert, d => {
            location.href = `/cv/edit/${d.id}`;
        });
    }

    const showAlert = useAlert();
    const { cvs } = useLoaderData();
    return (<Box id='general-wrapper'>
        <Box sx={{width: '100%'}}>
            <Button onClick={createCV}>Создать</Button>
            <Box sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'left',
                flexWrap: 'wrap'
            }}>
            { cvs.length > 0 ? cvs.map(cv => <Paper sx={{
                display: 'flex',
                padding: '10px'
            }} key={cv.id} elevation={3}>
                <NavLink to={`/cv/edit/${cv.id}`}>{ cv.name }</NavLink>
            </Paper>) : 
                'Нет резюме' }
            </Box>
        </Box>
    </Box>)
}