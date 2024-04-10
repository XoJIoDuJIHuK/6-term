import { Box, Typography, Button } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export async function loader({ params }) {
    const info = await (await fetch(`/bour/info?id=${params.companyId}`)).json();
    return { info };
}
export default function CompanyInfo() {
    const { info } = useLoaderData();
    return (<>
        <Box>
            <Typography variant='h3'>{ info.name }</Typography>
            <Box>{ info.description }</Box>
        </Box>
    </>)
}