import { useLoaderData, NavLink } from "react-router-dom";
import { fetchForLoader } from "../constants";
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { useState } from "react";
import { experiences, schedules } from "../constants";

export async function loader({ request }) {
  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams.entries());
  const vacancies = await fetchForLoader(`/public-vacancies?${url.searchParams}`);
  return { vacancies, query };
}

export default function Index() {
  function setFilterProperty(key, value) {
    setFilter({ ...filter, [key]: value });
  }
  function setNumeric(key, value) {
    value = +value;
    console.log(value)
    if (!Number.isNaN(value) && Number.isInteger(value) && value >= 0) setFilterProperty(key, value);
  }

  const { vacancies, query } = useLoaderData();
  const [filter, setFilter] = useState(query);
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between'
    }}>
      <Box id="sidebar">
        <Box><TextField label='Ключевое слово' onChange={e => {setFilterProperty('text', e.target.value)}} value={filter.text ?? ''}/></Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box>
            Зарплата
            <TextField label='От' onChange={e => {setNumeric('min_salary', e.target.value)}} value={filter.min_salary ?? ''}/>
            <TextField label='До' onChange={e => {setNumeric('max_salary', e.target.value)}} value={filter.max_salary ?? ''}/>
          </Box>
          <Box>
            Часов в день
            <TextField label='От' onChange={e => {setNumeric('min_hours_per_day', e.target.value)}} value={filter.min_hours_per_day ?? ''}/>
            <TextField label='До' onChange={e => {setNumeric('max_hours_per_day', e.target.value)}} value={filter.max_hours_per_day ?? ''}/>
          </Box>
          <Box>
            <TextField label='Регион' onChange={e => {setFilterProperty('region', e.target.value)}} value={filter.region ?? ''}/>
          </Box>
          <FormControl variant="outlined" sx={{width: '100%'}}>
                <InputLabel id="experience-label">Опыт</InputLabel>
                <Select
                    labelId="experience-label"
                    id="experience-select"
                    value={filter.experience}
                    onChange={e => { setFilterProperty('experience', e.target.value); }}>
                    { experiences.map((exp, index) => <MenuItem key={index + 1} value={index + 1}>{ exp }</MenuItem>) }
                </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{width: '100%'}}>
                <InputLabel id="schedule-label">График</InputLabel>
                <Select
                    labelId="schedule-label"
                    id="schedule-select"
                    value={filter.schedule}
                    onChange={e => { setFilterProperty('schedule', e.target.value); }}>
                    { schedules.map((sch, index) => <MenuItem key={index + 1} value={index + 1}>{ sch }</MenuItem>) }
                </Select>
            </FormControl>
        </Box>
        <Button onClick={() => {location.href=`/`}}>Сбросить фильтры</Button>
        <Button onClick={() => {location.href=`/?${(new URLSearchParams(filter)).toString()}`}}>Применить</Button>
      </Box>
      <Box sx={{width: '100%'}}>
        {vacancies.length > 0 ? (
          <ul>
            {vacancies.map((vacancy) => (
              <li key={vacancy.id}>
                <NavLink
                  to={`vacancy/${vacancy.id}`}
                  className={({ isActive, isPending }) =>
                    isActive
                      ? "active"
                      : isPending
                      ? "pending"
                      : ""
                  }
                >
                  {vacancy.name}
                </NavLink>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            <i>No vacancies</i>
          </p>
        )}
      </Box>
    </Box>
  );
}