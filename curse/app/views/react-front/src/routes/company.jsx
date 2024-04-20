import { Box, Typography } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import { fetchForLoader } from '../constants';

export async function loader({ params }) {
    const info = await fetchForLoader(`/bour/info?id=${params.companyId}`);
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