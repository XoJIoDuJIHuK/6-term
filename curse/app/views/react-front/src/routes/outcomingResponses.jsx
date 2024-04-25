import { useLoaderData } from 'react-router-dom';
import { Box, Button, Paper } from '@mui/material';
import { CustomPagination, fetchForLoader, fetchWithResult, getQueryMap, getStatusIcon } from '../constants';
import { useAlert } from '../components/useAlert';

export async function loader({ request }) {
    const { query } = getQueryMap(request);
    const cvs = await (await fetch('/prol/cv')).json();
    const { responses, totalElements } = await fetchForLoader('/prol/responses');
    console.log(cvs, responses);
    return { cvs, responses, query, totalElements };
}

export default function OutcomingResponses() {
    const showAlert = useAlert();
    function Response(response) {
        const cv = cvs.find(cv => cv.id === response.cv);
        return (<Paper elevation={3} className='response'>
            <Box>{getStatusIcon(response.status)}</Box>
            <Box className='cell'>{ response.vacancyName }</Box>
            <Box className='cell'>{ cv.name }</Box>
            <Button onClick={() => {
                fetchWithResult('/prol/responses', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        cvId: response.cv,
                        vacancyId: response.vacancy
                    })
                }, showAlert, () => { location.href = '/outcoming-responses'; });
            }}>Отозвать</Button></Paper>)
    }

    const { cvs, responses, query, totalElements } = useLoaderData();
    return (<Box id='general-wrapper'>
        <Box>{ responses.length > 0 ? responses.map(r => Response(r)) : 'Нет откликов' }</Box>
        {CustomPagination(query, totalElements, (e, value) => {
            query.offset = (value - 1) * 20;
            location.href = `/outcoming-responses?offset=${query.offset}`
        })}
    </Box>)
}