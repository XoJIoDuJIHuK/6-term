import { Box, TextField, Button } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useState } from 'react';
import { userTypeDict } from "../constants";

export async function loader() {
    try {
        const userType = document.cookie.split('; ').find(e => e.startsWith('user_type=')).split('=').pop();
        console.log(userTypeDict[userType])
        const user = await (await fetch(`/${userTypeDict[userType]}/personal`)).json();
        console.log(user);
        return { user };
    } catch (err) {
        console.log(err)
        // location.href = '/sign';
    }
}

export default function Personal() {
    function setNewValue(key, event) {
        setUserData({ ...userData, [key]: event.target.value });
    }
    function RegularInformation() {
        return (<>
        </>)
    }
    function CompanyInformation() {
        return (<Box>
            <TextField label="Description" required variant="outlined" onChange={e => { setNewValue('description', e) }}  value={userData.secription} />
            <Box>{ userData.approved ? "Approved" : <>
                <Button onClick={() => {
                    console.log(proof)
                    fetch(`/bour/promotion-request`, {
                        method: 'PUT',
                        body: proof
                    }).then(r => {
                        if (r.ok) {
                            return r.json();
                        } else {
                            throw r.json();
                        }
                    }).then(d => {
                        console.log(d);
                    }).catch(err => {
                        
                    });
                }}>Apply for approval</Button>
                <Button variant='contained' component='label'>
                    Upload <input type='file' hidden onChange={e => { setProof(e.target.files[0]) }}/>
                </Button>
            </> }</Box>
            <TextField label="Email" required variant="outlined" onChange={e => { setNewValue('email', e) }}  value={userData.email} />
        </Box>)
    }
    function saveData() {
        fetch(`/${userTypeDict[cookies.user_type]}/personal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        }).then(r => {
            if (r.ok) {
                return r.json();
            } else {
                throw r.json();
            }
        }).then(d => {
            console.log(d);
        }).catch(err => {
            console.log(err)
        });
    }

    const { user } = useLoaderData();
    const [userData, setUserData] = useState(user);
    const [proof, setProof] = useState('');
    console.log(userData)
    const [cookies] = useCookies(['user_type']);
    return (<>
        <TextField label="Name" required variant="outlined" onChange={e => { setNewValue('name', e) }} value={userData.name} />
        { cookies.user_type === 'regular' ? RegularInformation() : cookies.user_type === 'company' ? CompanyInformation() : <></> }
        <Button onClick={saveData}>Save</Button>
    </>)
}