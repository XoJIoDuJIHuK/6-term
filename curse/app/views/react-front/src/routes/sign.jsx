import { useState } from 'react';
import { Button } from '@mui/material';
import { useAlert } from '../components/useAlert';
import { fetchWithResult } from '../constants';

export default function Sign() {
  const showAlert = useAlert();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [signType, setSignType] = useState('in');
  const [userType, setUserType] = useState('regular');
  async function sign() {
    const signTypeUri = signType === 'in' ? 'login' : 'register';
    const userTypeUri = userType === 'regular' ? 'prol' : 'bour';
    fetchWithResult(`/${userTypeUri}/${signTypeUri}`, {
      method: signType === 'in' ? 'POST' : 'PUT',
      headers: {'Content-Type': 'application/json'},
      mode: 'cors',
      body: JSON.stringify({
        username, password
      })
    }, showAlert, d => {
      if (signType === 'in') {
        localStorage.setItem('userName', d.name);
        window.location.href = '/';
      }
    })
  }
  return (<>
    <div id='sign-wrapper'>
      <div className='row'>
        <div className={'cell' + (signType === 'in' ? ' selected' : '')} onClick={() => setSignType('in')}>
          <label>Вход</label>
        </div>
        <div className={'cell' + (signType === 'up' ? ' selected' : '')} onClick={() => setSignType('up')}>
          <label>Регистрация</label>
        </div>
      </div>
      <div className='row'>
        <div className={'cell' + (userType === 'regular' ? ' selected' : '')} onClick={() => setUserType('regular')}>
          <label>Соискатель</label>
        </div>
        <div className={'cell' + (userType === 'company' ? ' selected' : '')} onClick={() => setUserType('company')}>
          <label>Компания</label>
        </div>
      </div>
      <label htmlFor="username">Логин</label>
      <div className='row'>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)}/>
      </div>
      <label htmlFor="password">Пароль</label>
      <div className='row'>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
      </div>
      <div className='row'>
        <div className='cell'><Button onClick={sign}>Подтвердить</Button></div>
        <div className='cell'><Button onClick={() => {window.location.href = '/'}}>Отмена</Button></div>
      </div>
    </div>
  </>)
}