import { useLoaderData } from "react-router-dom";
import { TextField, Box, Button, Chip } from '@mui/material';
import { useState, useEffect } from "react";
import { fetchForLoader, fetchWithResult } from "../constants";
import { useAlert } from '../components/useAlert';

export async function loader({ params }) {
    const cv = await fetchForLoader(`/prol/cv?id=${params.cvId}`);
    return { cv };
}

export default function EditCv() {//TODO: fix too many requests to /prol/cv
    function saveCv() {
        fetchWithResult('/prol/cv', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: cv.id,
                name,
                skills
            })
        }, showAlert, () => { location.href = '/cv'; })
    }
    function deleteCv() {
        fetchWithResult('/prol/cv', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name
            })
        }, showAlert, () => { location.href = '/cv'; });
    }

    const showAlert = useAlert();
    const { cv } = useLoaderData();
    const [name, setName] = useState(cv.name);
    const [skills, setSkills] = useState(cv.skills_json);
    const [newSkill, setNewSkill] = useState('');
    useEffect(() => { setNewSkill(''); }, [skills]);
    return (<>
        <TextField label="Name" required variant="outlined" onChange={event => { setName(event.target.value) }} value={name} />
        <Box>
            <Box>{ skills.length > 0 ? skills.map((skill, index) => <Chip key={index} label={skill} onDelete={() => { setSkills(skills.slice(0, index).concat(skills.slice(index + 1))) }} />) :
            "No skills" } </Box>
            <TextField label="New skill" required onChange={event => { setNewSkill(event.target.value); }} value={newSkill}/>
            <Button onClick={() => {
                if (!newSkill || skills.find(e => e === newSkill)) return;
                setSkills(skills.concat([newSkill]));
            }}>Add skill</Button>
        </Box>
        <Button onClick={saveCv}>Save</Button>
        <Button onClick={deleteCv}>Delete</Button>
    </>)
}