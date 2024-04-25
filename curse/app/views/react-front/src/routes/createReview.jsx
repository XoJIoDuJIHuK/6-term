import { fetchForLoader, fetchWithResult, getCookie } from '../constants';
import { useLoaderData } from 'react-router-dom';
import { Box, Select, MenuItem, InputLabel, TextField, Button, Rating } from '@mui/material';
import { useState } from 'react';
import { useAlert } from '../components/useAlert';

export async function loader() {
    const userType = getCookie('user_type');
    if (userType === 'regular') {
        const list = await fetchForLoader('/public-companies?skipRating=true');
        return { list };
    } else if (userType === 'company') {
        const list = await fetchForLoader('/bour/applicants-list');
        return { list };
    } else {
        throw new Error('Not authorized');
    }
}

export default function CreateReview() {
    async function sendReview() {
        const userType = getCookie('user_type');
        console.log(selectedObject.id, text, rating)
        fetchWithResult(`/${userType === 'company' ? 'bour' : 'prol'}/review`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                toId: selectedObject.id,
                text,
                rating
            })
        }, showAlert);
    }

    const showAlert = useAlert();
    const { list } = useLoaderData();
    if (list.length === 0) throw new Error('Не на кого оставлять отзыв');
    const [selectedObject, selectObject] = useState(list[0]);
    const [text, setText] = useState('');
    const [rating, setRating] = useState(0);
    return (<>
        <Box>
            <InputLabel id="object-label">Объект</InputLabel>
            <Box>
                <Select
                    labelId='object-label'
                    value={selectedObject.id}
                    onChange={e => {
                        selectObject(list.find(l => l.id === e.target.value));
                    }}>
                        { list.map(l => <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>) }
                </Select>
            </Box>
            <Box>
                <TextField label='Text' value={text} onChange={e => { setText(e.target.value); }} />
                <Rating value={rating} onChange={e => { setRating(e.target.value); }} />
            </Box>
            <Button onClick={sendReview}>Отправить</Button>
        </Box>
    </>)
}