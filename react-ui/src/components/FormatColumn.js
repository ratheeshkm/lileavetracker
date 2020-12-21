import React from 'react';

function formatColumn (cellValue, row, rowIndex, formatExtraData, fieldNameParam, fieldSearchArray="",  fieldName="") {
	const data = (formatExtraData && formatExtraData.filter(item => item.rowId === row.id)) || [];
	let fieldNameOrg = (fieldName) ? fieldName : 'name';
	if (fieldSearchArray.length) {
		cellValue = fieldSearchArray.filter(item => item.id === cellValue)[0][fieldNameOrg];
	}
	if (data.length) {
		const [{ rowId = '', fields = {}, action = '' }] = data;
		if (rowId === row.id) {
			let oldValue = fields[fieldNameParam] || '';
			if (fieldSearchArray && oldValue) {
				oldValue = fieldSearchArray.filter(item => item.id === oldValue)[0][fieldNameOrg];
			}
			if (action === 'Update' && oldValue && oldValue !== cellValue) {
				cellValue = <div>
					<div className="text-danger"><del>{oldValue}</del></div>
					<div className="text-success">{cellValue}</div>
				</div>
			}
			if (action === 'Delete') {
				cellValue = <div>
					<div className="text-danger"><del>{cellValue}</del></div>
				</div>
			}
		}
	}
	return cellValue;
}

export {
	formatColumn
}