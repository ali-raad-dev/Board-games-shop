require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 4000;
if (!process.env.JWT_SECRET) console.warn('JWT_SECRET is not set. Add it to backend/.env before using authentication.');

app.listen(port, () => console.log(`Board game shop API listening on http://127.0.0.1:${port}`));