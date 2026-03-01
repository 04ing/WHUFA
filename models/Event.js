// Event模型 - 处理赛事相关数据
const fs = require('fs');
const path = require('path');

const MATCHES_FILE = path.join(__dirname, '../data/matches.json');
const TEAMS_FILE = path.join(__dirname, '../data/teams.json');
const PLAYERS_FILE = path.join(__dirname, '../data/players.json');
const REFEREES_FILE = path.join(__dirname, '../data/referees.json');

class Event {
    constructor() {
        this.matches = [];
        this.teams = [];
        this.players = [];
        this.referees = [];
        this.loadData();
    }

    // 加载所有数据
    loadData() {
        this.loadMatches();
        this.loadTeams();
        this.loadPlayers();
        this.loadReferees();
    }

    // 加载比赛数据
    loadMatches() {
        try {
            const data = fs.readFileSync(MATCHES_FILE, 'utf8');
            this.matches = JSON.parse(data);
        } catch (error) {
            console.error('Error loading matches:', error);
            this.matches = [];
        }
    }

    // 加载球队数据
    loadTeams() {
        try {
            const data = fs.readFileSync(TEAMS_FILE, 'utf8');
            this.teams = JSON.parse(data);
        } catch (error) {
            console.error('Error loading teams:', error);
            this.teams = [];
        }
    }

    // 加载球员数据
    loadPlayers() {
        try {
            const data = fs.readFileSync(PLAYERS_FILE, 'utf8');
            this.players = JSON.parse(data);
        } catch (error) {
            console.error('Error loading players:', error);
            this.players = [];
        }
    }

    // 加载裁判数据
    loadReferees() {
        try {
            const data = fs.readFileSync(REFEREES_FILE, 'utf8');
            this.referees = JSON.parse(data);
        } catch (error) {
            console.error('Error loading referees:', error);
            this.referees = [];
        }
    }

    // 保存比赛数据
    saveMatches() {
        try {
            fs.writeFileSync(MATCHES_FILE, JSON.stringify(this.matches, null, 2), 'utf8');
        } catch (error) {
            console.error('Error saving matches:', error);
        }
    }

    // 保存球队数据
    saveTeams() {
        try {
            fs.writeFileSync(TEAMS_FILE, JSON.stringify(this.teams, null, 2), 'utf8');
        } catch (error) {
            console.error('Error saving teams:', error);
        }
    }

    // 保存球员数据
    savePlayers() {
        try {
            fs.writeFileSync(PLAYERS_FILE, JSON.stringify(this.players, null, 2), 'utf8');
        } catch (error) {
            console.error('Error saving players:', error);
        }
    }

    // 保存裁判数据
    saveReferees() {
        try {
            fs.writeFileSync(REFEREES_FILE, JSON.stringify(this.referees, null, 2), 'utf8');
        } catch (error) {
            console.error('Error saving referees:', error);
        }
    }

    // 比赛相关方法
    getAllMatches() {
        return this.matches;
    }

    getMatchById(id) {
        return this.matches.find(match => match.id === id);
    }

    createMatch(matchData) {
        const newMatch = {
            id: Date.now().toString(),
            homeTeam: matchData.homeTeam,
            awayTeam: matchData.awayTeam,
            homeScore: matchData.homeScore || 0,
            awayScore: matchData.awayScore || 0,
            date: matchData.date,
            time: matchData.time,
            venue: matchData.venue,
            referee: matchData.referee,
            assistantReferee1: matchData.assistantReferee1,
            assistantReferee2: matchData.assistantReferee2,
            fourthOfficial: matchData.fourthOfficial,
            type: matchData.type,
            status: matchData.status || 'scheduled', // scheduled, in-progress, completed
            events: matchData.events || [],
            createdAt: new Date().toISOString()
        };
        
        this.matches.push(newMatch);
        this.saveMatches();
        return newMatch;
    }

    updateMatch(id, matchData) {
        const index = this.matches.findIndex(match => match.id === id);
        if (index !== -1) {
            this.matches[index] = { ...this.matches[index], ...matchData };
            this.saveMatches();
            return this.matches[index];
        }
        return null;
    }

    deleteMatch(id) {
        const index = this.matches.findIndex(match => match.id === id);
        if (index !== -1) {
            const deletedMatch = this.matches.splice(index, 1);
            this.saveMatches();
            return deletedMatch[0];
        }
        return null;
    }

    // 球队相关方法
    getAllTeams() {
        return this.teams;
    }

    getTeamById(id) {
        return this.teams.find(team => team.id === id);
    }

    createTeam(teamData) {
        const newTeam = {
            id: Date.now().toString(),
            name: teamData.name,
            college: teamData.college,
            coach: teamData.coach,
            logo: teamData.logo,
            players: teamData.players || [],
            createdAt: new Date().toISOString()
        };
        
        this.teams.push(newTeam);
        this.saveTeams();
        return newTeam;
    }

    updateTeam(id, teamData) {
        const index = this.teams.findIndex(team => team.id === id);
        if (index !== -1) {
            this.teams[index] = { ...this.teams[index], ...teamData };
            this.saveTeams();
            return this.teams[index];
        }
        return null;
    }

    deleteTeam(id) {
        const index = this.teams.findIndex(team => team.id === id);
        if (index !== -1) {
            const deletedTeam = this.teams.splice(index, 1);
            this.saveTeams();
            return deletedTeam[0];
        }
        return null;
    }

    // 球员相关方法
    getAllPlayers() {
        return this.players;
    }

    getPlayerById(id) {
        return this.players.find(player => player.id === id);
    }

    getPlayersByTeam(teamId) {
        return this.players.filter(player => player.teamId === teamId);
    }

    createPlayer(playerData) {
        const newPlayer = {
            id: Date.now().toString(),
            name: playerData.name,
            number: playerData.number,
            position: playerData.position,
            teamId: playerData.teamId,
            college: playerData.college,
            grade: playerData.grade,
            createdAt: new Date().toISOString()
        };
        
        this.players.push(newPlayer);
        this.savePlayers();
        return newPlayer;
    }

    updatePlayer(id, playerData) {
        const index = this.players.findIndex(player => player.id === id);
        if (index !== -1) {
            this.players[index] = { ...this.players[index], ...playerData };
            this.savePlayers();
            return this.players[index];
        }
        return null;
    }

    deletePlayer(id) {
        const index = this.players.findIndex(player => player.id === id);
        if (index !== -1) {
            const deletedPlayer = this.players.splice(index, 1);
            this.savePlayers();
            return deletedPlayer[0];
        }
        return null;
    }

    // 裁判相关方法
    getAllReferees() {
        return this.referees;
    }

    getRefereeById(id) {
        return this.referees.find(referee => referee.id === id);
    }

    createReferee(refereeData) {
        const newReferee = {
            id: Date.now().toString(),
            name: refereeData.name,
            level: refereeData.level,
            experience: refereeData.experience,
            college: refereeData.college,
            grade: refereeData.grade,
            createdAt: new Date().toISOString()
        };
        
        this.referees.push(newReferee);
        this.saveReferees();
        return newReferee;
    }

    updateReferee(id, refereeData) {
        const index = this.referees.findIndex(referee => referee.id === id);
        if (index !== -1) {
            this.referees[index] = { ...this.referees[index], ...refereeData };
            this.saveReferees();
            return this.referees[index];
        }
        return null;
    }

    deleteReferee(id) {
        const index = this.referees.findIndex(referee => referee.id === id);
        if (index !== -1) {
            const deletedReferee = this.referees.splice(index, 1);
            this.saveReferees();
            return deletedReferee[0];
        }
        return null;
    }

    // 统计相关方法
    getMatchStatistics() {
        const statistics = {
            totalMatches: this.matches.length,
            completedMatches: this.matches.filter(match => match.status === 'completed').length,
            upcomingMatches: this.matches.filter(match => match.status === 'scheduled').length,
            inProgressMatches: this.matches.filter(match => match.status === 'in-progress').length
        };
        return statistics;
    }

    getTeamStatistics() {
        return this.teams.map(team => {
            const teamMatches = this.matches.filter(match => 
                match.homeTeam === team.name || match.awayTeam === team.name
            );
            
            let wins = 0;
            let losses = 0;
            let draws = 0;
            let goalsFor = 0;
            let goalsAgainst = 0;
            
            teamMatches.forEach(match => {
                if (match.status === 'completed') {
                    if (match.homeTeam === team.name) {
                        goalsFor += parseInt(match.homeScore);
                        goalsAgainst += parseInt(match.awayScore);
                        if (match.homeScore > match.awayScore) wins++;
                        else if (match.homeScore < match.awayScore) losses++;
                        else draws++;
                    } else {
                        goalsFor += parseInt(match.awayScore);
                        goalsAgainst += parseInt(match.homeScore);
                        if (match.awayScore > match.homeScore) wins++;
                        else if (match.awayScore < match.homeScore) losses++;
                        else draws++;
                    }
                }
            });
            
            return {
                teamId: team.id,
                teamName: team.name,
                matches: teamMatches.length,
                wins,
                losses,
                draws,
                goalsFor,
                goalsAgainst,
                goalDifference: goalsFor - goalsAgainst,
                points: wins * 3 + draws
            };
        }).sort((a, b) => b.points - a.points);
    }

    getPlayerStatistics() {
        const playerStats = {};
        
        this.matches.forEach(match => {
            if (match.events) {
                match.events.forEach(event => {
                    if (event.type === 'goal' || event.type === 'penalty') {
                        if (!playerStats[event.player]) {
                            playerStats[event.player] = {
                                playerName: event.player,
                                goals: 0,
                                penalties: 0
                            };
                        }
                        if (event.type === 'goal') {
                            playerStats[event.player].goals++;
                        } else if (event.type === 'penalty') {
                            playerStats[event.player].penalties++;
                        }
                    }
                });
            }
        });
        
        return Object.values(playerStats).sort((a, b) => (b.goals + b.penalties) - (a.goals + a.penalties));
    }
}