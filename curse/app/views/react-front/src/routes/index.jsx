import { useLoaderData } from "react-router-dom";
import { CustomPagination, fetchForLoader, getQueryMap } from "../constants";
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, Paper } from '@mui/material';
import { useState } from "react";
import { experiences, schedules } from "../constants";

export async function loader({ request }) {
  const { query, searchParams } = getQueryMap(request);
  const { data, totalElements } = await fetchForLoader(`/public-vacancies?${searchParams}`);
  return { vacancies: data, query, totalElements };
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
  function getNewHref(query) {
    return `/?${(new URLSearchParams(query)).toString()}`
  }

  const { vacancies, query, totalElements } = useLoaderData();
  console.log(query);
  const [filter, setFilter] = useState(query);
  return (<Box sx={{
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
        <Button onClick={() => {location.href=getNewHref(filter)}}>Применить</Button>
      </Box>
      <Box sx={{
        width: '100%',
        padding: '10px'
      }}>
        <Box sx={{
          display: 'flex',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <Box>{vacancies.length > 0 ? vacancies.map(vacancy => 
            <Paper key={vacancy.id} onClick={() => { location.href = `vacancy/${vacancy.id}`; }}>
                {vacancy.name}
            </Paper>) : 'No vacancies' 
          }</Box>
          {CustomPagination(query, totalElements, (e, value) => {
            query.offset = (value - 1) * 20;
            location.href = getNewHref(query) 
          })}
        </Box>
      </Box>
  </Box>);
}