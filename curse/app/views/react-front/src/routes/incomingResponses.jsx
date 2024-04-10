import { useCookies } from 'react-cookie';
import { useLoaderData } from 'react-router-dom';
import { Box, Button } from '@mui/material';

export async function loader() {
    const responses = await (await fetch('/bour/responses')).json();
    return { responses };
}

export default function IncomingResponses() {
    const { responses } = useLoaderData();
    return (<>
        <Box>{ responses.length > 0 ? responses.map(r => <Box>{ r.vacancyName }</Box>) : "No incoming responses. Loser" }</Box>
    </>);
}