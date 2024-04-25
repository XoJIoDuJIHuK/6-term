import { useLoaderData } from "react-router-dom";
import { Box, Button, Paper } from '@mui/material';
import { CustomPagination, fetchForLoader, fetchWithResult, getQueryMap } from "../constants";
import { useAlert } from "../components/useAlert";

export async function loader({ request }) {
  const query = getQueryMap(request);
  const { vacancies, totalElements } = await fetchForLoader('/bour/vacancy');
  return { vacancies, query, totalElements };
}

export default function Vacancies() {
  const { vacancies, query, totalElements } = useLoaderData();
  const showAlert = useAlert();
  return (<Box id='general-wrapper'>
    <Box>
      <Button onClick={() => {
        fetchWithResult('/bour/vacancy', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Empty vacancy',
            release_date: new Date(),
            active: false,
            schedule: 4,
            experience: 1,
            description: ''
          })
        }, showAlert, d => { location.href = `/vacancy/edit/${d.id}`; });
      }}>Создать новую</Button>
      { vacancies.length > 0 ? vacancies.map(e => <Paper sx={{
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
      }} elevation={3} key={e.id}>
          { e.name }
          <Button onClick={() => { location.href = `/vacancy/edit/${e.id}` }}>Изменить</Button>
        </Paper>) :
        <Box>Нет вакансий</Box>}
    </Box>
    {CustomPagination(query, totalElements, (e, value) => {
      query.offset = (value - 1) * 20;
      location.href = `/${location.pathname}?offset=${query.offset}`
    })}
  </Box>);
}