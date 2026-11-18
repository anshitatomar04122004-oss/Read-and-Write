const http = require('http')
const fs = require('fs');
const server=http.createServer((req, res)=>{
    //url, method
    const url = req.url;
    const method = req.method;
    if(req.url === '/'){
        //form
        res.setHeader('Content-Type', 'text/html');
        res.end(
            `
            <form action="/message" method="POST">
            <label>Name:</label>
            <input type ="text" name="username"></input>
            <button type="submit">Add</button>
            </form>
            `
        );
    }else{
        if(req.url==='/message'){
            //res.setHeader('Content-Type', 'text/html');

            let body = [];
            req.on('data', (chunks) => {
                //console.log(chunks);
                body.push(chunks);
            });
            req.on('end', () => {
                let buffer = Buffer.concat(body);
                let formData = buffer.toString();

                const formValues = formData.split('=')[1];
                
                fs.writeFile('formValues.txt', formValues, (err) => {
                    res.statusCode = 302;     //redirected
                    res.setHeader('Location', '/');
                    res.end();
                })
            });
        }else{
            if(req.url==='/read'){
                //read from the file
                fs.readFile('formValues.txt', (err, data) => {
                    console.log(data.toString());
                    res.end(`
                        <h1>${data.toString()}</h1>`);
                })
            }
        }
    }
});
server.listen(3000, ()=>{
    console.log("Server is running");
});