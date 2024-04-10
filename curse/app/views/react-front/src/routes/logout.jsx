export default function Logout() {
    fetch('http://localhost:3000/logout').then(() => {
        localStorage.clear();
        window.location.href = '/';
    });
    return (<></>);
}