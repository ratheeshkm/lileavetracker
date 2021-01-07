import React, {  useState, useEffect } from 'react';
import { Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import cx from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import PageTitle from '../../Layout/AppMain/PageTitle';
import AppHeader from '../../Layout/AppHeader';
import AppSidebar from '../../Layout/AppSidebar';
import AppFooter from '../../Layout/AppFooter';
import { formatColumn } from '../../components/FormatColumn';

const Report = (props) => {
  const {
    getLeaveReport,
    leaveReport = [],
    getLeaveTypes,
    leaveTypes,
    getStatus,
    getLeaveStatus,
    status,
    getUserList,
    userList
  } = props;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);
  const handleChange = (event) => {
    event.target.name === 'year' && setYear(event.target.value);
    event.target.name === 'month' && setMonth(event.target.value);
  };
  const years = Array(20)
    .fill('')
    .map((item, index) => currentYear - 10 + index);
  const handleReportClick = () => {
    getLeaveReport({ year, month });
  };
  useEffect(() => {
    getStatus();
    getLeaveTypes();
    getLeaveStatus();
    getLeaveReport({ year, month });
    getUserList()
  }, [getLeaveReport, getLeaveStatus, getLeaveTypes, getStatus, getUserList, month, year]);
  console.log("userList-->", userList)
  const columns = [
    {
      dataField: 'userid',
      text: 'Employee',
      sort: true,
      formatter: (cell, row, rowIndex, formatExtraData) =>
        formatColumn(
          cell,
          row,
          rowIndex,
          formatExtraData,
          'userid',
          userList,
          'name'
        ),
      csvFormatter: (cell, row, rowIndex, formatExtraData) =>
        formatColumn(
          cell,
          row,
          rowIndex,
          formatExtraData,
          'userid',
          userList,
          'name'
        ),
      editable: false
    },
    {
      dataField: 'type',
      text: 'Leave Type',
      sort: true,
      formatter: (cell, row, rowIndex, formatExtraData) =>
        formatColumn(
          cell,
          row,
          rowIndex,
          formatExtraData,
          'type',
          leaveTypes,
          'name'
        ),
      csvFormatter: (cell, row, rowIndex, formatExtraData) =>
        formatColumn(
          cell,
          row,
          rowIndex,
          formatExtraData,
          'type',
          leaveTypes,
          'name'
        ),
      editable: false
    },
    {
      dataField: 'startdate',
      text: 'Start Date',
      sort: true,
      editable: false
    },
    {
      dataField: 'enddate',
      text: 'End Date',
      sort: true,
      editable: false
    },
    {
      dataField: 'description',
      text: 'Description',
      sort: true,
      editable: false
    },
    {
      dataField: 'leavecount',
      text: 'Leave Count',
      sort: true,
      editable: false
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: true,
      formatter: (cell, row, rowIndex, formatExtraData) =>
        formatColumn(
          cell,
          row,
          rowIndex,
          formatExtraData,
          'status',
          status,
          'name'
        ),
      csvFormatter: (cell, row, rowIndex, formatExtraData) =>
        formatColumn(
          cell,
          row,
          rowIndex,
          formatExtraData,
          'status',
          status,
          'name'
        ),
      editable: false
    }
  ];
  
  const MyExportCSV = (props) => {
    const handleClick = () => {
      props.onExport();
    };
    return (
      <div>
        <button className="btn btn-success float-right" onClick={handleClick}>
          Export to CSV
        </button>
      </div>
    );
  };
  console.log('leaveReport-->', leaveReport)
  return (
    <>
      <AppHeader />
      <div className="app-main">
        <AppSidebar />
        <div className="app-main__outer">
          <div className="app-main__inner">
            <Row>
              <Col lg="8">
                <PageTitle
                  heading="Report"
                  subheading=""
                  icon="pe-7s-drawer icon-gradient bg-happy-itmeo"
                />
              </Col>
              <Col lg="4">
                <div className="app-page-title">
                  <div className="page-title-wrapper">
                    <div
                      className={cx('page-title-icon')}
                      style={{ boxShadow: '0 0 black', background: 'none' }}
                    />
                    <div className="page-title-actions" />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg="3">
                <FormGroup>
                  <Label for="Year">Year</Label>
                  <Input
                    type="select"
                    name="year"
                    id="year"
                    data-testid="year"
                    value={year}
                    onChange={handleChange}
                  >
                    {years.map((item) => (
                      <option key={uuidv4()} value={item}>
                        {item}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col lg="3">
                <FormGroup>
                  <Label for="Month">Month</Label>
                  <Input
                    type="select"
                    name="month"
                    id="month"
                    data-testid="month"
                    value={month}
                    onChange={handleChange}
                  >
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col lg="3">
                <FormGroup>
                  <Button
                    color="primary"
                    className="float-left"
                    style={{ marginTop: '30px' }}
                    onClick={handleReportClick}
                  >
                    Apply
                  </Button>
                </FormGroup>
              </Col>
            </Row>
            {leaveReport && leaveReport.length >= 0 && <ToolkitProvider
              keyField="id"
              data={leaveReport}
              columns={columns}
              exportCSV
            >
              {(props) => (
                <div>
                  <MyExportCSV {...props.csvProps} /> <br /> <br />
                  <BootstrapTable
                    {...props.baseProps}
                    pagination={paginationFactory()}
                  />
                </div>
              )}
            </ToolkitProvider>}
            {leaveReport.length < 0 && <div>No Data</div>}
          </div>
          <AppFooter />
        </div>
      </div>
    </>
  );
};

export default Report;
