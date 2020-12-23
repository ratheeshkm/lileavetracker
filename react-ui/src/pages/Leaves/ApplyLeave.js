import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import AppHeader from '../../Layout/AppHeader';
import AppSidebar from '../../Layout/AppSidebar';
import AppFooter from '../../Layout/AppFooter';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import { toast, Bounce } from 'react-toastify';
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
var DatePicker = require("reactstrap-date-picker");

const schema = yup.object().shape({
	leaveType: yup.string().trim().required('Required'),
	//startDate: yup.string().trim().required('Required'),
	//endDate: yup.string().trim().required('Required'),
});

const ApplyLeave = (props) => {
	const [ leave, setLeave ] = useState({
		leaveType: "",
		startDate: new Date().toISOString(),
		endDate: new Date().toISOString(),
		startDateFormatted: "",
		endDateFormatted: "",
		description: "",
		leaves:""
	})

	const { register, handleSubmit, setError, errors } = useForm({
		mode: 'onBlur | onChange',
		resolver: yupResolver(schema),
	});
	const { getLeaveTypes } = props;

	let history = useHistory();
	
	const onSubmit = async() => {
		await props.saveLeave(leave)
			.then((result) => {
				if (result) {
					toast("Leave has been applied successfully", {
						transition: Bounce,
						closeButton: true,
						autoClose: 5000,
						position: 'top-right',
						type: 'success'
					})
					history.push('/leaves')
				}
		})
	}

	useEffect(() => {
		getLeaveTypes();
	}, [getLeaveTypes]);

	useEffect(() => {
		setLeave(prevState => ({
			...prevState,
			startDateFormatted: document.getElementById("startDate").getAttribute('data-formattedvalue'),
			endDateFormatted: document.getElementById("endDate").getAttribute('data-formattedvalue')
		}))
	}, []);

	const getMonthSplit = useCallback	(
		(startDate, endDate) => {
			let year = new Date(startDate).getFullYear();
			let startMonth = new Date(startDate).getMonth();
			let endMonth = new Date(endDate).getMonth();
			let splitYear = [];
			console.log(startMonth, endMonth)
			for(let i=startMonth; i<=endMonth; i++) {
				let split = "";
				if(startMonth === endMonth) {
					split = {
						startDate: startDate,
						endDate: endDate
					}
				} else if(i === startMonth) {
					split = {
						startDate: startDate,
						endDate: formatDate(new Date(year, i + 1, 0).toLocaleDateString())
					}
				} else if(i === endMonth) {
					split = {
						startDate: formatDate(new Date(year, i, 1).toLocaleDateString()),
						endDate: endDate
					}
				} else {
					split = {
						startDate: formatDate(new Date(year, i, 1).toLocaleDateString()),
						endDate: formatDate(new Date(year, i + 1, 0).toLocaleDateString())
					}
				}
				split.leaveCount = getBusinessDateCount(new Date(split.startDate), new Date(split.endDate));
				splitYear.push(split);
			}
			return splitYear;
		},
		[],
	);

	const getYearSplit = useCallback	(
		(startDate, endDate) => {
			let startYear = new Date(startDate).getFullYear();
		let endYear = new Date(endDate).getFullYear();
		let splitYear = [];
		for(let i = startYear; i <= endYear; i++ ) {
			let split = ''
			if(startYear === endYear) {
				split = {
					startDate: startDate,
					endDate: endDate
				}
			} else if(i === startYear){
				split = {
					startDate: startDate,
					endDate: formatDate(new Date(startYear, 11, 31).toLocaleDateString())
				}
			} else if(i === endYear) {
				split = {
					startDate: formatDate(new Date(i, 0, 1).toLocaleDateString()),
					endDate: endDate
				}
			} else {
				split = {
					startDate: formatDate(new Date(i, 0, 1).toLocaleDateString()),
					endDate: formatDate(new Date(i, 11, 31).toLocaleDateString())
				}
			}
			split && splitYear.push(split);
		}
		return splitYear;
		},
		[],
	);

	
	const splitLeaves = useCallback	(
		(startDate, endDate) => {
			let splitLeaves = getYearSplit(startDate, endDate).map(item => {
				console.log(item.startDate, item.endDate);
				return getMonthSplit(item.startDate, item.endDate);
			});
			let leaves = [];
			for(let item of splitLeaves) {
				leaves = [...leaves, ...item]
			}
			return leaves;
		},
		[getYearSplit, getMonthSplit],
	);


	useEffect(() => {
		let startDateArray = document.getElementById("startDate").getAttribute('data-formattedvalue').split("-");
		let startDate = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
		let endDateArray = document.getElementById("endDate").getAttribute('data-formattedvalue').split("-");
		let endDate = `${endDateArray[2]}-${endDateArray[1]}-${endDateArray[0]}`;
		if(new Date(startDate).getTime() > new Date(endDate).getTime()) {
			console.log("Start date greater than end date")
			setError("startDate", {
				type: "manual",
				message: "Start date cannot be greated than end date"
			});
			setLeave(prevState => ({
				...prevState,
				leaveCount: 0
			}))
		} else {
			setError("startDate", {
				type: "manual",
				message: ""
			});
			setLeave(prevState => ({
				...prevState,
				leaves:splitLeaves(startDate, endDate)
			}))
			//console.log(startDate, endDate)
			//console.log(splitLeaves(startDate, endDate))
		}
	}, [leave.startDate, leave.endDate, setError, splitLeaves]);

	
	const handleChange = (e) => {
		const { name, value } = e.currentTarget;
		setLeave(prevState => ({
			...prevState,
			[name]: value
		}))
	}

	const handleDateChange = (value, formattedValue, fieldName) => {
		setLeave(prevState => ({
			...prevState,
			[fieldName]: value,
			[`${fieldName}Formatted`]: formattedValue
		}));
	}
	
	function getBusinessDateCount (startDate, endDate) {
			var elapsed, daysAfterLastSunday;
			var ifThen = function (a, b, c) {
					return a === b ? c : a;
			};

			elapsed = endDate - startDate;
			elapsed /= 86400000;

			let daysBeforeFirstSunday = (7 - startDate.getDay()) % 7;
			daysAfterLastSunday = endDate.getDay();

			elapsed -= (daysBeforeFirstSunday + daysAfterLastSunday);
			elapsed = (elapsed / 7) * 5;
			elapsed += ifThen(daysBeforeFirstSunday - 1, -1, 0) + ifThen(daysAfterLastSunday, 6, 5);

			return Math.ceil(elapsed);
	}

	const formatDate = date => {
		let splitedDate = date.split("/");
		return `${splitedDate[2]}-${splitedDate[1]}-${splitedDate[0]}`;
	}

	// const getYearSplit = (startDate, endDate) => {
	
	// }

	// const getMonthSplit = (startDate, endDate) => {
	
	// }

	
	// const splitLeaves = (startDate, endDate) => {
		
	// }

	console.log("Leaves", leave)
	return (
		<Fragment>
			<AppHeader />
			<div className="app-main">
				<AppSidebar />
				<div className="app-main__outer">
					<div className="app-main__inner">
						<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
							<Row>
								<Col lg="6">
									<FormGroup>
										<Label for="Name">Leave Type</Label>
										<Input type="select"
											name="leaveType"
											id="leaveType"
											innerRef={register}
											invalid={!!errors.leaveType}
											data-testid="leaveType"
											value={leave.leaveType}
											onChange={handleChange}
										>
											<option value="">Select Leave Type</option> {
												props.leaveTypes && props.leaveTypes.map(item => (
													<option key={uuidv4()} value={item.id}>{item.name}</option>
												))
											}
										</Input>
									</FormGroup>
								</Col>
							</Row>
              <Row>
								<Col lg="6">
									<FormGroup>
										<Label for="Start Date">Start Date</Label>
										<DatePicker id="startDate" 
											name="startDate" 
											autoComplete="off" 
											value={leave.startDate} 
											onChange= {(v,f) => handleDateChange(v, f, 'startDate')} 
											dateFormat='DD-MM-YYYY'  
											invalid={!!errors.startDate}
											/>
										<div className="text-danger">
											{errors.startDate && errors.startDate.message}
										</div>
									</FormGroup>
								</Col>
							</Row>
              <Row>
								<Col lg="6">
									<FormGroup>
										<Label for="End Date">End Date</Label>
										<DatePicker id="endDate" name="endDate" value={leave.endDate} onChange= {(v,f) => handleDateChange(v, f, 'endDate')} dateFormat='DD-MM-YYYY'  />
										<div className="text-danger">
											{errors.endDate && errors.endDate.message}
										</div>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col lg="6">
									<FormGroup>
										<Label for="End Date">No of days on leave</Label>
										<div>
											{leave.leaveCount}
										</div>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col lg="6">
									<FormGroup>
										<Label for="Description">Description</Label>
										<Input
											type="textarea"
											name="description"
											innerRef={register}
											invalid={!!errors.description}
											data-testid="description"
											onChange={handleChange}
										/>
										<div className="text-danger">
											{errors.description && errors.description.message}
										</div>
									</FormGroup>
								</Col>
							</Row>
							<Row>
								<Col lg="6">
									<Button color="primary" className="float-right">Submit</Button>
								</Col>
							</Row>
						</form>
					</div>
					<AppFooter />
				</div>
			</div>
		</Fragment>
	)
}

export default ApplyLeave;