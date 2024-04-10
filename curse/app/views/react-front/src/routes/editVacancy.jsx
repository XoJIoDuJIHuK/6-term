import { useLoaderData } from "react-router-dom";
import { TextField, Button, Switch, FormGroup, InputLabel, Select, MenuItem, FormControlLabel, FormControl } from '@mui/material';
import { useState } from "react";
import { experiences, schedules } from '../constants';

export async function loader({ params }) {
    const vacancy = await (await fetch(`/bour/vacancy?id=${params.vacancyId}`)).json();
    console.log(vacancy);
    return { vacancy };
}

export default function EditVacancy() {//TODO: fix too many requests to /bour/vacancy
    function saveVacancy() {
        function validateInfo() {
            return true;
        }

        if (!validateInfo()) return;
        fetch('/bour/vacancy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        }).then(r => {
            if (r.ok) {
                location.href = '/vacancy';
            }
        })
    }
    function deleteVacancy() {
        fetch('/bour/vacancy', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: info.id })
        }).then(r => {
            if (r.ok) {
                location.href = '/vacancy';
            }
        })
    }
    function setInfoProperty(key, value) {
        setInfo({
            ...info,
            [key]: value
        })
    }
    function setNumeric(key, newValue) {//TODO: fix text input
        const regex = /^([1-9][0-9]*|0)(.[0-9]+)?$/;
        if (newValue.length > 0 && !regex.test(newValue)) return;
        setInfoProperty(key, newValue);
    }

    const { vacancy } = useLoaderData();
    const [info, setInfo] = useState(vacancy);
    return (<>
        <FormGroup>
            <TextField label="Name" required variant="outlined" onChange={event => { 
                    setInfoProperty('name', event.target.value); 
                }} value={info.name} />
            <FormControlLabel label="Active" control={<Switch checked={info.checked} onChange={e => { setInfoProperty('active', e.target.value); }}/>}/>
            <TextField label="Minimal salary" variant="outlined" onChange={event => { 
                    setNumeric('min_salary', event.target.value); 
                }} value={info.min_salary} />
            <TextField label="Maximal salary" variant="outlined" onChange={event => { 
                    setNumeric('max_salary', event.target.value); 
                }} value={info.max_salary} />
            <TextField label="Minimal hours per day" variant="outlined" onChange={event => { 
                    setNumeric('min_hours_per_day', event.target.value); 
                }} value={info.min_hours_per_day} />
            <TextField label="Maximal hours per day" variant="outlined" onChange={event => { 
                    setNumeric('max_hours_per_day', event.target.value); 
                }} value={info.max_hours_per_day} />
            <TextField label="Region" variant="outlined" onChange={event => { 
                    setInfoProperty('region', event.target.value); 
                }} value={info.region} />
            <FormControl variant="filled">
                <InputLabel id="experience-label">Experience</InputLabel>
                <Select
                    labelId="experience-label"
                    id="experience-select"
                    value={info.experience}
                    onChange={e => { setInfoProperty('experience', e.target.value); }}>
                    { experiences.map((exp, index) => <MenuItem key={index + 1} value={index + 1}>{ exp }</MenuItem>) }
                </Select>
            </FormControl>
            <FormControl variant="filled">
                <InputLabel id="schedule-label">Experience</InputLabel>
                <Select
                    labelId="schedule-label"
                    id="schedule-select"
                    value={info.schedule}
                    onChange={e => { setInfoProperty('schedule', e.target.value); }}>
                    { schedules.map((sch, index) => <MenuItem key={index + 1} value={index + 1}>{ sch }</MenuItem>) }
                </Select>
            </FormControl>
            <TextField label="Description" required multiline variant="outlined" onChange={event => { 
                    setInfoProperty('description', event.target.value); 
                }} value={info.description} />
        </FormGroup>
        <Button onClick={saveVacancy}>Save</Button>
        <Button onClick={deleteVacancy}>Delete</Button>
    </>)
}