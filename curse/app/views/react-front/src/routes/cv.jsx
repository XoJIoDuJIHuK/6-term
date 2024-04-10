import { useLoaderData, NavLink } from 'react-router-dom';
import { Button } from '@mui/material';

export async function loader() {
    const cvs = await (await fetch('/prol/cv')).json();
    return { cvs };
}
export default function CVs() {
    const { cvs } = useLoaderData();
    return (<>
        <Button onClick={createCV}>New CV</Button>
        { cvs.length > 0 ? cvs.map(cv => <><NavLink to={`/cv/edit/${cv.id}`}>{ cv.name }</NavLink></>) : <div>No CVs</div> }
    </>)
}
function createCV() {
    fetch('/prol/cv', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: 'Empty CV',
            skills: []
        })
    }).then(r => {
        if (r.ok) {
            return r.json();
        } else {
            throw r.json();
        }
    }).then(d => {
        location.href = `/cv/edit/${d.id}`;
    }).catch(e => {

    });
    
}