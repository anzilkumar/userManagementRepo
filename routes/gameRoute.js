import express from 'express';
import { getQuestions, startGame, submitGame, getScoreboard } from '../controllers/gameController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const gameRoute = express.Router();

gameRoute.use(requireAuth);

gameRoute.get('/questions', getQuestions);
gameRoute.post('/start', startGame);
gameRoute.post('/score', submitGame);
gameRoute.get('/scoreboard', getScoreboard);

export default gameRoute;
