import { useLoaderData, NavLink } from 'react-router-dom';
import { Button } from '@mui/material';
import { fetchForLoader, fetchWithResult } from '../constants';
import { useAlert } from '../components/useAlert';

export async function loader() {
    const cvs = await fetchForLoader('/prol/cv');
    return { cvs };
}
export default function CVs() {
    function createCV() {
        fetchWithResult('/prol/cv', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Empty CV',
                skills: []
            })
        }, showAlert, d => {
            location.href = `/cv/edit/${d.id}`;
        });
    }

    const showAlert = useAlert();
    const { cvs } = useLoaderData();
    return (<>
        <Button onClick={createCV}>New CV</Button>
        { cvs.length > 0 ? cvs.map(cv => <><NavLink to={`/cv/edit/${cv.id}`}>{ cv.name }</NavLink></>) : <div>No CVs</div> }
    </>)
}