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
	getLeaveStatus : async(req, res) => {
		let result = '';
		try {
			const client = await pool.connect();
			const result = await client.query(`SELECT id, name FROM "leave-status"`);
		  res.status(200).send(result.rows);
			client.release();
    } catch (err) {
		  result.error = err;
			res.status(500).send(result);
    }
	},
	saveLeave: async(req, res) => {
		let result = '';
		const { leaveType, description, userid, leaves } = req.body;
		let queryValues = "";
		const formatDate = date => {
			let splitedDate = date.split("-");
			return `${splitedDate[2]}-${splitedDate[1]}-${splitedDate[0]}`;
		}
		try {
			const client = await pool.connect();
			for(let item of Object.entries(leaves)) {
				let { startDate, endDate, leaveCount } = item[1];
				queryValues += `(${leaveType}, to_date('${formatDate(startDate)}', 'DD-MM-YYYY'), to_date('${formatDate(endDate)}', 'DD-MM-YYYY'), '${description}', 1, ${leaveCount}, ${userid}),`;
			}
			queryValues = queryValues.slice(0, -1);
			const result = await client.query(`INSERT INTO leave (type, startdate, enddate, description, status, leavecount, userid) VALUES ${queryValues}`);
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
		let { userid, userType } = req.body;
		try {
			const client = await pool.connect();
			let selectQuery = `SELECT id, type, TO_CHAR(startdate :: DATE, 'DD-MM-YYYY') as startdate, 
			TO_CHAR(enddate :: DATE, 'DD-MM-YYYY') as enddate, description, status, leavecount 
			FROM leave`;
			if(userType === 'Employee') {
				selectQuery = selectQuery + ` WHERE userid=${userid}`
			}
			selectQuery = selectQuery + ` ORDER BY id DESC`
			const result = await client.query(selectQuery);
		  res.status(200).send(result.rows);
			client.release();
    } catch (err) {
		  result.error = err;
			res.status(500).send(result);
    }
	},
	getLeaveReport: async(req, res) => {
		let result = '';
		let { year, month } = req.body;
		try {
			const client = await pool.connect();
			let selectQuery = `SELECT id, type, TO_CHAR(startdate :: DATE, 'DD-MM-YYYY') as startdate, 
			TO_CHAR(enddate :: DATE, 'DD-MM-YYYY') as enddate, description, status, leavecount, userid
			FROM leave WHERE EXTRACT(MONTH FROM enddate) = ${month} AND EXTRACT(YEAR FROM enddate) = ${year}`;
			selectQuery = selectQuery + ` ORDER BY id ASC`
			const result = await client.query(selectQuery);
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
	updateLeave: async(req, res) => {
		let result = '';
		try {
			const client = await pool.connect();
			const result = await client.query(`UPDATE leave SET status=${req.body.statusId} WHERE id=${req.body.leaveId}`);
			console.log(result.rowCount)
			if(result.rowCount) {
				res.status(200).send('Success');
			} else {
				res.status(200).send('Error');
			}
			client.release();
    } catch (err) {
		  result.error = err;
			res.status(500).send(result);
    }
	}
}

