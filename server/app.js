
const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const sequelize = require('./config/db');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 5000;
const userSockets = new Map();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const sessionMiddleware = session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict'
    }
});

app.use(sessionMiddleware);

sequelize.sync().then(() => {
    console.log('Synchronizacja z bazą danych zakończona');
});

app.use('/auth', authRoutes);

app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.get('/api/posts', async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query('SELECT * FROM posts');
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/user-groups/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const results = await sequelize.query(
            'SELECT title FROM user_groups WHERE user_id = :id',
            {
                replacements: { id: id },
                type: sequelize.QueryTypes.SELECT
            }
        );

        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/friends/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const results = await sequelize.query(
            'SELECT friend_user FROM friends WHERE username = :username',
            {
                replacements: { username },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




app.get('/api/news', async(req, res) => {
    try {
        const [results, metadata] = await sequelize.query('SELECT * FROM news');
        res.status(200).json(results);
    }catch(error){
        console.error('Error fetching news posts:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/api/community', async(req, res) => {
    try {
        const [results, metadata] = await sequelize.query('SELECT * FROM groups'
            );
        res.status(200).json(results);
    }catch(error){
        console.error('Error fetching news posts:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/api/comments/:id', async(req, res)=>{
    try{
        const { id } = req.params;
        const results = await sequelize.query(
            'SELECT * FROM comments WHERE news_id = :id',
            {
                replacements: { id: id },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.status(200).json(results);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/api/comments-groups/:id', async(req, res)=>{
    try{
        const { id } = req.params;
        const results = await sequelize.query(
            'SELECT * FROM comments_groups WHERE group_id = :id',
            {
                replacements: { id: id },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.status(200).json(results);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/api/comments-main-posts/:id', async(req, res)=>{
    try{
        const { id } = req.params;
        const results = await sequelize.query(
            'SELECT * FROM comments_main_posts WHERE post_id = :id',
            {
                replacements: { id: id },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.status(200).json(results);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.post('/api/comments', async (req, res)=>{

    const {username, news_id, comment_text, created_at} = req.body;
    if(!username || !news_id || !comment_text || !created_at){
        return res.status(400).json({ error: '400 error' });
    }
    try{
        const comment = await sequelize.query(
          'INSERT INTO comments(username, news_id, comment_text, created_at) VALUES (:username, :news_id, :comment_text, NOW())',
            {
                replacements: {username, news_id, comment_text},
                type: sequelize.QueryTypes.INSERT
            }
        );
        res.status(201).json({ id: comment[0], username, news_id, comment_text});
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }

});

app.post('/api/comments-groups', async(req, res)=>{

    const{username, group_id, comment_text, created_at} = req.body;
    if(!username || !group_id || !comment_text || !created_at){
        return res.status(400).json({ error: '400 error' });
    }

    try{
        const comment = await sequelize.query(
            'INSERT INTO comments_groups(username, group_id, comment_text, created_at) VALUES (:username, :group_id, :comment_text, NOW())',
            {
                replacements: {username, group_id, comment_text},
                type: sequelize.QueryTypes.INSERT
            }
        );
        res.status(201).json({ id: comment[0], username, group_id, comment_text});

    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }

});

app.post('/api/comments-main-posts', async(req, res)=>{

    const{username, post_id, comment_text, created_at} = req.body;
    if(!username || !post_id || !comment_text || !created_at){
        return res.status(400).json({ error: '400 error' });
    }

    try{
        const comment = await sequelize.query(
            'INSERT INTO comments_main_posts(username, post_id, comment_text, created_at) VALUES (:username, :post_id, :comment_text, NOW())',
            {
                replacements: {username, post_id, comment_text},
                type: sequelize.QueryTypes.INSERT
            }
        );
        res.status(201).json({ id: comment[0], username, post_id, comment_text});

    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }

});

app.post('/api/comments-forum-posts', async(req, res)=>{

    const{username, forum_post_id, comment_text, created_at} = req.body;
    if(!username || !forum_post_id || !comment_text || !created_at){
        return res.status(400).json({ error: '400 error' });
    }

    try{
        const comment = await sequelize.query(
            'INSERT INTO comment_forum_posts(username, forum_post_id, comment_text, created_at) VALUES (:username, :forum_post_id, :comment_text, NOW())',
            {
                replacements: {username, forum_post_id, comment_text},
                type: sequelize.QueryTypes.INSERT
            }
        );
        res.status(201).json({ id: comment[0], username, forum_post_id, comment_text});

    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }

});

app.get('/api/comments-forum-posts/:id', async(req, res)=>{
    try{
        const { id } = req.params;
        const results = await sequelize.query(
            'SELECT * FROM comment_forum_posts WHERE forum_post_id = :id',
            {
                replacements: { id: id },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.status(200).json(results);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
});


app.get('/api/events', async(req, res)=> {
    try{
        const [results, metadata] = await sequelize.query('SELECT * FROM events');
        res.status(200).json(results);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
});

/*

app.post('/api/favourite_events', async(req, res)=>{

    const{username, event_id} = req.body;
    if(!username || !event_id){
        return res.status(400).json({error: '400 error'});
    }
    try{
        const favouriteEvent = await sequelize.query(

            'INSERT INTO favourite_events (username, event_id) VALUES (:username, :event_id)',
            {
                replacements: {username,  event_id},
                type: sequelize.QueryTypes.INSERT
            }
        );
        res.status(201).json({ id: favouriteEvent[0], username, event_id });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

 */

app.post('/api/favourite_events', async (req, res) => {
    const { username, event_id } = req.body;
    if (!username || !event_id) {
        return res.status(400).json({ error: '400 error' });
    }
    try {

        const [existingEvent] = await sequelize.query(
            'SELECT * FROM favourite_events WHERE username = :username AND event_id = :event_id',
            {
                replacements: { username, event_id },
                type: sequelize.QueryTypes.SELECT
            }
        );

        if (existingEvent) {
            return res.status(200).json({ message: 'Event already marked as favourite' });
        }


        const favouriteEvent = await sequelize.query(
            'INSERT INTO favourite_events (username, event_id) VALUES (:username, :event_id)',
            {
                replacements: { username, event_id },
                type: sequelize.QueryTypes.INSERT
            }
        );

        res.status(201).json({ id: favouriteEvent[0], username, event_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/favourite_events/:username', async(req, res)=>{
    try{
        const { username } = req.params;
        const results = await sequelize.query(
            'SELECT events.* \n' +
            '             FROM favourite_events \n' +
            '             JOIN events ON favourite_events.event_id = events.event_id \n' +
            '             WHERE favourite_events.username = :username',
            {
                replacements: { username: username },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.status(200).json(results);

    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.post('/api/events', async(req, res)=>{
   const{description, image_path, username} = req.body;

   if(!description || !image_path || !username){
       return res.status(400).json({ error: 'Description, image_path, and username are required' });
   }
   try{
       const eventPost = await sequelize.query(
           'INSERT INTO events (description, created_at, updated_at, image_path, username) VALUES (:description, NOW(), NOW(), :image_path, :username)',
           {
               replacements: {description, image_path, username},
               type: sequelize.QueryTypes.INSERT
           }
       );
       res.status(201).json({ id: eventPost[0], description, image_path, username });
   }catch(error){
       console.log(error);
       res.status(500).json({ error: 'Internal server error' });
   }
});

app.post('/api/user-info', async(req, res)=>{

    const{username, location, interests, observations, constellations} = req.body;

    if(!username || !location || !interests || !observations)
    {
        return res.status(400).json({error: 'All elements are required.'});
    }
    try{
        const userInfo = await sequelize.query(
            'INSERT INTO user_info (username, location, interests, observations, constellations) VALUES (:username, :location, :interests, :observations, :constellations)',
            {
                replacements: {username, location, interests, observations, constellations},
                type: sequelize.QueryTypes.INSERT
            }
        );

    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/api/user-info/:username', async(req, res)=>{

    const {username} = req.params;
    try{
        const [results, metadata] = await sequelize.query('SELECT * FROM user_info WHERE username = :username', {
            replacements: { username: username },
        });
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(results);
    }catch(error){
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }

});

app.post('/api/forum-posts', async(req, res)=>{
    const{title, description, username} = req.body;

    if(!description || !title || !username){
        return res.status(400).json({ error: 'Description, title, and username are required' });
    }
    try{
        const forumPost = await sequelize.query(
            'INSERT INTO forum_posts (title, description, username, created_at, updated_at) VALUES (:title, :description, :username, NOW(),NOW())',
            {
                replacements: {title, description, username},
                type: sequelize.QueryTypes.INSERT
            }
        );
        res.status(201).json({ id: forumPost[0], title, description, username });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/forum-posts', async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query('SELECT * FROM forum_posts');
        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/forum-posts/:forum_post_id/like', async (req, res) => {
    const { forum_post_id } = req.params;

    console.log(`Attempting to like post with ID: ${forum_post_id}`);

    try {
        const [results] = await sequelize.query(
            'UPDATE forum_posts SET likes = likes + 1 WHERE forum_post_id = :forum_post_id',
            {
                replacements: { forum_post_id },
            }
        );
        console.log('Query results:', results);

        if (results[0] > 0) {
            res.status(200).json({ message: 'Likes increased successfully.' });
        } else {
            res.status(404).json({ error: 'Post not found.' });
        }
    } catch (error) {
        console.error('Error updating likes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/community', async(req, res)=>{
    const{description, image_path, username} = req.body;

    if(!description || !image_path || !username){
        return res.status(400).json({ error: 'Description, image_path, and username are required' });
    }
    try{
        const eventPost = await sequelize.query(
            'INSERT INTO groups (description, created_at, updated_at, image_path, username) VALUES (:description, NOW(), NOW(), :image_path, :username)',
            {
                replacements: {description, image_path, username},
                type: sequelize.QueryTypes.INSERT
            }
        );
        res.status(201).json({ id: eventPost[0], description, image_path, username });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/comment-posts', async (req, res) => {
    const { forum_post_id, content, username } = req.body;
    if (!forum_post_id || !content || !username) {
        return res.status(400).json({ error: 'forum_post_id, content, and username are required' });
    }
    try {
        const commentPost = await sequelize.query(
            'INSERT INTO comment_posts (forum_post_id, content, created_at, username) VALUES (:forum_post_id, :content, NOW(), :username)',
            {
                replacements: { forum_post_id, content, username },
                type: sequelize.QueryTypes.INSERT,
            }
        );
        res.status(201).json({
            comment_id: commentPost[0],
            forum_post_id,
            content,
            created_at: new Date(),
            username,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/comment-posts', async(req, res) => {
    try {
        const [results, metadata] = await sequelize.query('SELECT * FROM comment_posts');
        res.status(200).json(results);
    }catch(error){
        console.error('Error fetching news posts:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});






app.delete('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sequelize.query(
            'DELETE FROM events WHERE event_id = :id',
            {
                replacements: { id },
                type: sequelize.QueryTypes.DELETE
            }
        );
        if (result[1] === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json({ message: `Event with ID ${id} deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/community/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sequelize.query(
            'DELETE FROM groups WHERE group_id = :id',
            {
                replacements: { id },
                type: sequelize.QueryTypes.DELETE
            }
        );
        if (result[1] === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json({ message: `Event with ID ${id} deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.put('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    const { description, image_path} = req.body;

    if (!description || !image_path) {
        return res.status(400).json({ error: 'Description, image_path are required' });
    }

    try {

        const [updatedRows] = await sequelize.query(
            `UPDATE events 
             SET description = :description, 
                 image_path = :image_path,
                 updated_at = NOW() 
             WHERE event_id = :id`,
            {
                replacements: { id, description, image_path},
                type: sequelize.QueryTypes.UPDATE
            }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json({ message: 'Event updated successfully', id, description, image_path, username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { description, image_path} = req.body;

    if (!description || !image_path) {
        return res.status(400).json({ error: 'Description, image_path are required' });
    }

    try {

        const [updatedRows] = await sequelize.query(
            `UPDATE posts 
             SET description = :description, 
                 image_path = :image_path,
                 updated_at = NOW() 
             WHERE post_id = :id`,
            {
                replacements: { id, description, image_path},
                type: sequelize.QueryTypes.UPDATE
            }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json({ message: 'Event updated successfully', id, description, image_path, username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/community/:id', async (req, res) => {
    const { id } = req.params;
    const { description, image_path} = req.body;

    if (!description || !image_path) {
        return res.status(400).json({ error: 'Description, image_path are required' });
    }

    try {

        const [updatedRows] = await sequelize.query(
            `UPDATE groups 
             SET description = :description, 
                 image_path = :image_path,
                 updated_at = NOW() 
             WHERE group_id = :id`,
            {
                replacements: { id, description, image_path},
                type: sequelize.QueryTypes.UPDATE
            }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.status(200).json({ message: 'Group post updated successfully', id, description, image_path, username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sequelize.query(
            'DELETE FROM posts WHERE post_id = :id',
            {
                replacements: { id },
                type: sequelize.QueryTypes.DELETE
            }
        );
        if (result[1] === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json({ message: `Post with ID ${id} deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/posts', async (req, res) => {
    const { description, image_path, username } = req.body;

    if (!description || !image_path || !username) {
        return res.status(400).json({ error: 'Description, image_path, and username are required' });
    }

    try {
        const newPost = await sequelize.query(
            'INSERT INTO posts (description, created_at, updated_at, image_path, username) VALUES (:description, NOW(), NOW(), :image_path, :username)',
            {
                replacements: { description, image_path, username },
                type: sequelize.QueryTypes.INSERT
            }
        );

        res.status(201).json({ id: newPost[0], description, image_path, username });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/personal_info', async(req, res) => {
    const {location, interests, observations, favourite_constellations, username} = req.body;

    try {
        const newInfo = await sequelize.query(
            'INSERT INTO personal_data(location, interests, observations, favourite_constellations, username) VALUES (:location, :interests, :observations, :favourite_constellations, :username)',
            {
                replacements: {location, interests, observations, favourite_constellations, username},
                type: sequelize.QueryTypes.INSERT
            }
        );
        res.status(201).json({ personal_id: newInfo[0], location, interests, observations, favourite_constellations, username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.use(express.static(path.join(__dirname, 'client/build')));


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const server = http.createServer(app);


const wss = new WebSocket.Server({ server });

const wrap = middleware => (ws, req, next) => middleware(req, {}, next);

wss.on('connection', (ws, req) => {
    wrap(sessionMiddleware)(ws, req, () => {
        if (req.session && req.session.user) {
            const username = req.session.user.username;
            console.log(`WebSocket: użytkownik ${username} połączony`);

            userSockets.set(username, ws);

            ws.on('message', (message) => {
                console.log(` ${username}: ${message}`);

                const targetUsername = extractTargetUsername(message);
                if (!targetUsername) {
                    ws.send('Błąd: nie podano odbiorcy.');
                    return;
                }

                const targetSocket = userSockets.get(targetUsername);
                if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
                    const parsedMessage = JSON.parse(message);
                    targetSocket.send(`${username}: ${parsedMessage.message}`);
                } else {
                    ws.send(`Użytkownik ${targetUsername} nie jest dostępny.`);
                }
            });

            ws.on('close', () => {
                console.log(`WebSocket: użytkownik ${username} rozłączony`);
                userSockets.delete(username);
            });
        } else {
            ws.close();
        }
    });
});


function extractTargetUsername(message) {
    try {
        const parsedMessage = JSON.parse(message);
        return parsedMessage.targetUsername;
    } catch (e) {
        console.error('Błąd parsowania wiadomości:', e);
        return null;
    }
}


server.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});