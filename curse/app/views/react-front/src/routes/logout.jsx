export default function Logout() {
    fetch('/logout').then(() => {
        localStorage.clear();
        window.location.href = '/';
    });
    return (<></>);
}