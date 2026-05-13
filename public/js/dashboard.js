const topicsData = {
    javascript: [
        { word: "CLOSURE", clue: "A function paired with its lexical environment." },
        { word: "PROMISE", clue: "Represents the eventual completion of an async operation." },
        { word: "HOISTING", clue: "Moving declarations to the top of the current scope." },
        { word: "PROTOTYPE", clue: "The mechanism by which JS objects inherit features." },
        { word: "ARRAY", clue: "A list-like object in JavaScript." },
        { word: "OBJECT", clue: "A collection of properties." },
        { word: "BOOLEAN", clue: "A data type with only two values." },
        { word: "FUNCTION", clue: "A reusable block of code." },
        { word: "VARIABLE", clue: "A container for storing data values." },
        { word: "ASYNC", clue: "A keyword that makes a function return a promise." }
    ],
    nodejs: [
        { word: "EXPRESS", clue: "Fast, unopinionated, minimalist web framework." },
        { word: "MODULE", clue: "A reusable block of code." },
        { word: "EVENT", clue: "An action or occurrence recognized by software." },
        { word: "STREAM", clue: "A sequence of data elements." },
        { word: "BUFFER", clue: "A temporary memory area in Node.js." },
        { word: "NPM", clue: "Node Package Manager." },
        { word: "REQUIRE", clue: "Function used to import modules." },
        { word: "SERVER", clue: "A computer program that provides a service." },
        { word: "CALLBACK", clue: "A function passed as an argument." },
        { word: "PROCESS", clue: "Global object providing info about the Node.js process." }
    ],
    mongodb: [
        { word: "DOCUMENT", clue: "A record in a MongoDB collection." },
        { word: "COLLECTION", clue: "A grouping of MongoDB documents." },
        { word: "DATABASE", clue: "A container for collections." },
        { word: "SCHEMA", clue: "The structure of a database." },
        { word: "INDEX", clue: "A data structure that improves retrieval speed." },
        { word: "QUERY", clue: "A request for data from a database." },
        { word: "AGGREGATE", clue: "Operations that process data records." },
        { word: "REPLICA", clue: "A copy of data across multiple servers." },
        { word: "SHARDING", clue: "Storing data records across multiple machines." },
        { word: "MONGOOSE", clue: "An ODM library for MongoDB and Node.js." }
    ]
};

function getAllWords() {
    return [...topicsData.javascript, ...topicsData.nodejs, ...topicsData.mongodb];
}

let timerInterval;

function openGame(gameId) {
    if (gameId === 'wordSearch' && userData.gameAccess && userData.gameAccess.wordSearch === false) {
        alert("You do not have access to Word Search. Please contact the administrator.");
        return;
    }
    if (gameId === 'crossword' && userData.gameAccess && userData.gameAccess.crossword === false) {
        alert("You do not have access to Crossword. Please contact the administrator.");
        return;
    }

    document.getElementById('dashboardHome').style.display = 'none';
    if(gameId === 'wordSearch') {
        document.getElementById('wordSearchArea').style.display = 'block';
        initWordSearch();
        startTimer('wordSearchArea');
    } else if (gameId === 'crossword') {
        document.getElementById('crosswordArea').style.display = 'block';
        initCrossword();
        startTimer('crosswordArea');
    }
}

function closeGame() {
    document.getElementById('wordSearchArea').style.display = 'none';
    document.getElementById('crosswordArea').style.display = 'none';
    document.getElementById('dashboardHome').style.display = 'block';
    if (timerInterval) clearInterval(timerInterval);
}

function startTimer(areaId) {
    if (timerInterval) clearInterval(timerInterval);
    let timeLeft = 180; // 3 minutes
    const timerDisplay = document.querySelector(`#${areaId} .timer`);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "0:00";
            // Timer end logic can go here
        }
    }, 1000);
}

// ---------------- WORD SEARCH LOGIC ---------------- //
let wsSize = 12;
let wsGrid = [];
let wsSelectedWords = [];
let wsFoundWords = 0;
let isSelecting = false;
let startCell = null;
let currentSelection = [];

function initWordSearch() {
    const allWords = getAllWords().sort(() => 0.5 - Math.random());
    wsSelectedWords = allWords.slice(0, 6).map(w => ({...w, found: false}));
    wsFoundWords = 0;
    
    // Dynamically calculate grid size based on the longest word
    const longestWordLen = Math.max(...wsSelectedWords.map(w => w.word.length));
    wsSize = Math.max(longestWordLen + 1, 8); // Compact layout but enough room to place intersecting words
    
    // Create empty grid
    wsGrid = Array(wsSize).fill(null).map(() => Array(wsSize).fill(''));
    
    // Place words
    wsSelectedWords.forEach(wordObj => {
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 100) {
            attempts++;
            const dir = Math.floor(Math.random() * 4); // 0: right, 1: down, 2: diag-down-right, 3: right-backwards
            const word = dir === 3 ? wordObj.word.split('').reverse().join('') : wordObj.word;
            const actualDir = dir === 3 ? 0 : dir; // use right direction for placement calculation
            
            let dx = actualDir === 0 || actualDir === 2 ? 1 : 0;
            let dy = actualDir === 1 || actualDir === 2 ? 1 : 0;
            
            let x = Math.floor(Math.random() * wsSize);
            let y = Math.floor(Math.random() * wsSize);
            
            if (x + dx * word.length <= wsSize && y + dy * word.length <= wsSize) {
                let canPlace = true;
                for (let i = 0; i < word.length; i++) {
                    if (wsGrid[y + i * dy][x + i * dx] !== '' && wsGrid[y + i * dy][x + i * dx] !== word[i]) {
                        canPlace = false;
                        break;
                    }
                }
                if (canPlace) {
                    for (let i = 0; i < word.length; i++) {
                        wsGrid[y + i * dy][x + i * dx] = word[i];
                    }
                    wordObj.cells = [];
                    for (let i = 0; i < word.length; i++) {
                        wordObj.cells.push({x: x + i * dx, y: y + i * dy});
                    }
                    placed = true;
                }
            }
        }
    });
    
    // Fill rest with random letters
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let y = 0; y < wsSize; y++) {
        for (let x = 0; x < wsSize; x++) {
            if (wsGrid[y][x] === '') {
                wsGrid[y][x] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }
    
    renderWordSearch();
}

function renderWordSearch() {
    const gridEl = document.getElementById('wsGrid');
    gridEl.style.gridTemplateColumns = `repeat(${wsSize}, 40px)`;
    gridEl.innerHTML = '';
    
    for (let y = 0; y < wsSize; y++) {
        for (let x = 0; x < wsSize; x++) {
            const cell = document.createElement('div');
            cell.className = 'ws-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.textContent = wsGrid[y][x];
            
            cell.addEventListener('mousedown', startSelection);
            cell.addEventListener('mouseenter', enterSelection);
            cell.addEventListener('mouseup', endSelection);
            
            gridEl.appendChild(cell);
        }
    }
    document.addEventListener('mouseup', forceEndSelection); // to catch mouseup outside grid
    
    const listEl = document.getElementById('wsWordList');
    listEl.innerHTML = '';
    wsSelectedWords.forEach(w => {
        const li = document.createElement('li');
        li.textContent = w.word;
        li.id = `ws-word-${w.word}`;
        listEl.appendChild(li);
    });
}

function getCellEl(x, y) {
    return document.querySelector(`.ws-cell[data-x="${x}"][data-y="${y}"]`);
}

function startSelection(e) {
    isSelecting = true;
    startCell = { x: parseInt(e.target.dataset.x), y: parseInt(e.target.dataset.y) };
    currentSelection = [startCell];
    updateSelectionUI();
    e.preventDefault();
}

function enterSelection(e) {
    if (!isSelecting) return;
    const endCell = { x: parseInt(e.target.dataset.x), y: parseInt(e.target.dataset.y) };
    
    // check if valid line (horizontal, vertical, diagonal)
    const dx = endCell.x - startCell.x;
    const dy = endCell.y - startCell.y;
    
    currentSelection = [];
    if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        const stepX = dx === 0 ? 0 : dx / steps;
        const stepY = dy === 0 ? 0 : dy / steps;
        
        for (let i = 0; i <= steps; i++) {
            currentSelection.push({
                x: startCell.x + i * stepX,
                y: startCell.y + i * stepY
            });
        }
    }
    updateSelectionUI();
}

function updateSelectionUI() {
    document.querySelectorAll('.ws-cell.selected').forEach(c => c.classList.remove('selected'));
    currentSelection.forEach(pos => {
        const el = getCellEl(pos.x, pos.y);
        if (el) el.classList.add('selected');
    });
}

function endSelection() {
    if (!isSelecting) return;
    isSelecting = false;
    
    // Check if selection matches any word
    const selectedWord = currentSelection.map(pos => wsGrid[pos.y][pos.x]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');
    
    let matched = wsSelectedWords.find(w => !w.found && (w.word === selectedWord || w.word === reversedWord));
    
    if (matched) {
        matched.found = true;
        wsFoundWords++;
        currentSelection.forEach(pos => {
            const el = getCellEl(pos.x, pos.y);
            if (el) {
                el.classList.add('found');
                el.classList.remove('selected');
            }
        });
        document.getElementById(`ws-word-${matched.word}`).classList.add('found-word');
        
        if (wsFoundWords === wsSelectedWords.length) {
            setTimeout(() => alert('Congratulations! You found all the words!'), 300);
        }
    } else {
        document.querySelectorAll('.ws-cell.selected').forEach(c => c.classList.remove('selected'));
    }
    currentSelection = [];
}

function forceEndSelection() {
    if (isSelecting) {
        endSelection();
    }
}

// ---------------- CROSSWORD LOGIC ---------------- //
const cwSize = 15;
let cwGridData = [];
let cwWords = [];

function initCrossword() {
    const allWords = getAllWords().sort(() => 0.5 - Math.random());
    // Select 6 words
    const selected = allWords.slice(0, 6);
    
    // We will do a simple placement algorithm. 
    // Sort by length descending
    selected.sort((a, b) => b.word.length - a.word.length);
    
    cwGridData = Array(cwSize).fill(null).map(() => Array(cwSize).fill(null));
    cwWords = [];
    
    // Directions: 0 = across, 1 = down
    let acrossCount = 0;
    let downCount = 0;
    
    selected.forEach((wordObj, index) => {
        let placed = false;
        
        // Determine target direction
        let targetDir;
        if (acrossCount < 3 && downCount < 3) {
            targetDir = index % 2; // Alternate
        } else if (acrossCount < 3) {
            targetDir = 0;
        } else {
            targetDir = 1;
        }
        
        // Try to intersect with existing words
        for (let i = 0; i < cwWords.length && !placed; i++) {
            const existing = cwWords[i];
            if (existing.dir !== targetDir) { // Can only intersect perpendicular
                for (let j = 0; j < wordObj.word.length && !placed; j++) {
                    const char = wordObj.word[j];
                    const matchIdx = existing.word.indexOf(char);
                    if (matchIdx !== -1) {
                        // Calculate potential start position
                        let startX, startY;
                        if (targetDir === 0) { // Across
                            startX = existing.x - j;
                            startY = existing.y + matchIdx;
                        } else { // Down
                            startX = existing.x + matchIdx;
                            startY = existing.y - j;
                        }
                        
                        if (canPlaceWord(wordObj.word, startX, startY, targetDir)) {
                            placeWord(wordObj.word, wordObj.clue, startX, startY, targetDir);
                            if (targetDir === 0) acrossCount++; else downCount++;
                            placed = true;
                        }
                    }
                }
            }
        }
        
        // If cannot intersect, try random placement
        let attempts = 0;
        while (!placed && attempts < 200) {
            attempts++;
            let startX = Math.floor(Math.random() * cwSize);
            let startY = Math.floor(Math.random() * cwSize);
            if (canPlaceWord(wordObj.word, startX, startY, targetDir)) {
                placeWord(wordObj.word, wordObj.clue, startX, startY, targetDir);
                if (targetDir === 0) acrossCount++; else downCount++;
                placed = true;
            }
        }
    });
    
    renderCrossword();
}

function canPlaceWord(word, x, y, dir) {
    if (dir === 0) { // Across
        if (x < 0 || x + word.length > cwSize || y < 0 || y >= cwSize) return false;
        for (let i = 0; i < word.length; i++) {
            const cx = x + i;
            const cy = y;
            // Cell already has a different letter
            if (cwGridData[cy][cx] !== null && cwGridData[cy][cx].char !== word[i]) return false;
            
            // Check adjacent cells to avoid parallel touching words
            if (cwGridData[cy][cx] === null) {
                if (cy > 0 && cwGridData[cy-1][cx] !== null) return false;
                if (cy < cwSize - 1 && cwGridData[cy+1][cx] !== null) return false;
            }
        }
        // Check ends
        if (x > 0 && cwGridData[y][x-1] !== null) return false;
        if (x + word.length < cwSize && cwGridData[y][x+word.length] !== null) return false;
    } else { // Down
        if (x < 0 || x >= cwSize || y < 0 || y + word.length > cwSize) return false;
        for (let i = 0; i < word.length; i++) {
            const cx = x;
            const cy = y + i;
            if (cwGridData[cy][cx] !== null && cwGridData[cy][cx].char !== word[i]) return false;
            
            if (cwGridData[cy][cx] === null) {
                if (cx > 0 && cwGridData[cy][cx-1] !== null) return false;
                if (cx < cwSize - 1 && cwGridData[cy][cx+1] !== null) return false;
            }
        }
        if (y > 0 && cwGridData[y-1][x] !== null) return false;
        if (y + word.length < cwSize && cwGridData[y+word.length][x] !== null) return false;
    }
    return true;
}

function placeWord(word, clue, x, y, dir) {
    const number = cwWords.length + 1;
    const wordObj = { id: number, word, clue, x, y, dir, length: word.length, solved: false };
    cwWords.push(wordObj);
    
    for (let i = 0; i < word.length; i++) {
        const cx = dir === 0 ? x + i : x;
        const cy = dir === 0 ? y : y + i;
        if (cwGridData[cy][cx] === null) {
            cwGridData[cy][cx] = { char: word[i], number: i === 0 ? number : null, words: [number] };
        } else {
            cwGridData[cy][cx].words.push(number);
            if (i === 0) cwGridData[cy][cx].number = number;
        }
    }
}

function renderCrossword() {
    const gridEl = document.getElementById('cwGrid');
    gridEl.style.gridTemplateColumns = `repeat(${cwSize}, 40px)`;
    gridEl.innerHTML = '';
    
    for (let y = 0; y < cwSize; y++) {
        for (let x = 0; x < cwSize; x++) {
            const cellData = cwGridData[y][x];
            const cell = document.createElement('div');
            cell.className = 'cw-cell ' + (cellData ? '' : 'empty');
            
            if (cellData) {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.dataset.x = x;
                input.dataset.y = y;
                // Store words this cell belongs to
                input.dataset.words = cellData.words.join(',');
                
                input.addEventListener('input', handleCwInput);
                input.addEventListener('keydown', handleCwKeydown);
                input.addEventListener('focus', handleCwFocus);
                
                if (cellData.number) {
                    const num = document.createElement('span');
                    num.className = 'cw-number';
                    num.textContent = cellData.number;
                    cell.appendChild(num);
                }
                cell.appendChild(input);
            }
            gridEl.appendChild(cell);
        }
    }
    
    // Render Clues
    const acrossList = document.getElementById('cwAcrossClues');
    const downList = document.getElementById('cwDownClues');
    acrossList.innerHTML = '';
    downList.innerHTML = '';
    
    cwWords.forEach(w => {
        const li = document.createElement('li');
        li.textContent = `${w.id}. ${w.clue}`;
        li.id = `clue-${w.id}`;
        li.onclick = () => focusWord(w.id);
        
        if (w.dir === 0) acrossList.appendChild(li);
        else downList.appendChild(li);
    });
}

let activeWordId = null;

function focusWord(id) {
    activeWordId = id;
    const word = cwWords.find(w => w.id === id);
    if (!word) return;
    
    // Focus first input of this word
    const firstInput = document.querySelector(`input[data-x="${word.x}"][data-y="${word.y}"]`);
    if (firstInput) firstInput.focus();
}

function handleCwFocus(e) {
    const words = e.target.dataset.words.split(',').map(Number);
    if (!activeWordId || !words.includes(activeWordId)) {
        activeWordId = words[0]; // default to first word it belongs to
    }
    
    // Highlight active clue
    document.querySelectorAll('.cw-clues li').forEach(li => li.classList.remove('active-clue'));
    const activeClue = document.getElementById(`clue-${activeWordId}`);
    if (activeClue) activeClue.classList.add('active-clue');
}

function handleCwInput(e) {
    const input = e.target;
    input.value = input.value.toUpperCase();
    
    if (input.value.length === 1) {
        checkCrossword();
        moveToNext(input);
    }
}

function handleCwKeydown(e) {
    if (e.key === 'Backspace' && e.target.value === '') {
        moveToPrev(e.target);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        handleArrowNavigation(e);
    }
}

function getWordCells(wordId) {
    const word = cwWords.find(w => w.id === wordId);
    let cells = [];
    for (let i = 0; i < word.length; i++) {
        let x = word.dir === 0 ? word.x + i : word.x;
        let y = word.dir === 0 ? word.y : word.y + i;
        cells.push(document.querySelector(`input[data-x="${x}"][data-y="${y}"]`));
    }
    return cells;
}

function moveToNext(currentInput) {
    if (!activeWordId) return;
    const cells = getWordCells(activeWordId);
    const idx = cells.indexOf(currentInput);
    if (idx !== -1 && idx < cells.length - 1) {
        cells[idx + 1].focus();
    }
}

function moveToPrev(currentInput) {
    if (!activeWordId) return;
    const cells = getWordCells(activeWordId);
    const idx = cells.indexOf(currentInput);
    if (idx > 0) {
        cells[idx - 1].focus();
    }
}

function handleArrowNavigation(e) {
    const x = parseInt(e.target.dataset.x);
    const y = parseInt(e.target.dataset.y);
    let nextX = x, nextY = y;
    
    if (e.key === 'ArrowUp') nextY--;
    else if (e.key === 'ArrowDown') nextY++;
    else if (e.key === 'ArrowLeft') nextX--;
    else if (e.key === 'ArrowRight') nextX++;
    
    const nextInput = document.querySelector(`input[data-x="${nextX}"][data-y="${nextY}"]`);
    if (nextInput) {
        e.preventDefault();
        // Determine new active word based on direction
        const words = nextInput.dataset.words.split(',').map(Number);
        
        // If moving horizontally, prefer across word (dir === 0)
        // If moving vertically, prefer down word (dir === 1)
        const isHorizontal = e.key === 'ArrowLeft' || e.key === 'ArrowRight';
        const prefDir = isHorizontal ? 0 : 1;
        
        let newActiveId = words[0];
        words.forEach(wId => {
            const w = cwWords.find(cw => cw.id === wId);
            if (w && w.dir === prefDir) newActiveId = wId;
        });
        
        activeWordId = newActiveId;
        nextInput.focus();
    }
}

function checkCrossword() {
    let allSolved = true;
    cwWords.forEach(w => {
        let cells = getWordCells(w.id);
        let currentWord = cells.map(c => c ? c.value : '').join('');
        
        if (currentWord === w.word) {
            w.solved = true;
            document.getElementById(`clue-${w.id}`).classList.add('solved-clue');
            cells.forEach(c => {
                c.style.backgroundColor = 'rgba(168, 218, 236, 0.3)'; // soft cyan success
                c.style.borderColor = 'rgba(168, 218, 236, 0.5)';
            });
        } else {
            w.solved = false;
            document.getElementById(`clue-${w.id}`).classList.remove('solved-clue');
            // Check if cell belongs to another solved word before resetting color
            cells.forEach(c => {
                const cWords = c.dataset.words.split(',').map(Number);
                const isPartiallySolved = cWords.some(id => {
                    const ow = cwWords.find(cw => cw.id === id);
                    return ow && ow.solved;
                });
                if (!isPartiallySolved) {
                    c.style.backgroundColor = 'transparent';
                }
            });
        }
        
        if (!w.solved) allSolved = false;
    });
    
    if (allSolved) {
        setTimeout(() => alert('Congratulations! You solved the crossword!'), 300);
    }
}
