require('dotenv').config();
const { DBHOST, DBUSER, DBPASSWORD, DBPORT, DBDATABASE, SMTPHOST, SMTPPORT, SMTPAUTHUSER, SMTPAUTHPASS } = process.env;
const { Pool } = require('pg');
const pool = new Pool({
	host: DBHOST,
	user: DBUSER,
	password: DBPASSWORD,
	port: DBPORT,
	max: 20,
	dleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
	database: DBDATABASE,
	ssl: { rejectUnauthorized: false } 
});

const createTransporter = () => {
	return require('nodemailer').createTransport({
		host: SMTPHOST,
		port: SMTPPORT,
		secure: false, // upgrade later with STARTTLS
		auth: {
			user: SMTPAUTHUSER,
			pass: SMTPAUTHPASS
		}
	});
}

const createEmailOptions = (to, password) => {
	return {
		from: 'Leave Tracker<lileavetracker@herokuapp.com>',
		to: to,
		subject: `Leave tracker one time password - ${password}`,
		text: ''
	};
}

module.exports = {
  generatePassword : async(req, res) => {
		let result = '';
		try {
			const client = await pool.connect();
			const result = await client.query(`SELECT id, name, email, otp, password, company, location, type, phonenumber FROM user_table 
			WHERE status = 'Active' AND email='${req.body.userName}'`);
			if(!result.rows.length) {
				res.status(200).send("NotExists"); return;
			}
			await client.query(`DELETE FROM "user-temp-pass" WHERE userid = ${result.rows[0].id}`);
			let randomFourDigit = Math.floor(1000 + Math.random() * 9000);
			let insertResult = await client.query(`INSERT INTO "user-temp-pass" (temppass, userid, status) VALUES ( '${randomFourDigit}', ${result.rows[0].id}, 'Active')`);
			if(insertResult.rowCount) {
				let transporter = createTransporter();
				transporter.sendMail(createEmailOptions(req.body.userName, randomFourDigit), function(error, info){
					if (error) {
						console.log(error);
						res.status(500).send(error);
					} else {
						console.log('Email sent: ' + info.response);
						res.status(200).send(result.rows);
					}
				});
			} else {
				res.status(500).send("Error");
			}
			client.release();
    } catch (err) {
			console.log(err)
      result.error = err;
			res.status(500).send(result);
    }
	},
	passwordLogn: async(req, res) => {
		let result = '';
		console.log(req.body)
		try {
			const client = await pool.connect();
			let query = `SELECT id, temppass, userid, status FROM "user-temp-pass" WHERE temppass = '${req.body.password}' AND userid = 1`;
			console.log(query)

			const result = await client.query(`SELECT id, temppass, userid, status FROM "user-temp-pass" WHERE temppass = '${req.body.password}' AND userid = 1`);
			console.log(result.rows)
			if(result.rows.length) {
				res.status(200).send("Success"); 
			} else {
				res.status(200).send("Error"); 
			}
			client.release();
    } catch (err) {
		  result.error = err;
			res.status(500).send(result);
    }
	}
}

