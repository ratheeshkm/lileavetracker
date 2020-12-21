require('dotenv').config();
const { DBHOST, DBUSER, DBPASSWORD, DBPORT, DBDATABASE } = process.env;
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


module.exports = {
  getLeaveTypes : async(req, res) => {
		let result = '';
		try {
			const client = await pool.connect();
			const result = await client.query(`SELECT id, name, status FROM "leave-types" WHERE status = 'Active'`);
		  res.status(200).send(result.rows);
			client.release();
    } catch (err) {
		  result.error = err;
			res.status(500).send(result);
    }
	},
	saveLeave: async(req, res) => {
		let result = '';
		const { leaveType, startDateFormatted, endDateFormatted, description, leaveCount, userid } = req.body;
		console.log(req.body)
		try {
			const client = await pool.connect();
			const result = await client.query(`INSERT INTO leave (type, startdate, enddate, description, status, leavecount, userid)
			VALUES ( ${leaveType}, to_date('${startDateFormatted}', 'DD-MM-YYYY'), to_date('${endDateFormatted}', 'DD-MM-YYYY'), '${description}', 1, ${leaveCount}, ${userid})`);
			if(result.rowCount) {
				res.status(200).send("Success");
			} else {
				res.status(200).send("Error");
			}
			client.release();
    } catch (err) {
		  result.error = err;
			res.status(500).send(result);
    }
	},
	getLeave : async(req, res) => {
		let result = '';
		console.log("req", req.body.userid)
		try {
			const client = await pool.connect();
			const result = await client.query(`SELECT id, type, TO_CHAR(startdate :: DATE, 'DD-MM-YYYY') as startdate, 
			TO_CHAR(enddate :: DATE, 'DD-MM-YYYY') as enddate, description, status, leavecount 
			FROM leave 
			WHERE userid=${req.body.userid}
			ORDER BY id DESC`);
		  res.status(200).send(result.rows);
			client.release();
    } catch (err) {
		  result.error = err;
			res.status(500).send(result);
    }
	},
	getStatus : async(req, res) => {
		let result = '';
		try {
			const client = await pool.connect();
			const result = await client.query(`SELECT id, name FROM "leave-status";`);
		  res.status(200).send(result.rows);
			client.release();
    } catch (err) {
		  result.error = err;
			res.status(500).send(result);
    }
	},
}

