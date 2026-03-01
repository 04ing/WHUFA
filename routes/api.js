// API路由 - 处理所有API请求
const express = require('express');
const router = express.Router();

// 导入模型
const User = require('../models/User');
const Event = require('../models/Event');
const Content = require('../models/Content');
const Interaction = require('../models/Interaction');

// 初始化模型实例
const userModel = new User();
const eventModel = new Event();
const contentModel = new Content();
const interactionModel = new Interaction();

// 用户相关路由
router.get('/users', (req, res) => {
    const users = userModel.getAllUsers();
    res.status(200).json(users);
});

router.get('/users/:id', (req, res) => {
    const user = userModel.getUserById(req.params.id);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

router.post('/users', (req, res) => {
    const newUser = userModel.createUser(req.body);
    res.status(201).json(newUser);
});

router.put('/users/:id', (req, res) => {
    const updatedUser = userModel.updateUser(req.params.id, req.body);
    if (updatedUser) {
        res.status(200).json(updatedUser);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

router.delete('/users/:id', (req, res) => {
    const deletedUser = userModel.deleteUser(req.params.id);
    if (deletedUser) {
        res.status(200).json(deletedUser);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

router.post('/login', (req, res) => {
    const { name, password } = req.body;
    const user = userModel.validateLogin(name, password);
    if (user) {
        res.status(200).json({ message: 'Login successful', user });
    } else {
        res.status(401).json({ error: 'Invalid name or password' });
    }
});

// 赛事相关路由
router.get('/matches', (req, res) => {
    const matches = eventModel.getAllMatches();
    res.status(200).json(matches);
});

router.get('/matches/:id', (req, res) => {
    const match = eventModel.getMatchById(req.params.id);
    if (match) {
        res.status(200).json(match);
    } else {
        res.status(404).json({ error: 'Match not found' });
    }
});

router.post('/matches', (req, res) => {
    const newMatch = eventModel.createMatch(req.body);
    res.status(201).json(newMatch);
});

router.put('/matches/:id', (req, res) => {
    const updatedMatch = eventModel.updateMatch(req.params.id, req.body);
    if (updatedMatch) {
        res.status(200).json(updatedMatch);
    } else {
        res.status(404).json({ error: 'Match not found' });
    }
});

router.delete('/matches/:id', (req, res) => {
    const deletedMatch = eventModel.deleteMatch(req.params.id);
    if (deletedMatch) {
        res.status(200).json(deletedMatch);
    } else {
        res.status(404).json({ error: 'Match not found' });
    }
});

// 球队相关路由
router.get('/teams', (req, res) => {
    const teams = eventModel.getAllTeams();
    res.status(200).json(teams);
});

router.get('/teams/:id', (req, res) => {
    const team = eventModel.getTeamById(req.params.id);
    if (team) {
        res.status(200).json(team);
    } else {
        res.status(404).json({ error: 'Team not found' });
    }
});

router.post('/teams', (req, res) => {
    const newTeam = eventModel.createTeam(req.body);
    res.status(201).json(newTeam);
});

router.put('/teams/:id', (req, res) => {
    const updatedTeam = eventModel.updateTeam(req.params.id, req.body);
    if (updatedTeam) {
        res.status(200).json(updatedTeam);
    } else {
        res.status(404).json({ error: 'Team not found' });
    }
});

router.delete('/teams/:id', (req, res) => {
    const deletedTeam = eventModel.deleteTeam(req.params.id);
    if (deletedTeam) {
        res.status(200).json(deletedTeam);
    } else {
        res.status(404).json({ error: 'Team not found' });
    }
});

// 球员相关路由
router.get('/players', (req, res) => {
    const players = eventModel.getAllPlayers();
    res.status(200).json(players);
});

router.get('/players/:id', (req, res) => {
    const player = eventModel.getPlayerById(req.params.id);
    if (player) {
        res.status(200).json(player);
    } else {
        res.status(404).json({ error: 'Player not found' });
    }
});

router.get('/teams/:id/players', (req, res) => {
    const players = eventModel.getPlayersByTeam(req.params.id);
    res.status(200).json(players);
});

router.post('/players', (req, res) => {
    const newPlayer = eventModel.createPlayer(req.body);
    res.status(201).json(newPlayer);
});

router.put('/players/:id', (req, res) => {
    const updatedPlayer = eventModel.updatePlayer(req.params.id, req.body);
    if (updatedPlayer) {
        res.status(200).json(updatedPlayer);
    } else {
        res.status(404).json({ error: 'Player not found' });
    }
});

router.delete('/players/:id', (req, res) => {
    const deletedPlayer = eventModel.deletePlayer(req.params.id);
    if (deletedPlayer) {
        res.status(200).json(deletedPlayer);
    } else {
        res.status(404).json({ error: 'Player not found' });
    }
});

// 裁判相关路由
router.get('/referees', (req, res) => {
    const referees = eventModel.getAllReferees();
    res.status(200).json(referees);
});

router.get('/referees/:id', (req, res) => {
    const referee = eventModel.getRefereeById(req.params.id);
    if (referee) {
        res.status(200).json(referee);
    } else {
        res.status(404).json({ error: 'Referee not found' });
    }
});

router.post('/referees', (req, res) => {
    const newReferee = eventModel.createReferee(req.body);
    res.status(201).json(newReferee);
});

router.put('/referees/:id', (req, res) => {
    const updatedReferee = eventModel.updateReferee(req.params.id, req.body);
    if (updatedReferee) {
        res.status(200).json(updatedReferee);
    } else {
        res.status(404).json({ error: 'Referee not found' });
    }
});

router.delete('/referees/:id', (req, res) => {
    const deletedReferee = eventModel.deleteReferee(req.params.id);
    if (deletedReferee) {
        res.status(200).json(deletedReferee);
    } else {
        res.status(404).json({ error: 'Referee not found' });
    }
});

// 统计相关路由
router.get('/statistics/matches', (req, res) => {
    const statistics = eventModel.getMatchStatistics();
    res.status(200).json(statistics);
});

router.get('/statistics/teams', (req, res) => {
    const statistics = eventModel.getTeamStatistics();
    res.status(200).json(statistics);
});

router.get('/statistics/players', (req, res) => {
    const statistics = eventModel.getPlayerStatistics();
    res.status(200).json(statistics);
});

// 新闻相关路由
router.get('/news', (req, res) => {
    const news = contentModel.getAllNews();
    res.status(200).json(news);
});

router.get('/news/:id', (req, res) => {
    const news = contentModel.getNewsById(req.params.id);
    if (news) {
        res.status(200).json(news);
    } else {
        res.status(404).json({ error: 'News not found' });
    }
});

router.post('/news', (req, res) => {
    const newNews = contentModel.createNews(req.body);
    res.status(201).json(newNews);
});

router.put('/news/:id', (req, res) => {
    const updatedNews = contentModel.updateNews(req.params.id, req.body);
    if (updatedNews) {
        res.status(200).json(updatedNews);
    } else {
        res.status(404).json({ error: 'News not found' });
    }
});

router.delete('/news/:id', (req, res) => {
    const deletedNews = contentModel.deleteNews(req.params.id);
    if (deletedNews) {
        res.status(200).json(deletedNews);
    } else {
        res.status(404).json({ error: 'News not found' });
    }
});

// 公告相关路由
router.get('/announcements', (req, res) => {
    const announcements = contentModel.getAllAnnouncements();
    res.status(200).json(announcements);
});

router.get('/announcements/:id', (req, res) => {
    const announcement = contentModel.getAnnouncementById(req.params.id);
    if (announcement) {
        res.status(200).json(announcement);
    } else {
        res.status(404).json({ error: 'Announcement not found' });
    }
});

router.post('/announcements', (req, res) => {
    const newAnnouncement = contentModel.createAnnouncement(req.body);
    res.status(201).json(newAnnouncement);
});

router.put('/announcements/:id', (req, res) => {
    const updatedAnnouncement = contentModel.updateAnnouncement(req.params.id, req.body);
    if (updatedAnnouncement) {
        res.status(200).json(updatedAnnouncement);
    } else {
        res.status(404).json({ error: 'Announcement not found' });
    }
});

router.delete('/announcements/:id', (req, res) => {
    const deletedAnnouncement = contentModel.deleteAnnouncement(req.params.id);
    if (deletedAnnouncement) {
        res.status(200).json(deletedAnnouncement);
    } else {
        res.status(404).json({ error: 'Announcement not found' });
    }
});

// 画廊相关路由
router.get('/gallery', (req, res) => {
    const gallery = contentModel.getAllGalleryItems();
    res.status(200).json(gallery);
});

router.get('/gallery/:id', (req, res) => {
    const item = contentModel.getGalleryItemById(req.params.id);
    if (item) {
        res.status(200).json(item);
    } else {
        res.status(404).json({ error: 'Gallery item not found' });
    }
});

router.post('/gallery', (req, res) => {
    const newItem = contentModel.createGalleryItem(req.body);
    res.status(201).json(newItem);
});

router.put('/gallery/:id', (req, res) => {
    const updatedItem = contentModel.updateGalleryItem(req.params.id, req.body);
    if (updatedItem) {
        res.status(200).json(updatedItem);
    } else {
        res.status(404).json({ error: 'Gallery item not found' });
    }
});

router.delete('/gallery/:id', (req, res) => {
    const deletedItem = contentModel.deleteGalleryItem(req.params.id);
    if (deletedItem) {
        res.status(200).json(deletedItem);
    } else {
        res.status(404).json({ error: 'Gallery item not found' });
    }
});

// 规则相关路由
router.get('/rules', (req, res) => {
    const rules = contentModel.getAllRules();
    res.status(200).json(rules);
});

router.get('/rules/:id', (req, res) => {
    const rule = contentModel.getRuleById(req.params.id);
    if (rule) {
        res.status(200).json(rule);
    } else {
        res.status(404).json({ error: 'Rule not found' });
    }
});

router.post('/rules', (req, res) => {
    const newRule = contentModel.createRule(req.body);
    res.status(201).json(newRule);
});

router.put('/rules/:id', (req, res) => {
    const updatedRule = contentModel.updateRule(req.params.id, req.body);
    if (updatedRule) {
        res.status(200).json(updatedRule);
    } else {
        res.status(404).json({ error: 'Rule not found' });
    }
});

router.delete('/rules/:id', (req, res) => {
    const deletedRule = contentModel.deleteRule(req.params.id);
    if (deletedRule) {
        res.status(200).json(deletedRule);
    } else {
        res.status(404).json({ error: 'Rule not found' });
    }
});

// 搜索路由
router.get('/search', (req, res) => {
    const keyword = req.query.keyword;
    if (keyword) {
        const results = contentModel.searchContent(keyword);
        res.status(200).json(results);
    } else {
        res.status(400).json({ error: 'Keyword is required' });
    }
});

// 评论相关路由
router.get('/comments', (req, res) => {
    const comments = interactionModel.getAllComments();
    res.status(200).json(comments);
});

router.get('/comments/:targetType/:targetId', (req, res) => {
    const comments = interactionModel.getCommentsByTarget(req.params.targetType, req.params.targetId);
    res.status(200).json(comments);
});

router.post('/comments', (req, res) => {
    const newComment = interactionModel.createComment(req.body);
    res.status(201).json(newComment);
});

router.put('/comments/:id', (req, res) => {
    const updatedComment = interactionModel.updateComment(req.params.id, req.body);
    if (updatedComment) {
        res.status(200).json(updatedComment);
    } else {
        res.status(404).json({ error: 'Comment not found' });
    }
});

router.delete('/comments/:id', (req, res) => {
    const deletedComment = interactionModel.deleteComment(req.params.id);
    if (deletedComment) {
        res.status(200).json(deletedComment);
    } else {
        res.status(404).json({ error: 'Comment not found' });
    }
});

router.post('/comments/:id/like', (req, res) => {
    const likedComment = interactionModel.likeComment(req.params.id);
    if (likedComment) {
        res.status(200).json(likedComment);
    } else {
        res.status(404).json({ error: 'Comment not found' });
    }
});

// 讨论相关路由
router.get('/discussions', (req, res) => {
    const discussions = interactionModel.getAllDiscussions();
    res.status(200).json(discussions);
});

router.get('/discussions/:id', (req, res) => {
    const discussion = interactionModel.getDiscussionById(req.params.id);
    if (discussion) {
        // 增加浏览次数
        interactionModel.incrementDiscussionViews(req.params.id);
        res.status(200).json(discussion);
    } else {
        res.status(404).json({ error: 'Discussion not found' });
    }
});

router.post('/discussions', (req, res) => {
    const newDiscussion = interactionModel.createDiscussion(req.body);
    res.status(201).json(newDiscussion);
});

router.put('/discussions/:id', (req, res) => {
    const updatedDiscussion = interactionModel.updateDiscussion(req.params.id, req.body);
    if (updatedDiscussion) {
        res.status(200).json(updatedDiscussion);
    } else {
        res.status(404).json({ error: 'Discussion not found' });
    }
});

router.delete('/discussions/:id', (req, res) => {
    const deletedDiscussion = interactionModel.deleteDiscussion(req.params.id);
    if (deletedDiscussion) {
        res.status(200).json(deletedDiscussion);
    } else {
        res.status(404).json({ error: 'Discussion not found' });
    }
});

router.post('/discussions/:id/like', (req, res) => {
    const likedDiscussion = interactionModel.likeDiscussion(req.params.id);
    if (likedDiscussion) {
        res.status(200).json(likedDiscussion);
    } else {
        res.status(404).json({ error: 'Discussion not found' });
    }
});

// 投票相关路由
router.get('/polls', (req, res) => {
    const polls = interactionModel.getAllPolls();
    res.status(200).json(polls);
});

router.get('/polls/:id', (req, res) => {
    const poll = interactionModel.getPollById(req.params.id);
    if (poll) {
        res.status(200).json(poll);
    } else {
        res.status(404).json({ error: 'Poll not found' });
    }
});

router.post('/polls', (req, res) => {
    const newPoll = interactionModel.createPoll(req.body);
    res.status(201).json(newPoll);
});

router.put('/polls/:id', (req, res) => {
    const updatedPoll = interactionModel.updatePoll(req.params.id, req.body);
    if (updatedPoll) {
        res.status(200).json(updatedPoll);
    } else {
        res.status(404).json({ error: 'Poll not found' });
    }
});

router.delete('/polls/:id', (req, res) => {
    const deletedPoll = interactionModel.deletePoll(req.params.id);
    if (deletedPoll) {
        res.status(200).json(deletedPoll);
    } else {
        res.status(404).json({ error: 'Poll not found' });
    }
});

router.post('/polls/:id/vote', (req, res) => {
    const { optionId, userId } = req.body;
    const result = interactionModel.votePoll(req.params.id, optionId, userId);
    if (result.error) {
        res.status(400).json(result);
    } else {
        res.status(200).json(result);
    }
});

// 反馈相关路由
router.get('/feedback', (req, res) => {
    const feedback = interactionModel.getAllFeedback();
    res.status(200).json(feedback);
});

router.get('/feedback/:id', (req, res) => {
    const feedback = interactionModel.getFeedbackById(req.params.id);
    if (feedback) {
        res.status(200).json(feedback);
    } else {
        res.status(404).json({ error: 'Feedback not found' });
    }
});

router.post('/feedback', (req, res) => {
    const newFeedback = interactionModel.createFeedback(req.body);
    res.status(201).json(newFeedback);
});

router.put('/feedback/:id', (req, res) => {
    const updatedFeedback = interactionModel.updateFeedback(req.params.id, req.body);
    if (updatedFeedback) {
        res.status(200).json(updatedFeedback);
    } else {
        res.status(404).json({ error: 'Feedback not found' });
    }
});

router.delete('/feedback/:id', (req, res) => {
    const deletedFeedback = interactionModel.deleteFeedback(req.params.id);
    if (deletedFeedback) {
        res.status(200).json(deletedFeedback);
    } else {
        res.status(404).json({ error: 'Feedback not found' });
    }
});

// 统计相关路由
router.get('/statistics/interaction', (req, res) => {
    const statistics = interactionModel.getInteractionStatistics();
    res.status(200).json(statistics);
});

router.get('/statistics/content', (req, res) => {
    const statistics = contentModel.getContentStatistics();
    res.status(200).json(statistics);
});

module.exports = router;