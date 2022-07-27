const http = require('http'), // import the HTTP module
  fs = require('fs'), // import the file system
  url = require('url'); // import the url

// the createServer() function is called on the new http variable I've created
http.createServer((request, response) => { //This function will be called every time an HTTP request is made against that server (request handler)
  let addr = request.url,
    q = url.parse(addr, true),
    filePath = '';
// Whenever a request is made to the server, you’ll add the visited URL, as well as the timestamp at which the request was received
fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  });
// when the URL doesnt contain "documentation" it will direct the user to the main page
if (q.pathname.includes('documentation')) {
    filePath = (__dirname + '/documentation.html');
  } else {
    filePath = 'index.html';
}
// if file cant be read stop code here
fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, { 'Content-Type': 'text/html' }); //tells the server to add a header to the response it sends back (along with the HTTP code “200”)
    response.write(data);
    response.end();

});

}).listen(8080);//the server is set to listen for a response on port 8080 using the listen() function
console.log('My test server is running on Port 8080.');