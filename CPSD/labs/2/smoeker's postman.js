fetch('http://localhost:3000/api/teachers', {
    method: 'GET',
    mode: 'cors'
}).then(async res => {
    if (res.ok) {
        return res.json()
    } else {
        const error = await res.json()
        throw new Error(error)
    }
}).then(data => {
    console.log(data)
}).catch(err => {
    console.error(err)
})