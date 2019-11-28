import cors from "cors";

const whitelist = [
	process.env.NODE_HOST,
	process.env.CLIENT_HOST,
].filter(x => x);



const corsOptions: cors.CorsOptions = {
	allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
	methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
	preflightContinue: false,
	origin: (origin, callback) => {
		// if (!origin) {
		// 	return callback(null, true);
		// }

		for (let i = 0; i < whitelist.length; i++) {
			// @ts-ignore
			if (whitelist[i].includes(origin)) {
				return callback(null, true);
			}
		}
		callback(new Error('Not allowed by CORS'));
	}
};

export const coors = cors(corsOptions);

