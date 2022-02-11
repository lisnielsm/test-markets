const app = require('./app')

// create the port and host by default if not exists PORT and
// HOST in the environment variables
const port = process.env.PORT || 4000;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
    console.log("Server created at port", port);
});