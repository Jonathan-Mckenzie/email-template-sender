import { IEmailOptions } from "../../src/model/emailService.interface";

export const sendMail = (options: IEmailOptions): Promise<any> => {
	const maxRetryCount = 3;
	let currentCount = 0;

	return new Promise( (resolve, reject) => {
		const attemptToResolve = () => {
			setTimeout( () => {
				if (currentCount++ >= maxRetryCount) {
					console.log('out of retries');
					return reject('out of retries');
				}

				const random = Math.random();

				if (random > 0.75) {
					console.log('----Successfully Sent Email----');
					console.log(JSON.stringify(options));
					console.log('-------------------------------');
					return resolve(true)
				} else {
					console.log('send mail failed, retrying...');
					attemptToResolve()
				}
			}, 1000);
		};
		attemptToResolve();
	});
};
