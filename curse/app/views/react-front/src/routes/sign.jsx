import { useLoaderData } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@mui/material';

export async function loader() {

}

export default function Sign() {
  useLoaderData();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [signType, setSignType] = useState('in');
  const [userType, setUserType] = useState('regular');
  async function sign() {
    const signTypeUri = signType === 'in' ? 'login' : 'register';
    const userTypeUri = userType === 'regular' ? 'prol' : 'bour';
    fetch(`http://localhost:3000/${userTypeUri}/${signTypeUri}`, {
      method: signType === 'in' ? 'POST' : 'PUT',
      mode: 'cors',
      body: JSON.stringify({
        username, password
      })
    }).then(r => {
      if (r.ok) {
        return r.json();
      } else {
        throw r.json();
      }
    }).then(d => {
      if (signTypeUri === 'register') {
        alert(d);//TODO: add normal pop-up
      } else {
        localStorage.setItem('userName', d.name);
        window.location.href = '/';
      }
    })
    .catch(err => {
      console.log(err)
    })
  }
  return (<>
    <div id='sign-wrapper'>
      <div className='row'>
        <div className={'cell' + (signType === 'in' ? ' selected' : '')} onClick={() => setSignType('in')}>
          <label>Sign In</label>
        </div>
        <div className={'cell' + (signType === 'up' ? ' selected' : '')} onClick={() => setSignType('up')}>
          <label>Sign Up</label>
        </div>
      </div>
      <div className='row'>
        <div className={'cell' + (userType === 'regular' ? ' selected' : '')} onClick={() => setUserType('regular')}>
          <label>Regular</label>
        </div>
        <div className={'cell' + (userType === 'company' ? ' selected' : '')} onClick={() => setUserType('company')}>
          <label>Company</label>
        </div>
      </div>
      <label htmlFor="username">Username</label>
      <div className='row'>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)}/>
      </div>
      <label htmlFor="password">Password</label>
      <div className='row'>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
      </div>
      <div className='row'>
        <div className='cell'><Button onClick={sign}>Sign {signType}</Button></div>
        <div className='cell'><Button onClick={() => {window.location.href = '/'}}>Cancel</Button></div>
      </div>
    </div>
  </>)
}