import { Box, TextField, Button, Typography } from '@mui/material';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { useLoaderData } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useState } from 'react';
import { fetchForLoader, fetchWithResult, getCookie, userTypeDict } from "../constants";
import { useAlert } from '../components/useAlert';

export async function loader() {
    const userType = getCookie('user_type');
    if (!userType) location.href = '/';
    const user = await fetchForLoader(`/${userTypeDict[userType]}/personal`);
    return { user };
}

export default function Personal() {
    function setNewValue(key, event, index, secondKey, thirdKey) {
        if (index !== undefined) {
            const arr = userData[key].slice();
            if (thirdKey !== undefined) {
                arr[index][secondKey][thirdKey] = event.target.value;
            } else arr[index][secondKey] = event.target.value;
            setUserData({ ...userData, [key]: arr });
        } else setUserData({ ...userData, [key]: event.target.value });
    }
    function addBlock(key) {
        const arr = userData[key].slice();
        const defaultObjects = {
            'experience': {
                place: 'place',
                period: [undefined, undefined],
                function: 'function',
                commentary: ''
            },
            'education': {
                institution: 'school',
                period: [undefined, undefined],
                speciality: 'chef',
            }
        }
        arr.push({ ...defaultObjects[key] })
        setUserData({ ...userData, [key]: arr });
    }
    function removeBlock(key, index) {
        const arr = userData[key].slice();
        arr.splice(index, 1);
        setUserData({ ...userData, [key]: arr });
    }
    function RegularInformation() {
        return (<>
            <TextField label="Почта" onChange={e => { setNewValue('email', e) }} value={userData.email} />
            <Typography variant="h5">Образование</Typography>
            <Box>{ userData.education.length > 0 ? userData.education.map((element, index) => {
                return <Box key={index}>
                    <TextField label="Место учёбы" required value={element.institution} onChange={e => { setNewValue('education', e, index, 'institution') }}/>
                    <TextField label="Специальность" required value={element.speciality} onChange={e => { setNewValue('education', e, index, 'speciality') }}/>
                    <Box>
                        С <input type='date' value={element.period[0]} onChange={e => { setNewValue('education', e, index, 'period', 0) }}/>
                        По <input type='date' value={element.period[1]} onChange={e => { setNewValue('education', e, index, 'period', 1) }}/>
                    </Box>
                    <Button onClick={() => { removeBlock('education', index); }}>Удалить блок</Button>
                </Box>;
            }) : "Необразованный. Быдло" }</Box>
            <Box><Button onClick={() => { addBlock('education'); }}>Добавить образование</Button></Box>
            <Box>{ userData.experience.length > 0 ? userData.experience.map((element, index) => {
                return <Box key={index}>
                    <TextField label="Место работы" required value={element.place} onChange={e => { setNewValue('experience', e, index, 'place') }}/>
                    <TextField label="Должность" required value={element.function} onChange={e => { setNewValue('experience', e, index, 'function') }}/>
                    <Box>
                        С <input type='date' value={element.period[0]} onChange={e => { setNewValue('experience', e, index, 'period', 0) }}/>
                        По <input type='date' value={element.period[1]} onChange={e => { setNewValue('experience', e, index, 'period', 1) }}/>
                    </Box>
                    <TextField label="Комментарий" required value={element.commentary} onChange={e => { setNewValue('experience', e, index, 'commentary') }}/>
                    <Button onClick={() => { removeBlock('experience', index); }}>Удалить блок</Button>
                </Box>;
            }) : "Безработный. Пидор" }</Box>
            <Box><Button onClick={() => { addBlock('experience'); }}>Добавить опыт работы</Button></Box>
        </>)
    }
    function CompanyInformation() {
        return (<Box>
            <TextField label="Описание" required variant="outlined" onChange={e => { setNewValue('description', e) }}  value={userData.secription} />
            { userData.promotionRequestPending ? <Box>Запрос на подтверждение компании обрабатывается</Box> : 
                <Box>{ userData.approved === 'Y' ? "Approved" : <Box sx={{
                    display: 'flex',
                    width: '400px',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                <FilePresentIcon sx={{color:(proof ? 'green' : 'red')}} />
                <Button onClick={() => {
                    fetchWithResult(`/bour/promotion-request`, {
                        method: 'PUT',
                        body: proof
                    }, showAlert, () => { location.reload(); });
                }}>Запрос на повышение</Button>
                <Button variant='contained' component='label'>
                    Выбрать файл <input type='file' hidden onChange={e => {
                        const file = e.target.files[0];
                        if (file.size > 1e6) {
                            showAlert('Файл слишком большой: Больше 1МБ', 'error');
                            return;
                        }
                        if (['txt', 'md'].indexOf(file.name.split('.').pop()) === -1) {
                            showAlert('Расширение файла не в списке поддерживемых', 'warning');
                        }
                        setProof(file);
                    }}/>
                </Button>
            </Box> }</Box> }
            <TextField label="Email" required variant="outlined" onChange={e => { setNewValue('email', e) }}  value={userData.email} />
        </Box>)
    }
    function saveData() {
        fetchWithResult(`/${userTypeDict[cookies.user_type]}/personal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        }, showAlert, () => { location.reload(); });
    }

    const { user } = useLoaderData();
    const [userData, setUserData] = useState(user);
    const [proof, setProof] = useState('');
    const [commentary, setCommentary] = useState('');
    const [cookies] = useCookies(['user_type']);
    const userType = cookies.user_type;
    const showAlert = useAlert();
    return (<Box id='general-wrapper'>
        { userType === 'admin' ? <></> : <TextField label="Имя" required variant="outlined" 
            onChange={e => { setNewValue('name', e) }} value={userData.name} /> }
        { userType === 'regular' ? RegularInformation() : userType === 'company' ? 
            CompanyInformation() : <>Персональных данных нет</> }
        { userType === 'admin' ? <></> : 
        <>
            <Button onClick={saveData}>Сохранить</Button>
            { userData.dropRequestPending ? <Box>Запрос на удаление обрабатывается</Box> : <Box>
                <TextField label="Комментарий" variant='outlined' 
                    onChange={e => {setCommentary(e.target.value)}} value={commentary}/>
                <Button onClick={() => {
                fetchWithResult(`/${userType === 'company' ? 'bour' : 'prol'}/drop-request`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({commentary})
                }, showAlert)
            }}>Удалить аккаунт</Button></Box> }
        </>}
    </Box>)
}