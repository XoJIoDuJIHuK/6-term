import { Box, TextField, Button, Typography, Dialog, DialogTitle } from '@mui/material';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { useLoaderData } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useState } from 'react';
import { IconComponent, fetchForLoader, fetchWithResult, getCookie, userTypeDict } from "../constants";
import { useAlert } from '../components/useAlert';

export async function loader() {
    const userType = getCookie('user_type');
    if (!userType) location.href = '/';
    if (userType === 'admin') return { user: undefined };
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
        console.log(userData)
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
            <Typography variant="h6">Образование</Typography>
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
            }) : "Необразованный." }</Box>
            <Box><Button onClick={() => { addBlock('education'); }}>Добавить образование</Button></Box>
            <Typography variant="h6">Опыт работы</Typography>
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
            }) : "Неопытный." }</Box>
            <Box><Button onClick={() => { addBlock('experience'); }}>Добавить опыт работы</Button></Box>
        </>)
    }
    function CompanyInformation() {
        return (<Box>
            <Box>
                Внимание! При установке иконки страница перезагружается
                { IconComponent(userData.id) }
                <Button variant='contained' component='label'>
                    Выбрать иконку <input type='file' hidden onChange={e => {
                        const file = e.target.files[0];
                        if (file.size > 1e6) {
                            showAlert('Файл слишком большой: Больше 1МБ', 'error');
                            return;
                        }
                        if (['jpg', 'jpeg'].indexOf(file.name.split('.').pop()) === -1) {
                            showAlert('Разрешены только жпеги', 'error');
                            return;
                        }
                        fetchWithResult('/bour/icon', { method: 'PUT', body: file }, showAlert, () => {
                            location.reload();
                        })
                    }}/>
                </Button>
            </Box>
            <Box><TextField sx={{width: '100%'}} multiline label="Описание" required variant="outlined" onChange={e => { 
                setNewValue('description', e) 
            }}  value={userData.secription} /></Box>
            { userData.promotionRequestPending ? <Box>Запрос на подтверждение компании обрабатывается</Box> : 
                <Box>{ userData.approved === 'Y' ? "Компания подтверждена" : <Box sx={{
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
            <Box><TextField label="Email" required variant="outlined" onChange={e => { 
                setNewValue('email', e) 
            }}  value={userData.email} /></Box>
        </Box>)
    }
    function saveData() {
        fetchWithResult(`/${userTypeDict[cookies.user_type]}/personal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        }, showAlert);
    }

    const { user } = useLoaderData();
    const [userData, setUserData] = useState(user);
    const [proof, setProof] = useState('');
    const [commentary, setCommentary] = useState('');
    const [cookies] = useCookies(['user_type']);
    const [open, setDialogOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const userType = cookies.user_type;
    const showAlert = useAlert();
    return (<Box id='general-wrapper'>
        <Box>
            <Button onClick={() => { setDialogOpen(true); }}>Сменить пароль</Button>
            <Dialog open={open}>
                <DialogTitle>Смена пароля</DialogTitle>
                <Box>
                    <TextField label="Старый пароль" value={oldPassword} onChange={e => { setOldPassword(e); }}/>
                </Box>
                <Box>
                    <TextField label="Новый пароль" value={newPassword} onChange={e => { setNewPassword(e); }}/>
                </Box>
                <Button onClick={() => {
                    if (!oldPassword || !newPassword) {
                        showAlert('Нужно ввести оба пароля', 'error');
                        return;
                    }
                    if (oldPassword === newPassword) {
                        showAlert('Пароли не могут совпадать', 'error');
                        return;
                    }
                    fetchWithResult(`/${userTypeDict[userType]}/password`, 
                    { method: "PATCH", headers: { "Content-Type": "application/json", 
                    body: JSON.stringify({ newPassword, oldPassword }) } }, showAlert, 
                    () => { setDialogOpen(false); });
                }}>Жми меня</Button>
            </Dialog>
        </Box>
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
                }, showAlert, data => { localStorage.userName = data.userName; })
            }}>Удалить аккаунт</Button></Box> }
        </>}
    </Box>)
}