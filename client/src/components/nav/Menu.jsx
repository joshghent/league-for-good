import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import AddCircle from 'material-ui/svg-icons/content/add-circle';
import Help from 'material-ui/svg-icons/action/help';
import LogOutIcon from 'material-ui/svg-icons/action/exit-to-app';

import MenuLeagueItem from './MenuLeagueItem.jsx';

import { cssMenu } from '../styles';

const Menu = (props) => {
	const { open, leagues, selectLeague, openModal } = props;
	const activeLeagues = leagues.filter(league => league.archived === false);
	const archivedLeagues = leagues.filter(league => league.archived !== false);
	return (
		<Drawer open={open} width={'15%'}>
			<List style={cssMenu.drawer.list}>
				{activeLeagues.length > 0 ? (
					<div>
						{activeLeagues.map((league, i) => (
							<MenuLeagueItem
								key={i}
								league={league}
								selectLeague={selectLeague}
							/>
							)
						)}
						< Divider />
					</div>) : <noScript />
				}
				{archivedLeagues.length > 0 ? (
					<div>
						<ListItem
							nestedItems={[
								archivedLeagues.map((league, i) => (
									<MenuLeagueItem
										key={i}
										league={league}
										selectLeague={selectLeague}
									/>
								)
								)
							]}
							primaryText='ARCHIVE'
						/>
						< Divider />
					</div>) : <noScript />
				}
				<ListItem
					containerElement={<Link to='/create' />}
					leftIcon={<AddCircle />}
					primaryText='Create League'
				/>
				<ListItem
					containerElement={<Link to='/help' />}
					leftIcon={<Help />}
					primaryText='Help'
				/>
				<ListItem
					leftIcon={<LogOutIcon/>}
					onTouchTap={()=> openModal('logout')}
					primaryText='Log out'
				/>
			</List>
		</Drawer>
	);
};

Menu.propTypes = {
	leagues: PropTypes.arrayOf(PropTypes.object),
	open: PropTypes.bool,
	openModal: PropTypes.func,
	selectLeague: PropTypes.func
};

export default Menu;
