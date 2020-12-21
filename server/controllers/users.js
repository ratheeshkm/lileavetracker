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
			let selQuery =  `SELECT 
				user_table.id as id, 
				user_table.name as name, 
				user_table.email as email,
				user_table.company as companyId,
				company.name as company,
				user_table.location as locationId,
				location.name as location,
				user_table.type as typeid,
				user_type.name as type,
				user_table.phonenumber as phonenumber, 
				user_table.status as status
					FROM user_table 
					JOIN user_type ON user_type.id = user_table.type
					JOiN location ON location.id = user_table.location
					JOIN company ON company.id = user_table.company
				WHERE user_table.email = '${req.body.userName}'`;
			// const result = await client.query(`SELECT id, name, email, otp, password, company, location, type, phonenumber FROM user_table 
			// WHERE status = 'Active' AND email='${req.body.userName}'`);
			const result = await client.query(selQuery);
			if(!result.rows.length) {
				res.status(200).send("NotExists"); return;
			}
			await client.query(`DELETE FROM "user-temp-pass" WHERE userid = ${result.rows[0].id}`);
			let randomFourDigit = Math.floor(1000 + Math.random() * 9000);
			//'${randomFourDigit}'
			let insertResult = await client.query(`INSERT INTO "user-temp-pass" (temppass, userid, status) VALUES ( '123', ${result.rows[0].id}, 'Active')`);
			if(insertResult.rowCount) {
				let transporter = createTransporter();
				// transporter.sendMail(createEmailOptions(req.body.userName, randomFourDigit), function(error, info){
				// 	if (error) {
				// 		console.log(error);
				// 		res.status(500).send(error);
				// 	} else {
				// 		console.log('Email sent: ' + info.response);
				// 		res.status(200).send(result.rows);
				// 	}
				// });
				res.status(200).send(result.rows);
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
		console.log(req.body);
		const { userid="", password } = req.body;
		try {
			const client = await pool.connect();
			//let query = `SELECT id, temppass, userid, status FROM "user-temp-pass" WHERE temppass = '${req.body.password}' AND userid = 1`;
			// '${password}'
			let query = `SELECT id, temppass, userid, status FROM "user-temp-pass" WHERE temppass = '123'`;
			if(userid) {
				query = query + ` AND userid = ${userid}`;
			}
			const result = await client.query(query);
			console.log("query--->", query)
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

