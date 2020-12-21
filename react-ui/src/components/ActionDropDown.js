import React, { useState } from 'react';
import {
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem
} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'

const ActionDropdown = (props) => {
	const { actions = [] } = props;
	const [dropdownOpen, setDropdownOpen] = useState(false);

	let history = useHistory();

	const toggle = () => setDropdownOpen(!dropdownOpen);
	const handleCallback = callback => {
		toggle();
		callback();
	};

	return (
		<Dropdown isOpen={dropdownOpen} toggle={toggle}>
			<DropdownToggle color={'transparent'} onClick={e => e.stopPropagation()}>
				<FontAwesomeIcon icon={faEllipsisH} />
			</DropdownToggle>
			<DropdownMenu>
				{actions.map((item, index) => (
					<DropdownItem
						onClick={
							item.callback
								? () => handleCallback(item.callback)
								: () => history.push(item.pathname)
						}
						className={item.className}
						key={`dd-${index}`}
					>
						{item.title}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
};

export default ActionDropdown;