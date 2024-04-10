import { useCookies } from 'react-cookie';
import { useLoaderData } from 'react-router-dom';
import { Box, Button } from '@mui/material';

export async function loader() {
    const cvs = await (await fetch('/prol/cv')).json();
    const responses = await (await fetch('/prol/responses')).json();
    console.log(cvs, responses);
    return { cvs, responses };
}

export default function OutcomingResponses() {
    function Response(response) {
        const cv = cvs.find(cv => cv.id === response.cv);
        return (<>
            <Box>{ response.vacancyName } - { cv.name }<Button onClick={() => {
                fetch('/prol/responses', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        cvId: response.cv,
                        vacancyId: response.vacancy
                    })
                }).then(r => {
                    if (r.ok) {
                        return r.json();
                    } else {
                        throw r.json();
                    }
                }).then(d => {
                    location.href = '/outcoming-responses';
                }).catch(e => {

                })
            }}>Отозвать</Button></Box>
        </>)
    }

    const { cvs, responses } = useLoaderData();
    const [cookies] = useCookies(['user_type', 'username']);
    return (<>
        { responses.length > 0 ? responses.map(r => Response(r)) : <div>No Responses</div>
        }
    </>)
}