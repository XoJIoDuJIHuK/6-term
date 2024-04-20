import { useLoaderData } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { fetchForLoader, fetchWithResult } from '../constants';
import { useAlert } from '../components/useAlert';

export async function loader() {
    const cvs = await (await fetch('/prol/cv')).json();
    const responses = await fetchForLoader('/prol/responses');
    console.log(cvs, responses);
    return { cvs, responses };
}

export default function OutcomingResponses() {
    const showAlert = useAlert();
    function Response(response) {
        const cv = cvs.find(cv => cv.id === response.cv);
        return (<>
            <Box>{ response.vacancyName } - { cv.name }<Button onClick={() => {
                fetchWithResult('/prol/responses', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvId: response.cv,
                        vacancyId: response.vacancy
                    })
                }, showAlert, () => { location.href = '/outcoming-responses'; });
            }}>Отозвать</Button></Box>
        </>)
    }

    const { cvs, responses } = useLoaderData();
    return (<>{ responses.length > 0 ? responses.map(r => Response(r)) : <div>No Responses</div> }</>)
}