
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
        const [results, metadata] = await sequelize.query('SELECT * FROM groups');
        res.status(200).json(results);
    }catch(error){
        console.error('Error fetching news posts:', error);
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