const c = 3
let o = {
    xd: 1,
    y: false
}
function a() {
    let aa = 2
    function b() {
        let bb = 3
        return b
    }
    console.log(b['[[Environment]]'])
    return 'a'
}
a()
