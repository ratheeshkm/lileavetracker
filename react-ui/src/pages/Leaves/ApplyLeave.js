import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import { toast, Bounce } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import AppFooter from '../../Layout/AppFooter';
import AppSidebar from '../../Layout/AppSidebar';
import AppHeader from '../../Layout/AppHeader';
import PulseLoader from 'react-spinners/PulseLoader';

const DatePicker = require('reactstrap-date-picker');

const schema = yup.object().shape({
  leaveType: yup.string().trim().required('Required'),
  description: yup.string().trim().required('Required')
});

const ApplyLeave = (props) => {
  const { getLeaveTypes, leaveStatus } = props;
  const leaves = props.leave;
  const [leave, setLeave] = useState({
    leaveType: 1,
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    startDateFormatted: '',
    endDateFormatted: '',
    description: '',
    leaves: ''
  });

  const { register, handleSubmit, setError, errors } = useForm({
    mode: 'onBlur | onChange',
    resolver: yupResolver(schema)
  });

  const history = useHistory();

  const onSubmit = async () => {
    const formError = Object.keys(errors).filter(
      (item) => errors[item].message !== ''
    );
    if (formError.length) {
      return false;
    }
    await props.saveLeave(leave).then((result) => {
      if (result) {
        toast('Leave has been applied successfully', {
          transition: Bounce,
          closeButton: true,
          autoClose: 5000,
          position: 'top-right',
          type: 'success'
        });
        history.push('/leaves');
      }
    });
  };

  useEffect(() => {
    getLeaveTypes();
  }, [getLeaveTypes]);

  useEffect(() => {
    setLeave((prevState) => ({
      ...prevState,
      startDateFormatted: document
        .getElementById('startDate')
        .getAttribute('data-formattedvalue'),
      endDateFormatted: document
        .getElementById('endDate')
        .getAttribute('data-formattedvalue')
    }));
  }, []);

  const getMonthSplit = useCallback((startDate, endDate) => {
    const year = new Date(startDate).getFullYear();
    const startMonth = new Date(startDate).getMonth();
    const endMonth = new Date(endDate).getMonth();
    const splitMonth = [];
    for (let i = startMonth; i <= endMonth; i++) {
      let split = '';
      if (startMonth === endMonth) {
        split = {
          startDate,
          endDate
        };
      } else if (i === startMonth) {
        split = {
          startDate,
          endDate: formatDate(new Date(year, i + 1, 0).toLocaleDateString())
        };
      } else if (i === endMonth) {
        split = {
          startDate: formatDate(new Date(year, i, 1).toLocaleDateString()),
          endDate
        };
      } else {
        split = {
          startDate: formatDate(new Date(year, i, 1).toLocaleDateString()),
          endDate: formatDate(new Date(year, i + 1, 0).toLocaleDateString())
        };
      }
      split.leaveCount = getBusinessDateCount(
        new Date(split.startDate),
        new Date(split.endDate)
      );
      splitMonth.push(split);
    }
    return splitMonth;
  }, []);

  const getYearSplit = useCallback((startDate, endDate) => {
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();
    const splitYear = [];
    for (let i = startYear; i <= endYear; i++) {
      let split = '';
      if (startYear === endYear) {
        split = {
          startDate,
          endDate
        };
      } else if (i === startYear) {
        split = {
          startDate,
          endDate: formatDate(new Date(startYear, 11, 31).toLocaleDateString())
        };
      } else if (i === endYear) {
        split = {
          startDate: formatDate(new Date(i, 0, 1).toLocaleDateString()),
          endDate
        };
      } else {
        split = {
          startDate: formatDate(new Date(i, 0, 1).toLocaleDateString()),
          endDate: formatDate(new Date(i, 11, 31).toLocaleDateString())
        };
      }
      split && splitYear.push(split);
    }
    return splitYear;
  }, []);

  const splitLeaves = useCallback(
    (startDate, endDate) => {
      const splitLeaves = getYearSplit(startDate, endDate).map((item) => {
        return getMonthSplit(item.startDate, item.endDate);
      });
      let leaves = [];
      for (const item of splitLeaves) {
        leaves = [...leaves, ...item];
      }
      return leaves;
    },
    [getYearSplit, getMonthSplit]
  );

  const formatDate = (date) => {
    const splitedDate = date.split('/');
    return `${splitedDate[2]}-${splitedDate[1]}-${splitedDate[0]}`;
  };

  useEffect(() => {
    let startVal = document
    .getElementById('startDate')
    .getAttribute('data-formattedvalue');
    let endVal = document
    .getElementById('endDate')
    .getAttribute('data-formattedvalue');
    if(!startVal) setError('startDate', {
      type: 'manual',
      message: 'Required'
    });
    if(!endVal) setError('endDate', {
      type: 'manual',
      message: 'Required'
    });
    
    const startDateArray = document
      .getElementById('startDate')
      .getAttribute('data-formattedvalue')
      .split('-');
    const startDate = `${startDateArray[2]}-${startDateArray[1]}-${startDateArray[0]}`;
    const endDateArray = document
      .getElementById('endDate')
      .getAttribute('data-formattedvalue')
      .split('-');
    const endDate = `${endDateArray[2]}-${endDateArray[1]}-${endDateArray[0]}`;
    const appliedStatusId = leaveStatus.filter(
      (item) => item.name === 'Applied'
    )[0].id;
    const appliedLeaves = leaves.filter(
      (item) => item.status === appliedStatusId
    );
    let dateError = false;
    for (const value of appliedLeaves) {
      const appliedStartDate = new Date(
        value.startdate.split('-').reverse().join('-')
      ).getDate();
      const appliedEndDate = new Date(
        value.enddate.split('-').reverse().join('-')
      ).getDate();
      if (
        (new Date(startDate).getDate() <= appliedStartDate &&
          appliedStartDate <= new Date(endDate).getDate()) ||
        (new Date(startDate).getDate() <= appliedEndDate &&
          appliedEndDate <= new Date(endDate).getDate())
      ) {
        dateError = true;
      }
    }
    if (dateError) {
      setError('overlapError', {
        type: 'manual',
        message: 'Applying date is overlapping with already applied leave'
      });
    } else {
      setError('overlapError', {
        type: 'manual',
        message: ''
      });
    }

    if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
      setError('dateGreaterError', {
        type: 'manual',
        message: 'Start date cannot be greater than end date'
      });
      setLeave((prevState) => ({
        ...prevState,
        leaveCount: 0
      }));
    } else {
      setError('dateGreaterError', {
        type: 'manual',
        message: ''
      });
      setLeave((prevState) => ({
        ...prevState,
        leaves: splitLeaves(startDate, endDate)
      }));
    }
  }, [
    setError,
    splitLeaves,
    leave.startDate,
    leave.endDate,
    errors,
    leaveStatus,
    leaves
  ]);

  const handleChange = (e) => {
    const { name, value } = e.currentTarget;
    setLeave((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDateChange = (value, formattedValue, fieldName) => {
    setLeave((prevState) => ({
      ...prevState,
      [fieldName]: value,
      [`${fieldName}Formatted`]: formattedValue
    }));
  };

  function getBusinessDateCount(startDate, endDate) {
    let elapsed;
    let daysAfterLastSunday;
    const ifThen = function (a, b, c) {
      return a === b ? c : a;
    };

    elapsed = endDate - startDate;
    elapsed /= 86400000;

    const daysBeforeFirstSunday = (7 - startDate.getDay()) % 7;
    daysAfterLastSunday = endDate.getDay();

    elapsed -= daysBeforeFirstSunday + daysAfterLastSunday;
    elapsed = (elapsed / 7) * 5;
    elapsed +=
      ifThen(daysBeforeFirstSunday - 1, -1, 0) +
      ifThen(daysAfterLastSunday, 6, 5);

    return Math.ceil(elapsed);
  }
  const totalLeavs = leave.leaves.length && leave.leaves.reduce(function (result, item) {
    return result + item.leaveCount;
  }, 0);
  return (
    <>
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
                    <Input
                      type="select"
                      name="leaveType"
                      id="leaveType"
                      innerRef={register}
                      invalid={!!errors.leaveType}
                      data-testid="leaveType"
                      value={leave.leaveType}
                      onChange={handleChange}
                    >
                      {props.leaveTypes &&
                        props.leaveTypes.map((item) => (
                          <option key={uuidv4()} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col lg="6">
                  <FormGroup>
                    <Label for="Start Date">Start Date</Label>
                    <DatePicker
                      id="startDate"
                      name="startDate"
                      autoComplete="off"
                      value={leave.startDate}
                      onChange={(v, f) => handleDateChange(v, f, 'startDate')}
                      dateFormat="DD-MM-YYYY"
                      invalid={!!errors.startDate}
                    />
                    <div className="text-danger">
                      {errors.startDate && errors.startDate.message}
                      {errors.dateGreaterError && (
                        <p>{errors.dateGreaterError.message}</p>
                      )}
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col lg="6">
                  <FormGroup>
                    <Label for="End Date">End Date</Label>
                    <DatePicker
                      id="endDate"
                      name="endDate"
                      value={leave.endDate}
                      onChange={(v, f) => handleDateChange(v, f, 'endDate')}
                      dateFormat="DD-MM-YYYY"
                    />
                    <div className="text-danger">
                      {errors.endDate && errors.endDate.message}
                      {errors.overlapError && (
                        <p>{errors.overlapError.message}</p>
                      )}
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col lg="6">
                  <FormGroup>
                    <Label for="End Date">No of days on leave</Label>
                    <div>
                      {totalLeavs || 0}
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
                  {!props.loading && (
                    <Button color="primary" className="float-right">
                    Submit
                  </Button>
                  )}
                  <div className="float-right">
                    <PulseLoader
                      css=""
                      size={20}
                      color="#007bff"
                      loading={props.loading}
                    />
                  </div>
                </Col>
              </Row>
            </form>
          </div>
          <AppFooter />
        </div>
      </div>
    </>
  );
};

export default ApplyLeave;
