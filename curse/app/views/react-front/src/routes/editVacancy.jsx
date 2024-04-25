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
            console.log(info)
            for (let key of ['min_salary', 'max_salary', 'min_hours_per_day', 'max_hours_per_day']) {
                console.log(key, info[key])
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
    return (<Box>
        <FormGroup>
            <TextField label="Name" required variant="outlined" onChange={event => { 
                    setInfoProperty('name', event.target.value); 
                }} value={info.name} />
            <FormControlLabel label="Active" control={<Switch checked={info.active} onChange={e => { setInfoProperty('active', e.target.value); }}/>}/>
            <TextField label="Minimal salary" variant="outlined" onChange={event => { 
                    setNumeric('min_salary', event.target.value); 
                }} value={info.min_salary ?? ''} />
            <TextField label="Maximal salary" variant="outlined" onChange={event => { 
                    setNumeric('max_salary', event.target.value); 
                }} value={info.max_salary ?? ''} />
            <TextField label="Minimal hours per day" variant="outlined" onChange={event => { 
                    setNumeric('min_hours_per_day', event.target.value); 
                }} value={info.min_hours_per_day ?? ''} />
            <TextField label="Maximal hours per day" variant="outlined" onChange={event => { 
                    setNumeric('max_hours_per_day', event.target.value); 
                }} value={info.max_hours_per_day ?? ''} />
            <TextField label="Region" variant="outlined" onChange={event => { 
                    setInfoProperty('region', event.target.value); 
                }} value={info.region} />
            <FormControl variant="outlined">
                <InputLabel id="experience-label">Опыт</InputLabel>
                <Select
                    labelId="experience-label"
                    id="experience-select"
                    value={info.experience}
                    onChange={e => { setInfoProperty('experience', e.target.value); }}>
                    { experiences.map((exp, index) => <MenuItem key={index} value={index}>{ exp }</MenuItem>) }
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
            <TextField label="Description" multiline variant="outlined" onChange={event => { 
                    setInfoProperty('description', event.target.value); 
                }} value={info.description} />
        </FormGroup>
        <Button onClick={saveVacancy}>Save</Button>
        <Button onClick={deleteVacancy}>Delete</Button>
    </Box>)
}