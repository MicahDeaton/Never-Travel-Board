const express = require('express');
const Board = require('./models/Boards');
const UserBoard = require('./models/UsersToBoards');
// const port = process.env.PORT || 3001;

const app = express();

const boardsAndUserBoardsRouter = express.Router();

// Boards API routes
boardsAndUserBoardsRouter.get('/boards', async (req, res) => {
    try {
        const boards = await Board.find();
        res.json({ boards });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving boards');
    }
});

boardsAndUserBoardsRouter.post('/boards', async (req, res) => {
    const { name, description } = req.body;
    try{
        const board = new Board({ name, description });
    await board.save();
    res.json({ board });
    } catch (error) {
    console.error(error);
        res.status(500).send('Error creating board');
    }
});

boardsAndUserBoardsRouter,get('/boards/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const board = await Board.findById(id);
        if (!board) {
            res.status(404).send('Board not found');
        }
        res.json({ board });
    } catch (error) {
        console.error(error);
        res.status(500).send('error retrieving board');
    }
});

boardsAndUserBoardsRouter.put('/boards/id', async (req,res) => {
    const id = req.params.id;
    const { name, description } = req.body;
    try {
        const board = await Board.findById(id);
        if (!board) {
            res.status(404).send('Board not found');
        }
        board.name = name;
        board.description = description;
        await board.save();
        res.json({board});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating board');
    }
});

boardsAndUserBoardsRouter.delete('/boards/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await Board.findByIdAndDelete(id);
        res.status(200).send('Board deleted')
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting board');
    }
});

// UserBoards API Routes
boardsAndUserBoardsRouter.get('/user-boards/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const userBoards = await UserBoards.find({ userId });
        res.json({ userBoards });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving user boards');
    }
});
app.use('/api/boards-and-user-boards', boardsAndUserBoardsRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});