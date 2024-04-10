import { useLoaderData } from "react-router-dom";
import { Box, Button } from '@mui/material';

export async function loader() {
  const vacancies = await (await fetch('/bour/vacancy')).json();
  console.log(vacancies)
  return { vacancies };
}

export default function Vacancies() {
  const { vacancies } = useLoaderData();

  return (
    <>
    { vacancies.length > 0 ? vacancies.map(e => <Box key={e.id}>{ e.name } <Button onClick={() => { location.href = `/vacancy/edit/${e.id}` }}>Edit</Button></Box>) :
      <Box>No vacancies</Box>}
    <Button onClick={createVacancy}>Create</Button>
    </>
  );
}
function createVacancy() {
  fetch('/bour/vacancy', {
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
  }).then(r => {
      if (r.ok) {
        return r.json();
      } else {
        throw r.json();
      }
  }).then(d => {
      location.href = `/vacancy/edit/${d}`;
  }).catch(e => {

  });
  
}