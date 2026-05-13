(function () {
    const els = {
        topicSelect: document.querySelector('#topicSelect'),
        gameTypeSelect: document.querySelector('#gameTypeSelect'),
        startGameBtn: document.querySelector('#startGameBtn'),
        alternateGameBtn: document.querySelector('#alternateGameBtn'),
        submitGameBtn: document.querySelector('#submitGameBtn'),
        refreshScoreboardBtn: document.querySelector('#refreshScoreboardBtn'),
        timerDisplay: document.querySelector('#timerDisplay'),
        gameBoard: document.querySelector('#gameBoard'),
        clueList: document.querySelector('#clueList'),
        gameTitle: document.querySelector('#gameTitle'),
        gameSource: document.querySelector('#gameSource'),
        notice: document.querySelector('#notice'),
        scoreboardBody: document.querySelector('#scoreboardBody'),
        scoreboardTopicFilter: document.querySelector('#scoreboardTopicFilter'),
        scoreboardGameFilter: document.querySelector('#scoreboardGameFilter'),
        prevPageBtn: document.querySelector('#prevPageBtn'),
        nextPageBtn: document.querySelector('#nextPageBtn'),
        pageIndicator: document.querySelector('#pageIndicator'),
        currentRank: document.querySelector('#currentRank'),
        latestScore: document.querySelector('#latestScore'),
        averageScore: document.querySelector('#averageScore'),
        fastestTime: document.querySelector('#fastestTime'),
        sidebarTotalPoints: document.querySelector('#sidebarTotalPoints'),
        sidebarCompletedGames: document.querySelector('#sidebarCompletedGames'),
        sidebarBestScore: document.querySelector('#sidebarBestScore')
    };

    const labels = {
        javascript: 'JavaScript',
        nodejs: 'Node.js',
        mongodb: 'MongoDB',
        'general-tech': 'General Tech',
        crossword: 'Crossword',
        'word-search': 'Word Search'
    };

    const state = {
        sessionId: null,
        source: 'backend',
        topic: 'javascript',
        gameType: 'crossword',
        questions: [],
        startedAt: null,
        timerHandle: null,
        crosswordCells: new Map(),
        wordSearchFound: new Map(),
        selectedCells: [],
        selectedText: '',
        scoreboardPage: 1
    };

    const cleanAnswer = (value) => String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const randomLetter = () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
    const escapeHtml = (value) => String(value || '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));

    const formatDuration = (ms) => {
        if (ms === null || ms === undefined) return '--';
        const totalSeconds = Math.max(0, Math.floor(ms / 1000));
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const showNotice = (message, isError) => {
        els.notice.textContent = message;
        els.notice.hidden = false;
        els.notice.style.background = isError ? '#fee2e2' : '#fef3c7';
        els.notice.style.borderColor = isError ? '#f87171' : '#facc15';
        els.notice.style.color = isError ? '#7f1d1d' : '#713f12';
    };

    const hideNotice = () => {
        els.notice.hidden = true;
        els.notice.textContent = '';
    };

    const requestJson = async (url, options = {}) => {
        const response = await fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    };

    const startTimer = () => {
        clearInterval(state.timerHandle);
        state.startedAt = Date.now();
        els.timerDisplay.textContent = '00:00';
        state.timerHandle = setInterval(() => {
            els.timerDisplay.textContent = formatDuration(Date.now() - state.startedAt);
        }, 500);
    };

    const stopTimer = () => {
        clearInterval(state.timerHandle);
        state.timerHandle = null;
    };

    const fallbackSession = (topic, gameType) => {
        const questions = shuffle(window.FALLBACK_QUESTION_BANK.filter((question) => (
            question.topic === topic && question.gameType === gameType
        ))).slice(0, 6);

        return {
            sessionId: `fallback-${Date.now()}`,
            topic,
            gameType,
            startedAt: new Date().toISOString(),
            questions
        };
    };

    const startGame = async () => {
        hideNotice();
        els.startGameBtn.disabled = true;
        els.submitGameBtn.disabled = true;

        const topic = els.topicSelect.value;
        const gameType = els.gameTypeSelect.value;

        try {
            const data = await requestJson('/api/game/start', {
                method: 'POST',
                body: JSON.stringify({ topic, gameType })
            });
            loadSession(data.session, 'backend');
        } catch (error) {
            loadSession(fallbackSession(topic, gameType), 'fallback');
            showNotice('Backend questions are unavailable right now, so this round is running from the browser fallback bank. Scores from fallback rounds are shown locally but are not persisted.', false);
        } finally {
            els.startGameBtn.disabled = false;
        }
    };

    const loadSession = (session, source) => {
        state.sessionId = session.sessionId;
        state.topic = session.topic;
        state.gameType = session.gameType;
        state.questions = session.questions;
        state.source = source;
        state.crosswordCells = new Map();
        state.wordSearchFound = new Map();
        state.selectedCells = [];
        state.selectedText = '';

        els.submitGameBtn.disabled = false;
        els.gameTitle.textContent = `${labels[session.topic]} ${labels[session.gameType]} - 6 questions`;
        els.gameSource.textContent = source === 'backend' ? 'Backend question engine' : 'Frontend fallback question bank';

        startTimer();
        if (session.gameType === 'crossword') {
            renderCrossword(session.questions);
        } else {
            renderWordSearch(session.questions);
        }
    };

    const renderClues = (questions, extraNode) => {
        els.clueList.innerHTML = '';
        if (extraNode) els.clueList.appendChild(extraNode);

        questions.forEach((question, index) => {
            const item = document.createElement('article');
            item.className = 'clue-item';
            item.dataset.questionId = question.id;
            item.innerHTML = `
                <strong>${index + 1}. ${cleanAnswer(question.answer).length} letters</strong>
                <p>${escapeHtml(question.question)}</p>
            `;
            els.clueList.appendChild(item);
        });
    };

    const canPlace = (grid, word, row, col, direction) => {
        const size = grid.length;
        const endRow = row + direction.row * (word.length - 1);
        const endCol = col + direction.col * (word.length - 1);

        if (endRow < 0 || endCol < 0 || endRow >= size || endCol >= size) return false;

        for (let index = 0; index < word.length; index += 1) {
            const currentRow = row + direction.row * index;
            const currentCol = col + direction.col * index;
            const current = grid[currentRow][currentCol];

            if (current && current !== word[index]) return false;
        }

        return true;
    };

    const placeWord = (grid, word) => {
        const directions = [{ row: 0, col: 1 }, { row: 1, col: 0 }];
        const size = grid.length;
        const candidates = [];

        for (let row = 0; row < size; row += 1) {
            for (let col = 0; col < size; col += 1) {
                directions.forEach((direction) => {
                    if (canPlace(grid, word, row, col, direction)) {
                        let score = 0;
                        for (let index = 0; index < word.length; index += 1) {
                            const currentRow = row + direction.row * index;
                            const currentCol = col + direction.col * index;
                            if (grid[currentRow][currentCol] === word[index]) score += 1;
                        }
                        candidates.push({ row, col, direction, score });
                    }
                });
            }
        }

        if (candidates.length === 0) return null;

        candidates.sort((a, b) => b.score - a.score || Math.random() - 0.5);
        const placement = candidates[0];

        for (let index = 0; index < word.length; index += 1) {
            const row = placement.row + placement.direction.row * index;
            const col = placement.col + placement.direction.col * index;
            grid[row][col] = word[index];
        }

        return placement;
    };

    const renderCrossword = (questions) => {
        const size = 15;
        const grid = Array.from({ length: size }, () => Array(size).fill(''));
        const placements = new Map();
        const sortedQuestions = [...questions].sort((a, b) => b.answer.length - a.answer.length);

        sortedQuestions.forEach((question, index) => {
            const word = cleanAnswer(question.answer);
            let placement;

            if (index === 0) {
                placement = {
                    row: Math.floor(size / 2),
                    col: Math.max(0, Math.floor((size - word.length) / 2)),
                    direction: { row: 0, col: 1 }
                };
                if (canPlace(grid, word, placement.row, placement.col, placement.direction)) {
                    for (let letterIndex = 0; letterIndex < word.length; letterIndex += 1) {
                        grid[placement.row][placement.col + letterIndex] = word[letterIndex];
                    }
                } else {
                    placement = placeWord(grid, word);
                }
            } else {
                placement = placeWord(grid, word);
            }

            if (placement) placements.set(question.id, { ...placement, word });
        });

        state.crosswordCells = placements;
        els.gameBoard.innerHTML = '';
        els.gameBoard.style.gridTemplateColumns = `repeat(${size}, 34px)`;

        for (let row = 0; row < size; row += 1) {
            for (let col = 0; col < size; col += 1) {
                const cell = document.createElement('div');
                const letter = grid[row][col];
                cell.className = `cell ${letter ? '' : 'blocked'}`;

                if (letter) {
                    const input = document.createElement('input');
                    input.maxLength = 1;
                    input.dataset.row = row;
                    input.dataset.col = col;
                    input.setAttribute('aria-label', `Crossword cell ${row + 1}, ${col + 1}`);
                    input.addEventListener('input', handleCrosswordInput);
                    cell.appendChild(input);
                }

                els.gameBoard.appendChild(cell);
            }
        }

        renderClues(questions);
    };

    const handleCrosswordInput = (event) => {
        event.target.value = cleanAnswer(event.target.value).slice(0, 1);
        const inputs = [...els.gameBoard.querySelectorAll('input')];
        const currentIndex = inputs.indexOf(event.target);

        if (event.target.value && inputs[currentIndex + 1]) {
            inputs[currentIndex + 1].focus();
        }

        checkCrosswordProgress();
    };

    const getCrosswordAnswer = (question) => {
        const placement = state.crosswordCells.get(question.id);
        if (!placement) return '';

        let answer = '';
        for (let index = 0; index < placement.word.length; index += 1) {
            const row = placement.row + placement.direction.row * index;
            const col = placement.col + placement.direction.col * index;
            const input = els.gameBoard.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
            answer += input ? input.value : '';
        }

        return cleanAnswer(answer);
    };

    const checkCrosswordProgress = () => {
        state.questions.forEach((question) => {
            const done = getCrosswordAnswer(question) === cleanAnswer(question.answer);
            const clue = els.clueList.querySelector(`[data-question-id="${question.id}"]`);
            if (clue) clue.classList.toggle('done', done);

            const placement = state.crosswordCells.get(question.id);
            if (placement) {
                for (let index = 0; index < placement.word.length; index += 1) {
                    const row = placement.row + placement.direction.row * index;
                    const col = placement.col + placement.direction.col * index;
                    const input = els.gameBoard.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
                    input?.parentElement.classList.toggle('correct', done);
                }
            }
        });
    };

    const canPlaceSearchWord = (grid, word, row, col, direction) => {
        const size = grid.length;

        for (let index = 0; index < word.length; index += 1) {
            const currentRow = row + direction.row * index;
            const currentCol = col + direction.col * index;

            if (currentRow < 0 || currentCol < 0 || currentRow >= size || currentCol >= size) return false;
            if (grid[currentRow][currentCol] && grid[currentRow][currentCol] !== word[index]) return false;
        }

        return true;
    };

    const renderWordSearch = (questions) => {
        const size = 14;
        const grid = Array.from({ length: size }, () => Array(size).fill(''));
        const directions = [
            { row: 0, col: 1 },
            { row: 1, col: 0 },
            { row: 1, col: 1 },
            { row: 1, col: -1 }
        ];

        questions.forEach((question) => {
            const word = cleanAnswer(question.answer);
            let placed = false;

            for (let attempt = 0; attempt < 100 && !placed; attempt += 1) {
                const direction = directions[Math.floor(Math.random() * directions.length)];
                const row = Math.floor(Math.random() * size);
                const col = Math.floor(Math.random() * size);

                if (canPlaceSearchWord(grid, word, row, col, direction)) {
                    const cells = [];
                    for (let index = 0; index < word.length; index += 1) {
                        const currentRow = row + direction.row * index;
                        const currentCol = col + direction.col * index;
                        grid[currentRow][currentCol] = word[index];
                        cells.push(`${currentRow}-${currentCol}`);
                    }
                    state.wordSearchFound.set(question.id, { word, cells, found: false });
                    placed = true;
                }
            }
        });

        for (let row = 0; row < size; row += 1) {
            for (let col = 0; col < size; col += 1) {
                if (!grid[row][col]) grid[row][col] = randomLetter();
            }
        }

        els.gameBoard.innerHTML = '';
        els.gameBoard.style.gridTemplateColumns = `repeat(${size}, 34px)`;

        for (let row = 0; row < size; row += 1) {
            for (let col = 0; col < size; col += 1) {
                const cell = document.createElement('button');
                cell.type = 'button';
                cell.className = 'cell';
                cell.textContent = grid[row][col];
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', handleWordSearchClick);
                els.gameBoard.appendChild(cell);
            }
        }

        const resetButton = document.createElement('button');
        resetButton.type = 'button';
        resetButton.className = 'secondary-button';
        resetButton.textContent = 'Clear selection';
        resetButton.addEventListener('click', clearWordSelection);
        renderClues(questions, resetButton);
    };

    const clearWordSelection = () => {
        state.selectedCells.forEach((cell) => cell.classList.remove('selected'));
        state.selectedCells = [];
        state.selectedText = '';
    };

    const handleWordSearchClick = (event) => {
        const cell = event.currentTarget;

        if (cell.classList.contains('found')) return;

        cell.classList.add('selected');
        state.selectedCells.push(cell);
        state.selectedText += cell.textContent;

        const reversed = state.selectedText.split('').reverse().join('');
        const match = [...state.wordSearchFound.entries()].find(([, item]) => (
            !item.found && (item.word === state.selectedText || item.word === reversed)
        ));

        if (match) {
            const [questionId, item] = match;
            item.found = true;
            state.selectedCells.forEach((selectedCell) => {
                selectedCell.classList.remove('selected');
                selectedCell.classList.add('found');
            });
            const clue = els.clueList.querySelector(`[data-question-id="${questionId}"]`);
            if (clue) clue.classList.add('done');
            clearWordSelection();
            return;
        }

        const hasPrefix = [...state.wordSearchFound.values()].some((item) => (
            !item.found && (item.word.startsWith(state.selectedText) || item.word.startsWith(reversed))
        ));

        if (!hasPrefix || state.selectedText.length > 14) {
            clearWordSelection();
        }
    };

    const collectAnswers = () => {
        if (state.gameType === 'crossword') {
            return state.questions.map((question) => ({
                questionId: question.id,
                answer: getCrosswordAnswer(question)
            }));
        }

        return state.questions.map((question) => {
            const found = state.wordSearchFound.get(question.id)?.found;
            return {
                questionId: question.id,
                answer: found ? question.answer : ''
            };
        });
    };

    const submitGame = async () => {
        if (!state.sessionId) return;

        els.submitGameBtn.disabled = true;
        stopTimer();

        const answers = collectAnswers();
        const localCorrect = answers.filter((answer) => {
            const question = state.questions.find((item) => item.id === answer.questionId);
            return cleanAnswer(answer.answer) === cleanAnswer(question?.answer);
        }).length;

        if (state.source === 'fallback') {
            const score = localCorrect * 100;
            showNotice(`Fallback round complete: ${score} points in ${formatDuration(Date.now() - state.startedAt)}. Backend persistence was unavailable, so this score was not saved globally.`, false);
            toggleNextMode();
            return;
        }

        try {
            const data = await requestJson('/api/game/submit', {
                method: 'POST',
                body: JSON.stringify({
                    sessionId: state.sessionId,
                    answers
                })
            });

            showNotice(`Game submitted: ${data.result.score} points, ${data.result.correctAnswers}/${data.result.totalQuestions} correct.`, false);
            toggleNextMode();
            await Promise.all([loadScoreboard(), loadStats()]);
        } catch (error) {
            showNotice(error.message || 'Could not submit this score.', true);
            els.submitGameBtn.disabled = false;
            startTimer();
        }
    };

    const toggleNextMode = () => {
        els.gameTypeSelect.value = els.gameTypeSelect.value === 'crossword' ? 'word-search' : 'crossword';
    };

    const loadScoreboard = async () => {
        try {
            const topic = els.scoreboardTopicFilter.value;
            const gameType = els.scoreboardGameFilter.value;
            let url = `/api/scoreboard?limit=20&page=${state.scoreboardPage}`;
            if (topic) url += `&topic=${topic}`;
            if (gameType) url += `&gameType=${gameType}`;

            const data = await requestJson(url);
            const entries = data.scoreboard.entries;

            els.pageIndicator.textContent = `Page ${state.scoreboardPage}`;
            els.prevPageBtn.disabled = state.scoreboardPage <= 1;
            els.nextPageBtn.disabled = entries.length < 20;

            if (entries.length === 0) {
                els.scoreboardBody.innerHTML = '<tr><td colspan="6">No completed games yet.</td></tr>';
                return;
            }

            els.scoreboardBody.innerHTML = entries.map((entry) => {
                const username = escapeHtml(entry.username);
                const profileImage = escapeHtml(entry.profileImage);

                return `
                <tr>
                    <td>#${entry.rank}</td>
                    <td>
                        <div class="player-cell">
                            <span class="mini-avatar">
                                ${profileImage ? `<img src="${profileImage}" alt="">` : username.slice(0, 1).toUpperCase()}
                            </span>
                            <strong>${username}</strong>
                        </div>
                    </td>
                    <td>${entry.score}</td>
                    <td>${formatDuration(entry.completionTimeMs)}</td>
                    <td>${labels[entry.topic] || entry.topic}</td>
                    <td>${labels[entry.gameType] || entry.gameType}</td>
                </tr>
            `;
            }).join('');
        } catch (error) {
            els.scoreboardBody.innerHTML = '<tr><td colspan="6">Scoreboard is temporarily unavailable.</td></tr>';
        }
    };

    const loadStats = async () => {
        try {
            const data = await requestJson('/api/me/stats');
            const stats = data.stats;

            els.currentRank.textContent = stats.currentRank ? `#${stats.currentRank}` : '--';
            els.latestScore.textContent = stats.latestScore;
            els.averageScore.textContent = stats.averageScore;
            els.fastestTime.textContent = formatDuration(stats.fastestCompletionTimeMs);
            els.sidebarTotalPoints.textContent = stats.totalPoints;
            els.sidebarCompletedGames.textContent = stats.completedGames;
            els.sidebarBestScore.textContent = stats.bestScore;
        } catch (error) {
            els.currentRank.textContent = '--';
        }
    };

    els.startGameBtn.addEventListener('click', startGame);
    els.alternateGameBtn.addEventListener('click', () => {
        toggleNextMode();
        startGame();
    });
    els.submitGameBtn.addEventListener('click', submitGame);
    els.refreshScoreboardBtn.addEventListener('click', () => {
        state.scoreboardPage = 1;
        loadScoreboard();
    });
    els.scoreboardTopicFilter.addEventListener('change', () => {
        state.scoreboardPage = 1;
        loadScoreboard();
    });
    els.scoreboardGameFilter.addEventListener('change', () => {
        state.scoreboardPage = 1;
        loadScoreboard();
    });
    els.prevPageBtn.addEventListener('click', () => {
        if (state.scoreboardPage > 1) {
            state.scoreboardPage -= 1;
            loadScoreboard();
        }
    });
    els.nextPageBtn.addEventListener('click', () => {
        state.scoreboardPage += 1;
        loadScoreboard();
    });

    loadScoreboard();
    loadStats();
    els.fastestTime.textContent = formatDuration(window.CURRENT_USER.fastestCompletionTimeMs);
}());
