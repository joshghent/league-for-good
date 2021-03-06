const express = require('express');

const Router = express.Router();
const mongoose = require('mongoose');

const League = mongoose.model('league');
const Seasons = mongoose.model('season');
const Players = mongoose.model('player');
const Teams = mongoose.model('team');
const roles = require('../config/roles.config');

// Create a new league for the user
const createLeague = (req, res) => {
	const newLeague = new League({
		name: req.body.name,
		sportType: req.body.sportType,
		staff: [{
			email: req.user.email,
			role: roles.getOwnerRole(),
			teams: []
		}],
		archived: false
	});

	newLeague.save()
		.then((league) => {
			res.status(200);
			res.send(league);
		})
		.catch(() => {
			res.status(500);
			res.send('error server side');
		});
};

const fetchLeagueDetails = (req, res) => {
	const { leagueId } = req.params;

	const fetchPlayers = Players.find({ leagueId });
	const fetchSeasons = Seasons.find({ leagueId })
		.sort({ endDate: 1 });
	const fetchTeams = Teams.find({ leagueId });
	const fetchLeague = League.findOne({ _id: leagueId })
		.select({ _id: 0, staff: 1, archived: 1});

	Promise.all([
		fetchSeasons.exec(),
		fetchTeams.exec(),
		fetchPlayers.exec(),
		fetchLeague.exec()
	])
	.then(([seasons, teams, players, league]) => {
		res.send({
			teams,
			seasons,
			players,
			staff: league.staff,
			archived: league.archived
		});
	});

};

// remove this because we're not allowing complete deletion?
const deleteLeague = (req, res) => {
	const { leagueId } = req.params;

	League.findById(leagueId)
		.exec()
		.then( league => league.remove())
		.then(() => res.status(200).send('Deleted League'))
		.catch( err => { throw err; });
};

const updateLeague = (req, res) => {
	const query = { _id: req.params.leagueId };
	League.update(query, req.body, {new: true, upsert: true})
		.exec()
		.then(() => res.send(req.body))
		.catch(error => res.status(500).json({ error: error}));
};

Router.route('/create').post(createLeague);
Router.route('/remove/:leagueId').delete(deleteLeague);
Router.route('/fetch/:leagueId').get(fetchLeagueDetails);
Router.route('/update/:leagueId').put(updateLeague);


module.exports = Router;
