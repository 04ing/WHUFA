// Interaction模型 - 处理互动相关数据
const fs = require('fs');
const path = require('path');

const COMMENTS_FILE = path.join(__dirname, '../data/comments.json');
const DISCUSSIONS_FILE = path.join(__dirname, '../data/discussions.json');
const POLLS_FILE = path.join(__dirname, '../data/polls.json');
const FEEDBACK_FILE = path.join(__dirname, '../data/feedback.json');

class Interaction {
    constructor() {
        this.comments = [];
        this.discussions = [];
        this.polls = [];
        this.feedback = [];
        this.loadData();
    }

    // 加载所有数据
    loadData() {
        this.loadComments();
        this.loadDiscussions();
        this.loadPolls();
        this.loadFeedback();
    }

    // 加载评论数据
    loadComments() {
        try {
            const data = fs.readFileSync(COMMENTS_FILE, 'utf8');
            this.comments = JSON.parse(data);
        } catch (error) {
            console.error('Error loading comments:', error);
            this.comments = [];
        }
    }

    // 加载讨论数据
    loadDiscussions() {
        try {
            const data = fs.readFileSync(DISCUSSIONS_FILE, 'utf8');
            this.discussions = JSON.parse(data);
        } catch (error) {
            console.error('Error loading discussions:', error);
            this.discussions = [];
        }
    }

    // 加载投票数据
    loadPolls() {
        try {
            const data = fs.readFileSync(POLLS_FILE, 'utf8');
            this.polls = JSON.parse(data);
        } catch (error) {
            console.error('Error loading polls:', error);
            this.polls = [];
        }
    }

    // 加载反馈数据
    loadFeedback() {
        try {
            const data = fs.readFileSync(FEEDBACK_FILE, 'utf8');
            this.feedback = JSON.parse(data);
        } catch (error) {
            console.error('Error loading feedback:', error);
            this.feedback = [];
        }
    }

    // 保存评论数据
    saveComments() {
        try {
            fs.writeFileSync(COMMENTS_FILE, JSON.stringify(this.comments, null, 2), 'utf8');
        } catch (error) {
            console.error('Error saving comments:', error);
        }
    }

    // 保存讨论数据
    saveDiscussions() {
        try {
            fs.writeFileSync(DISCUSSIONS_FILE, JSON.stringify(this.discussions, null, 2), 'utf8');
        } catch (error) {
            console.error('Error saving discussions:', error);
        }
    }

    // 保存投票数据
    savePolls() {
        try {
            fs.writeFileSync(POLLS_FILE, JSON.stringify(this.polls, null, 2), 'utf8');
        } catch (error) {
            console.error('Error saving polls:', error);
        }
    }

    // 保存反馈数据
    saveFeedback() {
        try {
            fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(this.feedback, null, 2), 'utf8');
        } catch (error) {
            console.error('Error saving feedback:', error);
        }
    }

    // 评论相关方法
    getAllComments() {
        return this.comments;
    }

    getCommentsByTarget(targetType, targetId) {
        return this.comments.filter(comment => comment.targetType === targetType && comment.targetId === targetId);
    }

    createComment(commentData) {
        const newComment = {
            id: Date.now().toString(),
            targetType: commentData.targetType, // news, announcement, match, etc.
            targetId: commentData.targetId,
            userId: commentData.userId,
            userName: commentData.userName,
            content: commentData.content,
            parentId: commentData.parentId || null, // for replies
            likes: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.comments.push(newComment);
        this.saveComments();
        return newComment;
    }

    updateComment(id, commentData) {
        const index = this.comments.findIndex(comment => comment.id === id);
        if (index !== -1) {
            this.comments[index] = { ...this.comments[index], ...commentData, updatedAt: new Date().toISOString() };
            this.saveComments();
            return this.comments[index];
        }
        return null;
    }

    deleteComment(id) {
        const index = this.comments.findIndex(comment => comment.id === id);
        if (index !== -1) {
            const deletedComment = this.comments.splice(index, 1);
            // Also delete replies to this comment
            const replyIndices = [];
            this.comments.forEach((comment, i) => {
                if (comment.parentId === id) {
                    replyIndices.push(i);
                }
            });
            // Delete replies in reverse order to avoid index shifting
            replyIndices.reverse().forEach(i => this.comments.splice(i, 1));
            this.saveComments();
            return deletedComment[0];
        }
        return null;
    }

    likeComment(id) {
        const index = this.comments.findIndex(comment => comment.id === id);
        if (index !== -1) {
            this.comments[index].likes++;
            this.saveComments();
            return this.comments[index];
        }
        return null;
    }

    // 讨论相关方法
    getAllDiscussions() {
        return this.discussions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    getDiscussionById(id) {
        return this.discussions.find(discussion => discussion.id === id);
    }

    createDiscussion(discussionData) {
        const newDiscussion = {
            id: Date.now().toString(),
            title: discussionData.title,
            content: discussionData.content,
            userId: discussionData.userId,
            userName: discussionData.userName,
            category: discussionData.category,
            tags: discussionData.tags || [],
            views: 0,
            replies: 0,
            likes: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.discussions.push(newDiscussion);
        this.saveDiscussions();
        return newDiscussion;
    }

    updateDiscussion(id, discussionData) {
        const index = this.discussions.findIndex(discussion => discussion.id === id);
        if (index !== -1) {
            this.discussions[index] = { ...this.discussions[index], ...discussionData, updatedAt: new Date().toISOString() };
            this.saveDiscussions();
            return this.discussions[index];
        }
        return null;
    }

    deleteDiscussion(id) {
        const index = this.discussions.findIndex(discussion => discussion.id === id);
        if (index !== -1) {
            const deletedDiscussion = this.discussions.splice(index, 1);
            this.saveDiscussions();
            return deletedDiscussion[0];
        }
        return null;
    }

    incrementDiscussionViews(id) {
        const index = this.discussions.findIndex(discussion => discussion.id === id);
        if (index !== -1) {
            this.discussions[index].views++;
            this.saveDiscussions();
            return this.discussions[index];
        }
        return null;
    }

    incrementDiscussionReplies(id) {
        const index = this.discussions.findIndex(discussion => discussion.id === id);
        if (index !== -1) {
            this.discussions[index].replies++;
            this.saveDiscussions();
            return this.discussions[index];
        }
        return null;
    }

    likeDiscussion(id) {
        const index = this.discussions.findIndex(discussion => discussion.id === id);
        if (index !== -1) {
            this.discussions[index].likes++;
            this.saveDiscussions();
            return this.discussions[index];
        }
        return null;
    }

    // 投票相关方法
    getAllPolls() {
        return this.polls;
    }

    getPollById(id) {
        return this.polls.find(poll => poll.id === id);
    }

    createPoll(pollData) {
        const newPoll = {
            id: Date.now().toString(),
            title: pollData.title,
            description: pollData.description,
            options: pollData.options.map(option => ({
                id: Date.now().toString() + Math.random(),
                text: option.text,
                votes: 0
            })),
            userId: pollData.userId,
            userName: pollData.userName,
            startDate: pollData.startDate || new Date().toISOString(),
            endDate: pollData.endDate,
            status: pollData.status || 'active', // active, ended
            totalVotes: 0,
            voters: [], // userIds who have voted
            createdAt: new Date().toISOString()
        };
        
        this.polls.push(newPoll);
        this.savePolls();
        return newPoll;
    }

    updatePoll(id, pollData) {
        const index = this.polls.findIndex(poll => poll.id === id);
        if (index !== -1) {
            this.polls[index] = { ...this.polls[index], ...pollData };
            this.savePolls();
            return this.polls[index];
        }
        return null;
    }

    deletePoll(id) {
        const index = this.polls.findIndex(poll => poll.id === id);
        if (index !== -1) {
            const deletedPoll = this.polls.splice(index, 1);
            this.savePolls();
            return deletedPoll[0];
        }
        return null;
    }

    votePoll(pollId, optionId, userId) {
        const index = this.polls.findIndex(poll => poll.id === pollId);
        if (index !== -1) {
            const poll = this.polls[index];
            
            // Check if poll is active
            if (poll.status !== 'active') {
                return { error: 'Poll is not active' };
            }
            
            // Check if user has already voted
            if (poll.voters.includes(userId)) {
                return { error: 'User has already voted' };
            }
            
            // Find and increment the option vote
            const optionIndex = poll.options.findIndex(option => option.id === optionId);
            if (optionIndex !== -1) {
                poll.options[optionIndex].votes++;
                poll.totalVotes++;
                poll.voters.push(userId);
                
                // Check if poll has ended
                if (poll.endDate && new Date() > new Date(poll.endDate)) {
                    poll.status = 'ended';
                }
                
                this.savePolls();
                return poll;
            }
            return { error: 'Option not found' };
        }
        return { error: 'Poll not found' };
    }

    // 反馈相关方法
    getAllFeedback() {
        return this.feedback;
    }

    getFeedbackById(id) {
        return this.feedback.find(feedback => feedback.id === id);
    }

    createFeedback(feedbackData) {
        const newFeedback = {
            id: Date.now().toString(),
            userId: feedbackData.userId || null,
            userName: feedbackData.userName || '匿名',
            type: feedbackData.type, // bug, suggestion, question, complaint, contact
            subject: feedbackData.subject,
            content: feedbackData.content,
            email: feedbackData.email,
            phone: feedbackData.phone,
            status: feedbackData.status || 'pending', // pending, processing, resolved
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.feedback.push(newFeedback);
        this.saveFeedback();
        return newFeedback;
    }

    updateFeedback(id, feedbackData) {
        const index = this.feedback.findIndex(feedback => feedback.id === id);
        if (index !== -1) {
            this.feedback[index] = { ...this.feedback[index], ...feedbackData, updatedAt: new Date().toISOString() };
            this.saveFeedback();
            return this.feedback[index];
        }
        return null;
    }

    deleteFeedback(id) {
        const index = this.feedback.findIndex(feedback => feedback.id === id);
        if (index !== -1) {
            const deletedFeedback = this.feedback.splice(index, 1);
            this.saveFeedback();
            return deletedFeedback[0];
        }
        return null;
    }

    // 统计方法
    getInteractionStatistics() {
        const statistics = {
            comments: this.comments.length,
            discussions: this.discussions.length,
            polls: this.polls.length,
            feedback: this.feedback.length,
            activePolls: this.polls.filter(poll => poll.status === 'active').length,
            resolvedFeedback: this.feedback.filter(feedback => feedback.status === 'resolved').length
        };
        return statistics;
    }
}

module.exports = Interaction;