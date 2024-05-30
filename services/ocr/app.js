const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 8000;

app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});