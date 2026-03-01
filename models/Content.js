// Content模型 - 处理内容相关数据
const fs = require('fs');
const path = require('path');

const NEWS_FILE = path.join(__dirname, '../data/news.json');
const ANNOUNCEMENTS_FILE = path.join(__dirname, '../data/announcements.json');
const GALLERY_FILE = path.join(__dirname, '../data/gallery.json');
const RULES_FILE = path.join(__dirname, '../data/rules.json');

class Content {
    constructor() {
        this.news = [];
        this.announcements = [];
        this.gallery = [];
        this.rules = [];
        this.loadData();
    }

    // 加载所有数据
    loadData() {
        this.loadNews();
        this.loadAnnouncements();
        this.loadGallery();
        this.loadRules();
    }

    // 加载新闻数据
    loadNews() {
        try {
            const data = fs.readFileSync(NEWS_FILE, 'utf8');
            this.news = JSON.parse(data);
        } catch (error) {
            console.error('Error loading news:', error);
            this.news = [];
        }
    }

    // 加载公告数据
    loadAnnouncements() {
        try {
            const data = fs.readFileSync(ANNOUNCEMENTS_FILE, 'utf8');
            this.announcements = JSON.parse(data);
        } catch (error) {
            console.error('Error loading announcements:', error);
            this.announcements = [];
        }
    }

    // 加载画廊数据
    loadGallery() {
        try {
            const data = fs.readFileSync(GALLERY_FILE, 'utf8');
            this.gallery = JSON.parse(data);
        } catch (error) {
            console.error('Error loading gallery:', error);
            this.gallery = [];
        }
    }

    // 加载规则数据
    loadRules() {
        try {
            const data = fs.readFileSync(RULES_FILE, 'utf8');
            this.rules = JSON.parse(data);
        } catch (error) {
            console.error('Error loading rules:', error);
            this.rules = [];
        }
    }

    // 保存新闻数据
    saveNews() {
        try {
            fs.writeFileSync(NEWS_FILE, JSON.stringify(this.news, null, 2), 'utf8');
        } catch (error) {
            console.error('Error saving news:', error);
        }
    }

    // 保存公告数据
    saveAnnouncements() {
        try {
            fs.writeFileSync(ANNOUNCEMENTS_FILE, JSON.stringify(this.announcements, null, 2), 'utf8');
        } catch (error) {
            console.error('Error saving announcements:', error);
        }
    }

    // 保存画廊数据
    saveGallery() {
        try {
            fs.writeFileSync(GALLERY_FILE, JSON.stringify(this.gallery, null, 2), 'utf8');
        } catch (error) {
            console.error('Error saving gallery:', error);
        }
    }

    // 保存规则数据
    saveRules() {
        try {
            fs.writeFileSync(RULES_FILE, JSON.stringify(this.rules, null, 2), 'utf8');
        } catch (error) {
            console.error('Error saving rules:', error);
        }
    }

    // 新闻相关方法
    getAllNews() {
        return this.news.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    getNewsById(id) {
        return this.news.find(news => news.id === id);
    }

    createNews(newsData) {
        const newNews = {
            id: Date.now().toString(),
            title: newsData.title,
            content: newsData.content,
            author: newsData.author,
            category: newsData.category,
            image: newsData.image,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.news.push(newNews);
        this.saveNews();
        return newNews;
    }

    updateNews(id, newsData) {
        const index = this.news.findIndex(news => news.id === id);
        if (index !== -1) {
            this.news[index] = { ...this.news[index], ...newsData, updatedAt: new Date().toISOString() };
            this.saveNews();
            return this.news[index];
        }
        return null;
    }

    deleteNews(id) {
        const index = this.news.findIndex(news => news.id === id);
        if (index !== -1) {
            const deletedNews = this.news.splice(index, 1);
            this.saveNews();
            return deletedNews[0];
        }
        return null;
    }

    // 公告相关方法
    getAllAnnouncements() {
        return this.announcements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    getAnnouncementById(id) {
        return this.announcements.find(announcement => announcement.id === id);
    }

    createAnnouncement(announcementData) {
        const newAnnouncement = {
            id: Date.now().toString(),
            title: announcementData.title,
            content: announcementData.content,
            author: announcementData.author,
            priority: announcementData.priority || 'normal', // high, normal, low
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.announcements.push(newAnnouncement);
        this.saveAnnouncements();
        return newAnnouncement;
    }

    updateAnnouncement(id, announcementData) {
        const index = this.announcements.findIndex(announcement => announcement.id === id);
        if (index !== -1) {
            this.announcements[index] = { ...this.announcements[index], ...announcementData, updatedAt: new Date().toISOString() };
            this.saveAnnouncements();
            return this.announcements[index];
        }
        return null;
    }

    deleteAnnouncement(id) {
        const index = this.announcements.findIndex(announcement => announcement.id === id);
        if (index !== -1) {
            const deletedAnnouncement = this.announcements.splice(index, 1);
            this.saveAnnouncements();
            return deletedAnnouncement[0];
        }
        return null;
    }

    // 画廊相关方法
    getAllGalleryItems() {
        return this.gallery;
    }

    getGalleryItemById(id) {
        return this.gallery.find(item => item.id === id);
    }

    createGalleryItem(itemData) {
        const newItem = {
            id: Date.now().toString(),
            title: itemData.title,
            type: itemData.type, // photo, video
            url: itemData.url,
            description: itemData.description,
            category: itemData.category,
            createdAt: new Date().toISOString()
        };
        
        this.gallery.push(newItem);
        this.saveGallery();
        return newItem;
    }

    updateGalleryItem(id, itemData) {
        const index = this.gallery.findIndex(item => item.id === id);
        if (index !== -1) {
            this.gallery[index] = { ...this.gallery[index], ...itemData };
            this.saveGallery();
            return this.gallery[index];
        }
        return null;
    }

    deleteGalleryItem(id) {
        const index = this.gallery.findIndex(item => item.id === id);
        if (index !== -1) {
            const deletedItem = this.gallery.splice(index, 1);
            this.saveGallery();
            return deletedItem[0];
        }
        return null;
    }

    // 规则相关方法
    getAllRules() {
        return this.rules;
    }

    getRuleById(id) {
        return this.rules.find(rule => rule.id === id);
    }

    createRule(ruleData) {
        const newRule = {
            id: Date.now().toString(),
            title: ruleData.title,
            content: ruleData.content,
            type: ruleData.type, // competition, referee, player
            version: ruleData.version,
            effectiveDate: ruleData.effectiveDate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.rules.push(newRule);
        this.saveRules();
        return newRule;
    }

    updateRule(id, ruleData) {
        const index = this.rules.findIndex(rule => rule.id === id);
        if (index !== -1) {
            this.rules[index] = { ...this.rules[index], ...ruleData, updatedAt: new Date().toISOString() };
            this.saveRules();
            return this.rules[index];
        }
        return null;
    }

    deleteRule(id) {
        const index = this.rules.findIndex(rule => rule.id === id);
        if (index !== -1) {
            const deletedRule = this.rules.splice(index, 1);
            this.saveRules();
            return deletedRule[0];
        }
        return null;
    }

    // 搜索方法
    searchContent(keyword) {
        const results = {
            news: this.news.filter(item => 
                item.title.toLowerCase().includes(keyword.toLowerCase()) || 
                item.content.toLowerCase().includes(keyword.toLowerCase())
            ),
            announcements: this.announcements.filter(item => 
                item.title.toLowerCase().includes(keyword.toLowerCase()) || 
                item.content.toLowerCase().includes(keyword.toLowerCase())
            ),
            gallery: this.gallery.filter(item => 
                item.title.toLowerCase().includes(keyword.toLowerCase()) || 
                item.description.toLowerCase().includes(keyword.toLowerCase())
            ),
            rules: this.rules.filter(item => 
                item.title.toLowerCase().includes(keyword.toLowerCase()) || 
                item.content.toLowerCase().includes(keyword.toLowerCase())
            )
        };
        return results;
    }

    // 分类统计
    getContentStatistics() {
        const statistics = {
            news: {
                total: this.news.length,
                categories: {}
            },
            announcements: {
                total: this.announcements.length,
                priorities: {}
            },
            gallery: {
                total: this.gallery.length,
                types: {}
            },
            rules: {
                total: this.rules.length,
                types: {}
            }
        };

        // 统计新闻分类
        this.news.forEach(item => {
            if (!statistics.news.categories[item.category]) {
                statistics.news.categories[item.category] = 0;
            }
            statistics.news.categories[item.category]++;
        });

        // 统计公告优先级
        this.announcements.forEach(item => {
            if (!statistics.announcements.priorities[item.priority]) {
                statistics.announcements.priorities[item.priority] = 0;
            }
            statistics.announcements.priorities[item.priority]++;
        });

        // 统计画廊类型
        this.gallery.forEach(item => {
            if (!statistics.gallery.types[item.type]) {
                statistics.gallery.types[item.type] = 0;
            }
            statistics.gallery.types[item.type]++;
        });

        // 统计规则类型
        this.rules.forEach(item => {
            if (!statistics.rules.types[item.type]) {
                statistics.rules.types[item.type] = 0;
            }
            statistics.rules.types[item.type]++;
        });

        return statistics;
    }
}