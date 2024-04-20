import { Box, Button, Accordion, AccordionSummary, AccordionDetails, AccordionActions } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLoaderData } from 'react-router-dom';
import { fetchForLoader, fetchWithResult } from '../constants';
import { useAlert } from '../components/useAlert';

export async function loader() {
    const requests = await fetchForLoader('/admin/drop-requests');
    console.log(requests)
    return { requests };
}

export default function DropRequests() {
  function sendRequest(decision, requestId, isCompany) {
    fetchWithResult(`/admin/drop-user?requestId=${requestId}&userType=${isCompany === 'Y' ? 'company' : 'regular'}`, {
        method: decision ? 'DELETE' : 'POST'
    }, showAlert, () => { location.reload(); });
  }

  const showAlert = useAlert();
  const { requests } = useLoaderData();
  return (<>
      <Box>{ requests.length > 0 ? requests.map(r => <Accordion key={r.id}>
      <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
      >{ r.isCompany === 'Y' ? 'Company' : 'User' } - { r.account_id }</AccordionSummary>
      <AccordionDetails>{ r.commentary }</AccordionDetails>
      <AccordionActions>
        <Button onClick={() => {sendRequest(false, r.id, r.isCompany)}}>Refuse</Button>
        <Button onClick={() => {sendRequest(true, r.id, r.isCompany)}}>Delete account</Button>
      </AccordionActions>
    </Accordion>)
      : 'No requests'}</Box>
  </>)
}