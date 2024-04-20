import { Box, Button, Accordion, AccordionSummary, AccordionDetails, AccordionActions } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLoaderData } from 'react-router-dom';
import { fetchForLoader, fetchWithResult } from '../constants';
import { useAlert } from '../components/useAlert';

export async function loader() {
    const requests = await fetchForLoader('/admin/promotion-requests');
    return { requests };
}

export default function PromotionRequests() {
    function sendRequest(decision, requestId) {
        fetchWithResult(`/admin/promote?requestId=${requestId}`, {
            method: decision ? 'PATCH' : 'DELETE'
        }, showAlert);
    }

    const showAlert = useAlert();
    const { requests } = useLoaderData();
    return (<Box id='general-wrapper'>
        <Box>{ requests.length > 0 ? requests.map(r => <Accordion key={r.id}>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
        >{ r.company_name }</AccordionSummary>
        <AccordionDetails>{ r.proof }</AccordionDetails>
        <AccordionActions>
          <Button onClick={() => {sendRequest(false, r.id)}}>Отказать</Button>
          <Button onClick={() => {sendRequest(true, r.id)}}>Принять</Button>
        </AccordionActions>
      </Accordion>)
        : 'Нет запросов'}</Box>
    </Box>)
}