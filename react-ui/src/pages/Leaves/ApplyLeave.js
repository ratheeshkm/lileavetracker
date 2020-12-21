import React, { Fragment, useEffect, useState } from 'react';
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
		leaveCount: 1
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

	// useEffect(() => {
	// 	getLeaveTypes();
	// }, [getLeaveTypes]);

	useEffect(() => {
		setLeave(prevState => ({
			...prevState,
			startDateFormatted: document.getElementById("startDate").getAttribute('data-formattedvalue'),
			endDateFormatted: document.getElementById("endDate").getAttribute('data-formattedvalue')
		}))
	}, []);

	useEffect(() => {
		let startDateArray = document.getElementById("startDate").getAttribute('data-formattedvalue').split("-");
		let startDate = `'${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}'`;
		let endDateArray = document.getElementById("endDate").getAttribute('data-formattedvalue').split("-");
		let endDate = `'${endDateArray[2]}-${endDateArray[1]}-${endDateArray[0]}'`;
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
				leaveCount: Math.floor(( Date.parse(endDate) - Date.parse(startDate) ) / 86400000) + 1
			}))
		}
	}, [leave.startDate, leave.endDate, setError]);

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
											ref={register({
												validate: value => value !== "bill"
											})}
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