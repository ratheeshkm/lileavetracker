import React, { useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory, {
  PaginationProvider
} from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import overlayFactory from 'react-bootstrap-table2-overlay';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import { toast, Bounce } from 'react-toastify';

import confirm from 'reactstrap-confirm';
import ActionDropdown from './ActionDropDown';

const TableList = (props) => {
  let { columns, data } = props;
  const [editedRows, setEditedRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      setSelectedRows([...selectedRows, row]);
    } else {
      setSelectedRows(
        selectedRows.filter((item) => (item.id !== row.id ? item : false))
      );
    }
    return true;
  };

  const handleOnSelectAll = (isSelect, rows) => {
    setSelectedRows(isSelect ? [...rows] : []);
    return true;
  };

  const selectRow = {
    mode: 'checkbox',
    clickToEdit: true,
    onSelect: handleOnSelect,
    onSelectAll: handleOnSelectAll,
    style: { backgroundColor: '#c8e6c9' }
  };

  const deleteSelectedRows = (deletingrows) => {
    const deletingRowsIds = deletingrows.length
      ? deletingrows.map((item) => item.id)
      : selectedRows.map((item) => item.id);
    if (deletingRowsIds.length) {
      props.delete(deletingRowsIds).then((result) => {
        if (result) {
          setEditedRows(
            editedRows.filter((item) =>
              !deletingRowsIds.includes(item.rowId) ? item : false
            )
          );
          setSelectedRows(
            selectedRows.filter((item) =>
              !deletingRowsIds.includes(item.id) ? item : false
            )
          );
          toast('Delete Transaction Successfull', {
            transition: Bounce,
            closeButton: true,
            autoClose: 2000,
            position: 'top-right',
            type: 'success'
          });
        }
      });
    }
  };

  const updateSelectedRows = () => {
    const updatedIds = selectedRows.length
      ? selectedRows.map((item) => item.id)
      : editedRows.map((item) => item.action !== 'Delete' && item.rowId);
    const updatingRows = data.filter((item) => updatedIds.includes(item.id));
    const deletedIds = editedRows.map(
      (item) => item.action === 'Delete' && item.rowId
    );
    const deletingrows = data.filter((item) => deletedIds.includes(item.id));
    if (deletingrows.length) {
      deleteSelectedRows(deletingrows);
    }
    if (updatingRows.length) {
      props.update(updatingRows).then((result) => {
        if (result) {
          setEditedRows(
            editedRows.filter((item) =>
              !updatedIds.includes(item.rowId) ? item : false
            )
          );
          toast('Update Transaction Sucessfull', {
            transition: Bounce,
            closeButton: true,
            autoClose: 2000,
            position: 'top-right',
            type: 'success'
          });
        }
      });
    }
  };

  const handleRowAction = async (row, action) => {
    if (action === 'Delete') {
      if (editedRows.length) {
        const existingItem = editedRows.filter((item) => item.rowId === row.id);
        if (existingItem.length) {
          const [{ fields = '' }] = existingItem;
          data.forEach((item) => {
            if (item.id === row.id) {
              item.name = fields.name ? fields.name : item.name;
              item.description = fields.description
                ? fields.description
                : item.description;
            }
          });
        }
      }

      const findIndex = editedRows.findIndex((item) => item.rowId === row.id);
      let updatedRows = '';
      if (findIndex !== -1) {
        updatedRows = editedRows.map((item) =>
          item.rowId === row.id
            ? { ...item, fields: {}, action: 'Delete' }
            : item
        );
      } else {
        updatedRows = [
          ...editedRows,
          {
            rowId: row.id,
            fields: {},
            action: 'Delete'
          }
        ];
      }
      setEditedRows(updatedRows);
    }

    if (action === 'Undo Delete') {
      const updatedRows = editedRows.map((item) =>
        item.rowId === row.id ? { ...item, action: '' } : item
      );
      setEditedRows(updatedRows);
    }

    if (action === 'Cancel' || action === 'Approve' || action === 'Reject') {
      const actionItem = props.leaveStatus.filter((item) => {
        const actionName = action === 'Approve' ? `${action}d` : `${action}ed`;
        return item.name === actionName;
      });
      const result = await confirm({
        title: <>Confirm</>,
        message: `Are you sure to ${action.toLowerCase()} the leave?`,
        confirmText: 'OK',
        confirmColor: 'primary',
        cancelColor: 'link text-danger'
      });
      if (result) {
        const actionData = {
          leaveId: row.id,
          statusId: actionItem[0].id
        };
        props.updateLeave(actionData);
      }
    }
    // If cancel
    // If approve
    // If reject
  };

  const handleValidator = (newValue, row, column) => {
    if (!newValue.trim()) {
      return {
        valid: false,
        message: 'This field is required'
      };
    }
  };

  function handleChange(oldValue, newValue, row, column) {
    if (!newValue) return;
    let updatedRows = [];
    // let editedRows = [];
    // let editedValues = {
    // 	id: row.id,
    // 	isUpdate: true
    // }
    // editedRows.push(editedValues);
    if (oldValue !== 'undefined' && oldValue !== newValue) {
      const isExisting = editedRows.findIndex((el) => el.rowId === row.id);
      if (isExisting !== -1) {
        updatedRows = editedRows.map((item) =>
          item.rowId === row.id
            ? {
                ...item,
                fields: {
                  ...item.fields,
                  [column.dataField]:
                    item.fields[column.dataField] !== undefined
                      ? item.fields[column.dataField]
                      : oldValue
                },
                action: 'Update'
              }
            : item
        );
      } else {
        updatedRows = [
          ...editedRows,
          {
            rowId: row.id,
            fields: {
              [column.dataField]: oldValue
            },
            action: 'Update'
          }
        ];
      }
      setEditedRows([...updatedRows]);
    }
  }

  const ActionColumn = (cell, row, rowIndex, formatExtraData) => {
    if (!row) {
      return null;
    }
    const actionText = 'Cancel';
    return (
      <>
        <ActionDropdown
          actions={[
            {
              callback: () => {
                formatExtraData.callback(row, actionText);
              },
              title: actionText,
              className: 'link-gray'
            }
          ]}
        />
      </>
    );
  };

  const sizePerPageRenderer = ({
    options,
    currSizePerPage,
    onSizePerPageChange
  }) => (
    <div className="btn-group" role="group">
      {options.map((option) => {
        const isSelect = currSizePerPage === `${option.page}`;
        return (
          <button
            key={option.text}
            type="button"
            onClick={() => onSizePerPageChange(option.page)}
            className={`btn ${isSelect ? 'btn-secondary' : 'btn-warning'}`}
          >
            {option.text}
          </button>
        );
      })}
    </div>
  );
  const options = { sizePerPageRenderer };
  const { SearchBar } = Search;
  const NoDataIndication = () => {
    return <div>No Data</div>;
  };

  columns = columns.map((item) => {
    item.validator = handleValidator;
    if (item.dataField === 'action') {
      item.formatExtraData = {
        callback: handleRowAction,
        editedRows
      };
      item.formatter = item.formatter ? item.formatter : ActionColumn;
    } else {
      item.formatExtraData = editedRows;
    }
    return item;
  });

  const contentTable = ({ paginationProps, paginationTableProps }) => (
    <div>
      <ToolkitProvider keyField="id" columns={columns} data={data} search>
        {(toolkitprops) => (
          <div>
            <SearchBar {...toolkitprops.searchProps} />
            <div className="action-buttons">
              {selectedRows.length > 0 && data.length > 0 && (
                <Button
                  className="mb-2 mr-2"
                  color="danger"
                  onClick={deleteSelectedRows}
                >
                  Delete
                </Button>
              )}
              {editedRows.length > 0 &&
                editedRows.filter((item) => item.action !== '').length > 0 &&
                data.length > 0 && (
                  <Button
                    className="mb-2 mr-2"
                    color="primary"
                    onClick={updateSelectedRows}
                  >
                    Update
                  </Button>
                )}
            </div>
            <BootstrapTable
              keyField="id"
              bootstrap4
              noDataIndication={<NoDataIndication />}
              data={data}
              columns={columns}
              cellEdit={cellEditFactory({
                mode: 'click',
                blurToSave: true,
                afterSaveCell: handleChange
              })}
              selectRow={selectRow}
              filter={filterFactory()}
              filterPosition="top"
              loading={false}
              overlay={overlayFactory()}
              pagination={paginationFactory(options)}
              search={toolkitprops.baseProps.search}
              // {...toolkitprops.baseProps}
              {...paginationTableProps}
            />
          </div>
        )}
      </ToolkitProvider>
    </div>
  );

  return (
    <>
      <ReactCSSTransitionGroup
        component="div"
        transitionName="TabsAnimation"
        transitionAppear
        transitionAppearTimeout={0}
        transitionEnter={false}
        transitionLeave={false}
      >
        <Row>
          <Col lg="12">
            <Card className="main-card mb-3">
              <CardBody>
                <div>
                  <PaginationProvider pagination={paginationFactory(options)}>
                    {contentTable}
                  </PaginationProvider>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </ReactCSSTransitionGroup>
    </>
  );
};

export default TableList;
