import { useLoaderData } from "react-router-dom";
import { TextField, Button, Switch, FormGroup, InputLabel, Select, MenuItem, FormControlLabel, FormControl, Box } from '@mui/material';
import { useState } from "react";
import { experiences, fetchForLoader, fetchWithResult, schedules } from '../constants';
import { useAlert } from '../components/useAlert';

export async function loader({ params }) {
    const vacancy = await fetchForLoader(`/bour/vacancy?id=${params.vacancyId}`);
    return { vacancy };
}

export default function EditVacancy() {//TODO: fix too many requests to /bour/vacancy
    function saveVacancy() {
        function validateInfo() {
            for (let key of ['min_salary', 'max_salary', 'min_hours_per_day', 'max_hours_per_day']) {
                if (info[key] && (!Number.isInteger(info[key]) && info[key] < 0)) return false;
                if ((key === 'min_hours_per_day' || key === 'max_hours_per_day') && info[key] > 24) return false;
            }
            if (info.name.length === 0) return false;
            return true;
        }

        if (!validateInfo()) {
            showAlert('Неправильные данные', 'error');
            return;
        }
        fetchWithResult('/bour/vacancy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(info)
        }, showAlert, () => { location.href = '/vacancy'; });
    }
    function deleteVacancy() {
        fetchWithResult('/bour/vacancy', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: info.id })
        }, showAlert, () => { location.href = '/vacancy'; });
    }
    function setInfoProperty(key, value) {
        setInfo({
            ...info,
            [key]: value
        })
    }
    function setNumeric(key, newValue) {
        newValue = +newValue;
        if (Number.isInteger(newValue) && newValue >= 0) setInfoProperty(key, newValue);
    }

    const showAlert = useAlert();
    const { vacancy } = useLoaderData();
    const [info, setInfo] = useState(vacancy);
    return (<Box id='general-wrapper'>
        <Box sx={{
            display: 'block',
            width: '100%'
        }}>
            <FormGroup>
                <TextField label="Название" required variant="outlined" onChange={event => { 
                        setInfoProperty('name', event.target.value); 
                    }} value={info.name} />
                <FormControlLabel label="Активная" control={<Switch checked={info.active} onChange={e => { setInfoProperty('active', e.target.value); }}/>}/>
                <Box>
                    <TextField type="number" label="Минимальная зарплата" variant="outlined" onChange={event => { 
                            setNumeric('min_salary', event.target.value); 
                        }} value={info.min_salary ?? ''} />
                    <TextField type="number" label="Максимальная зарплата" variant="outlined" onChange={event => { 
                            setNumeric('max_salary', event.target.value); 
                        }} value={info.max_salary ?? ''} />
                </Box>
                <Box>
                    <TextField type="number" label="Минимум часов в день" variant="outlined" onChange={event => { 
                            setNumeric('min_hours_per_day', event.target.value); 
                        }} value={info.min_hours_per_day ?? ''} />
                    <TextField type="number" label="Максимум часов в день" variant="outlined" onChange={event => { 
                            setNumeric('max_hours_per_day', event.target.value); 
                        }} value={info.max_hours_per_day ?? ''} />
                </Box>
                <TextField label="Регион" variant="outlined" onChange={event => { 
                        setInfoProperty('region', event.target.value); 
                    }} value={info.region} />
                <FormControl variant="outlined">
                    <InputLabel id="experience-label">Опыт</InputLabel>
                    <Select
                        labelId="experience-label"
                        id="experience-select"
                        value={info.experience}
                        onChange={e => { setInfoProperty('experience', e.target.value); }}>
                        { experiences.slice(1).map((exp, index) => <MenuItem key={index + 1} value={index + 1}>{ exp }</MenuItem>) }
                    </Select>
                </FormControl>
                <FormControl variant="outlined">
                    <InputLabel id="schedule-label">График</InputLabel>
                    <Select
                        labelId="schedule-label"
                        id="schedule-select"
                        value={info.schedule}
                        onChange={e => { setInfoProperty('schedule', e.target.value); }}>
                        { schedules.map((sch, index) => <MenuItem key={index + 1} value={index + 1}>{ sch }</MenuItem>) }
                    </Select>
                </FormControl>
                <TextField className='mui-input' label="Описание" multiline variant="outlined" onChange={event => { 
                        setInfoProperty('description', event.target.value); 
                    }} value={info.description} />
            </FormGroup>
            <Button onClick={saveVacancy}>Сохранить</Button>
            <Button onClick={deleteVacancy}>Удалить</Button>
        </Box>
    </Box>)
}