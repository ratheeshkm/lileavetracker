import React, { Fragment, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import PageTitle from '../../Layout/AppMain/PageTitle';
import { Button } from 'reactstrap';
import TableList from '../../components/TableList';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { formatColumn } from '../../components/FormatColumn';
import ActionDropdown from '../../components/ActionDropDown';

const ApplyLeave = (props) => {
  const { leave, getLeave, leaveTypes, getStatus, getLeaveTypes, status } = props;

  useEffect(() => {
		getLeave();
  }, [getLeave]);

  useEffect(() => {
		getStatus();
  }, [getStatus, status.length]);

  useEffect(() => {
		getLeaveTypes();
  }, [getLeaveTypes]);
  
  if(!leave) return null;
  console.log("leave-->", leave)
  console.log("leaveTypes-->", leaveTypes)
  console.log("status-->", status)
  

  function startDateColumnFormatter(cell, row, rowIndex, formatExtraData) {
    let cellValue = formatColumn(cell, row, rowIndex, formatExtraData, 'type');
    return <span>{cellValue}</span>;
  }

  function endDateColumnFormatter(cell, row, rowIndex, formatExtraData) {
    let cellValue = formatColumn(cell, row, rowIndex, formatExtraData, 'type');
    return <span>{cellValue}</span>;
  }

  function countColumnFormatter(cell, row, rowIndex, formatExtraData) {
    let cellValue = formatColumn(cell, row, rowIndex, formatExtraData, 'status');
    return <span>{cellValue}</span>;
  }

  function descriptionColumnFormatter(cell, row, rowIndex, formatExtraData) {
    let cellValue = formatColumn(
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
		return (
			<Fragment>
				<ActionDropdown
					actions={[
						{
							callback: () => {
								formatExtraData.callback(row, "Cancel")
							},
							title: "Cancel",
							className: 'link-gray'
						},
            {
							callback: () => {
								formatExtraData.callback(row, "Approve")
							},
							title: "Approve",
							className: 'link-gray'
						},
            {
							callback: () => {
								formatExtraData.callback(row, "Reject")
							},
							title: "Reject",
							className: 'link-gray'
						}
					]}
				/>
			</Fragment>
		);
	}

  const columns = [
    {
      dataField: 'id',
      text: 'ID',
      hidden: true,
      searchable: false,
    },
    {
      dataField: 'type',
      text: 'Leave Type',
      sort: true,
      formatter: (cell, row, rowIndex, formatExtraData) => {
				return formatColumn(cell, row, rowIndex, formatExtraData, 'type', leaveTypes, 'name');
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
				return formatColumn(cell, row, rowIndex, formatExtraData, 'status', status, 'name');
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
    },
  ];

  return (
    <Fragment>
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
              ></div>
              <div className="page-title-actions">
                <Link to="/apply-leave"><Button color="primary">Apply Leave</Button></Link>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <TableList columns={columns} data={leave}
        //update={updateCategories}
        //delete={deleteCategories}
      />
    </Fragment>
  );
};

export default ApplyLeave;
