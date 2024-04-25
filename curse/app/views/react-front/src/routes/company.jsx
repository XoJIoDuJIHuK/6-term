import { Box, Paper, Typography } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import { fetchForLoader } from '../constants';

export async function loader({ params }) {
    const info = await fetchForLoader(`/bour/info?id=${params.companyId}`);
    return { info };
}
export default function CompanyInfo() {
    const { info } = useLoaderData();
    return (<Box id='general-wrapper'>
        <Box>
            <Box>
                <img width={60} height={60} src={`/avatars/${info.id}.jpg`} onError={(e) => { console.log(e); e.target.src='/avatars/default.jpg'; }} />
                <Typography variant='h3'>{ info.name }</Typography>
            </Box>
            <Paper elevation={3} sx={{
                padding: '5px'
            }}>{ info.description || 'Нет описания' }</Paper>
        </Box>
    </Box>);
}