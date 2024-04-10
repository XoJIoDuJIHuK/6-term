import { useLoaderData } from "react-router-dom";
import { TextField, Box, Button, Chip } from '@mui/material';
import { useState, useEffect } from "react";


export async function loader({ params }) {
    const cv = await (await fetch(`/prol/cv?id=${params.cvId}`)).json();
    console.log(cv)
    return { cv };
}

export default function EditCv() {//TODO: fix too many requests to /prol/cv
    function saveCv() {
        console.log(skills)
        fetch('/prol/cv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: cv.id,
                name,
                skills
            })
        }).then(r => {
            if (r.ok) {
                location.href = '/cv';
            }
        })
    }
    function deleteCv() {
        fetch('/prol/cv', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name
            })
        }).then(r => {
            if (r.ok) {
                location.href = '/cv';
            }
        })
    }

    const { cv } = useLoaderData();
    const [name, setName] = useState(cv.name);
    const [skills, setSkills] = useState(cv.skills_json);
    const [newSkill, setNewSkill] = useState('');
    useEffect(() => {
        setNewSkill('');
    }, [skills]);
    return (<>
        <TextField label="Name" required variant="outlined" onChange={event => { setName(event.target.value) }} value={name} />
        <Box>
            <Box>{ skills.length > 0 ? skills.map((skill, index) => <Chip key={index} label={skill} onDelete={() => { setSkills(skills.slice(0, index).concat(skills.slice(index + 1))) }} />) :
            "No skills" } </Box>
            <TextField label="New skill" required onChange={event => { setNewSkill(event.target.value); }} value={newSkill}/>
            <Button onClick={() => {
                console.log(skills)
                if (!newSkill || skills.find(e => e === newSkill)) return;
                setSkills(skills.concat([newSkill]));
            }}>Add skill</Button>
        </Box>
        <Button onClick={saveCv}>Save</Button>
        <Button onClick={deleteCv}>Delete</Button>
    </>)
}