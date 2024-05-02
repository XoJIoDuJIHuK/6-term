const uris = ['public-vacancies', 'public-companies', ''];
const params = ['id=4', 'login=kek&password=1234', 'vacancy=undefined'];

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

(async () => {
  for (let method of ['GET', 'PUT', 'POST', 'DELETE']) {
    for (let uri of uris) {
      for (let param of params) {
        const response = await fetch(`https://localhost:4433/${uri}?${params}`, { method });
        const contentType = response.headers.get('content-type');
        let responseBody;
        if (contentType === 'application/json') {
          responseBody = await response.json();
        } else {
          responseBody = await response.text();
        }
        console.log(method, uri, response.status, responseBody);
      }
    }
  }
})()