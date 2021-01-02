import React, { useEffect } from 'react';
import { Row, Col, Button } from 'reactstrap';

import { Link } from 'react-router-dom';
import cx from 'classnames';
import PageTitle from '../../Layout/AppMain/PageTitle';
import TableList from '../../components/TableList';
import { formatColumn } from '../../components/FormatColumn';
import ActionDropdown from '../../components/ActionDropDown';

const ApplyLeave = (props) => {
  const {
    leave,
    user,
    getLeave,
    leaveTypes,
    getStatus,
    getLeaveTypes,
    status,
    updateLeave,
    leaveStatus,
    getLeaveStatus
  } = props;

  useEffect(() => {
    getLeave();
  }, [getLeave]);

  useEffect(() => {
    getStatus();
  }, [getStatus, status.length]);

  useEffect(() => {
    getLeaveTypes();
    getLeaveStatus();
  }, [getLeaveStatus, getLeaveTypes]);

  if (!leave) return null;

  function startDateColumnFormatter(cell, row, rowIndex, formatExtraData) {
    const cellValue = formatColumn(
      cell,
      row,
      rowIndex,
      formatExtraData,
      'type'
    );
    return <span>{cellValue}</span>;
  }

  function endDateColumnFormatter(cell, row, rowIndex, formatExtraData) {
    const cellValue = formatColumn(
      cell,
      row,
      rowIndex,
      formatExtraData,
      'type'
    );
    return <span>{cellValue}</span>;
  }

  function countColumnFormatter(cell, row, rowIndex, formatExtraData) {
    const cellValue = formatColumn(
      cell,
      row,
      rowIndex,
      formatExtraData,
      'status'
    );
    return <span>{cellValue}</span>;
  }

  function descriptionColumnFormatter(cell, row, rowIndex, formatExtraData) {
    const cellValue = formatColumn(
      cell,
      row,
      rowIndex,
      formatExtraData,
      'description'
    );
    return <span>{cellValue}</span>;
  }

  const ActionColumn = (cell, row, rowIndex, formatExtraData) => {
    if (!row) {
      return null;
    }
    const dropdownList = {
      Employee: {
        Applied: [
          {
            callback: () => {
              formatExtraData.callback(row, 'Cancel');
            },
            title: 'Cancel',
            className: 'link-gray'
          }
        ],
        Canceled: []
      },
      Approver: {
        Applied: [
          {
            callback: () => {
              formatExtraData.callback(row, 'Approve');
            },
            title: 'Approve',
            className: 'link-gray'
          },
          {
            callback: () => {
              formatExtraData.callback(row, 'Reject');
            },
            title: 'Reject',
            className: 'link-gray'
          }
        ],
        Approved: [
          {
            callback: () => {
              formatExtraData.callback(row, 'Reject');
            },
            title: 'Reject',
            className: 'link-gray'
          }
        ],
        Rejected: []
      }
    };
    const getActionList = (employeeType, leaveStatus) => {
      return dropdownList[employeeType][leaveStatus];
    };
    const leaveStatusFilter = leaveStatus.filter(
      (item) => item.id === row.status
    );
    const actionDropDowns = getActionList(
      user.type,
      leaveStatusFilter.length && leaveStatusFilter[0].name
    );
    return (
      <>
        <ActionDropdown actions={actionDropDowns} />
      </>
    );
  };

  const columns = [
    {
      dataField: 'id',
      text: 'ID',
      hidden: true,
      searchable: false
    },
    {
      dataField: 'type',
      text: 'Leave Type',
      sort: true,
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return formatColumn(
          cell,
          row,
          rowIndex,
          formatExtraData,
          'type',
          leaveTypes,
          'name'
        );
      },
      editable: false
    },
    {
      dataField: 'startdate',
      text: 'Start Date',
      sort: true,
      formatter: startDateColumnFormatter,
      editable: false
    },
    {
      dataField: 'enddate',
      text: 'End Date',
      sort: true,
      formatter: endDateColumnFormatter,
      editable: false
    },
    {
      dataField: 'description',
      text: 'Description',
      sort: true,
      formatter: descriptionColumnFormatter,
      editable: false
    },
    {
      dataField: 'leavecount',
      text: 'Leave Count',
      sort: true,
      formatter: countColumnFormatter,
      editable: false
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: true,
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return formatColumn(
          cell,
          row,
          rowIndex,
          formatExtraData,
          'status',
          status,
          'name'
        );
      },
      editable: false
    },
    {
      dataField: 'action',
      isDummyColumn: true,
      text: 'Action',
      sort: false,
      classes: 'table-action',
      searchable: false,
      csvExport: false,
      editable: false,
      headerStyle: (colum, colIndex) => {
        return { width: '15%', textAlign: 'center' };
      },
      formatter: ActionColumn
    }
  ];

  return (
    <>
      <Row>
        <Col lg="8">
          <PageTitle
            heading="Leave List"
            subheading="List of all the applied leave."
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
              <div className="page-title-actions">
                <Link to="/apply-leave">
                  <Button color="primary">Apply Leave</Button>
                </Link>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <TableList
        columns={columns}
        data={leave}
        updateLeave={updateLeave}
        leaveStatus={leaveStatus}
      />
    </>
  );
};

export default ApplyLeave;
