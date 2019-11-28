// used to handle .env variables
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import path from 'path';
import { coors } from "./cors";
const nocache = require('nocache');
import * as bodyParser from 'body-parser';

app.use(function (req, res, next) {
	req.headers.origin = req.headers.origin || req.headers.host;
	next();
});
app.use(coors);
app.use(nocache());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// serve react app
if (process.env.SERVER_SERVE_REACT) {
	app.use(express.static(path.join(__dirname, 'build')));
} else {
	app.get('/', (req, res) => res.status(200).send('hello friend.') );
}

// api definitions
import * as previewController from './emailPreviewController';
import * as senderController from './emailSender/controller';

app.post('/mail/preview', previewController.renderPreview);
app.post('/mail/send', senderController.send);


app.listen(process.env.SERVER_PORT, () => console.log(`Server listening on port ${process.env.SERVER_PORT}`));
