const TOPIC_TERMS = {
    javascript: [
        {
            answer: 'CLOSURE',
            clue: 'Function concept where an inner function keeps access to variables from its outer scope.',
            hints: ['Often appears in interview questions about lexical scope.', 'Useful for private state.'],
            tags: ['scope', 'functions']
        },
        {
            answer: 'PROMISE',
            clue: 'Object that represents a future asynchronous success or failure.',
            hints: ['Can be resolved or rejected.', 'Used with async/await.'],
            tags: ['async', 'control-flow']
        },
        {
            answer: 'CALLBACK',
            clue: 'Function passed into another function to run later.',
            hints: ['Common in event handling.', 'Older async APIs use this heavily.'],
            tags: ['functions', 'async']
        },
        {
            answer: 'HOISTING',
            clue: 'JavaScript behavior where declarations are processed before code execution.',
            hints: ['var behaves differently from let and const.', 'Related to execution context.'],
            tags: ['runtime', 'scope']
        },
        {
            answer: 'PROTOTYPE',
            clue: 'Object used by JavaScript to share methods through the inheritance chain.',
            hints: ['Classes use this under the hood.', 'Lookups continue through a chain.'],
            tags: ['objects', 'inheritance']
        },
        {
            answer: 'EVENTLOOP',
            clue: 'Runtime mechanism that coordinates the call stack, queues, and async callbacks.',
            hints: ['Explains why non-blocking code works.', 'Microtasks run before many queued tasks.'],
            tags: ['runtime', 'async']
        },
        {
            answer: 'DESTRUCTURE',
            clue: 'Syntax for unpacking object properties or array values into variables.',
            hints: ['Often paired with default values.', 'Works with objects and arrays.'],
            tags: ['syntax', 'objects']
        },
        {
            answer: 'ARROW',
            clue: 'Short function syntax that does not bind its own this value.',
            hints: ['Useful for callbacks.', 'Uses the => token.'],
            tags: ['functions', 'syntax']
        },
        {
            answer: 'MODULE',
            clue: 'Reusable JavaScript file unit that can export and import values.',
            hints: ['ES modules use import/export.', 'Helps organize larger applications.'],
            tags: ['architecture', 'esm']
        },
        {
            answer: 'STRICT',
            clue: 'Mode that catches silent JavaScript errors and prevents some unsafe behavior.',
            hints: ['Enabled with a directive string.', 'ES modules use it automatically.'],
            tags: ['runtime', 'safety']
        },
        {
            answer: 'SPREAD',
            clue: 'Syntax that expands arrays or object properties into another expression.',
            hints: ['Uses three dots.', 'Common for immutable updates.'],
            tags: ['syntax', 'arrays']
        },
        {
            answer: 'THIS',
            clue: 'Keyword whose value depends on how a function is called.',
            hints: ['Arrow functions handle it differently.', 'Often confusing in interviews.'],
            tags: ['functions', 'objects']
        },
        {
            answer: 'MAP',
            clue: 'Array method that returns a new array by transforming each item.',
            hints: ['Does not mutate the original array.', 'Often compared with forEach.'],
            tags: ['arrays', 'functional']
        },
        {
            answer: 'REDUCE',
            clue: 'Array method that accumulates many values into one result.',
            hints: ['Uses an accumulator.', 'Good for totals and grouping.'],
            tags: ['arrays', 'functional']
        },
        {
            answer: 'JSON',
            clue: 'Text data format commonly parsed and stringified in JavaScript APIs.',
            hints: ['Looks like object literal syntax.', 'Used for HTTP request and response bodies.'],
            tags: ['data', 'api']
        }
    ],
    nodejs: [
        {
            answer: 'EXPRESS',
            clue: 'Minimal Node.js web framework commonly used for routing and middleware.',
            hints: ['Your project uses it.', 'Often paired with EJS or APIs.'],
            tags: ['framework', 'routing']
        },
        {
            answer: 'MIDDLEWARE',
            clue: 'Function layer that runs during the request-response cycle.',
            hints: ['Can validate, authenticate, or log.', 'Receives req, res, and next.'],
            tags: ['express', 'architecture']
        },
        {
            answer: 'ROUTER',
            clue: 'Express object used to group related endpoints.',
            hints: ['Keeps route files modular.', 'Mounted with app.use.'],
            tags: ['express', 'routing']
        },
        {
            answer: 'REQUEST',
            clue: 'Express object that contains URL params, body, query, headers, and cookies.',
            hints: ['Usually named req.', 'Represents incoming client data.'],
            tags: ['express', 'http']
        },
        {
            answer: 'RESPONSE',
            clue: 'Express object used to send HTML, JSON, redirects, or status codes.',
            hints: ['Usually named res.', 'Ends the HTTP response.'],
            tags: ['express', 'http']
        },
        {
            answer: 'NODEMON',
            clue: 'Development tool that restarts a Node process after file changes.',
            hints: ['Often used in npm run dev.', 'Not needed in production.'],
            tags: ['tooling', 'development']
        },
        {
            answer: 'PACKAGE',
            clue: 'Project metadata file that lists scripts and dependencies.',
            hints: ['Stored in package.json.', 'npm reads it.'],
            tags: ['npm', 'tooling']
        },
        {
            answer: 'MODULE',
            clue: 'Reusable JavaScript unit imported by Node.js files.',
            hints: ['Can be CommonJS or ES module.', 'Your project uses type module.'],
            tags: ['architecture', 'esm']
        },
        {
            answer: 'STREAM',
            clue: 'Node abstraction for processing data piece by piece.',
            hints: ['Useful for files and network data.', 'Can reduce memory use.'],
            tags: ['node', 'performance']
        },
        {
            answer: 'BUFFER',
            clue: 'Node object for handling binary data.',
            hints: ['Common with files and sockets.', 'Represents bytes.'],
            tags: ['node', 'data']
        },
        {
            answer: 'ASYNC',
            clue: 'Keyword used to define a function that returns a Promise.',
            hints: ['Used with await.', 'Improves async readability.'],
            tags: ['async', 'javascript']
        },
        {
            answer: 'COOKIE',
            clue: 'Small browser-stored value often used to remember authentication state.',
            hints: ['Can be httpOnly.', 'Sent with matching requests.'],
            tags: ['security', 'auth']
        },
        {
            answer: 'SESSION',
            clue: 'Server-side or signed state used to remember a user across requests.',
            hints: ['Usually expires.', 'Safer than trusting raw client data.'],
            tags: ['auth', 'state']
        },
        {
            answer: 'CORS',
            clue: 'Browser security policy for cross-origin HTTP access.',
            hints: ['APIs configure it when frontend and backend differ.', 'Stands for Cross-Origin Resource Sharing.'],
            tags: ['security', 'http']
        },
        {
            answer: 'JWT',
            clue: 'Compact token format often used for stateless authentication.',
            hints: ['Has header, payload, and signature.', 'Must be verified on the server.'],
            tags: ['auth', 'security']
        }
    ],
    mongodb: [
        {
            answer: 'DOCUMENT',
            clue: 'MongoDB record stored as a BSON-like object.',
            hints: ['Similar to a JSON object.', 'Lives inside a collection.'],
            tags: ['data-model', 'bson']
        },
        {
            answer: 'COLLECTION',
            clue: 'MongoDB grouping of documents, similar to a table in relational databases.',
            hints: ['Queries usually target this.', 'Contains many documents.'],
            tags: ['data-model', 'database']
        },
        {
            answer: 'OBJECTID',
            clue: 'Default MongoDB identifier type used for _id values.',
            hints: ['Includes timestamp information.', 'Usually shown as 24 hex characters.'],
            tags: ['identity', 'schema']
        },
        {
            answer: 'SCHEMA',
            clue: 'Mongoose structure that defines fields, types, validation, and indexes.',
            hints: ['Models are created from it.', 'Helps keep application data consistent.'],
            tags: ['mongoose', 'validation']
        },
        {
            answer: 'MODEL',
            clue: 'Mongoose class used to create, query, update, and delete documents.',
            hints: ['Built from a schema.', 'Represents a collection.'],
            tags: ['mongoose', 'queries']
        },
        {
            answer: 'INDEX',
            clue: 'Database structure that speeds up reads for selected fields.',
            hints: ['Can improve sorting and filtering.', 'Too many can slow writes.'],
            tags: ['performance', 'queries']
        },
        {
            answer: 'AGGREGATE',
            clue: 'MongoDB pipeline feature for grouping, transforming, and calculating data.',
            hints: ['Uses stages like match and group.', 'Good for reports and rankings.'],
            tags: ['queries', 'analytics']
        },
        {
            answer: 'PIPELINE',
            clue: 'Ordered list of aggregation stages that process documents step by step.',
            hints: ['Each stage passes output to the next.', 'Used in aggregate queries.'],
            tags: ['aggregation', 'queries']
        },
        {
            answer: 'POPULATE',
            clue: 'Mongoose helper that replaces referenced ids with actual documents.',
            hints: ['Useful for user references.', 'Similar to a join at application level.'],
            tags: ['mongoose', 'relations']
        },
        {
            answer: 'LEAN',
            clue: 'Mongoose query option that returns plain objects instead of full documents.',
            hints: ['Improves read performance.', 'No document methods are attached.'],
            tags: ['performance', 'mongoose']
        },
        {
            answer: 'VALIDATE',
            clue: 'Process of checking data rules before saving or accepting input.',
            hints: ['Can happen in middleware or schemas.', 'Prevents bad data.'],
            tags: ['validation', 'security']
        },
        {
            answer: 'REPLICA',
            clue: 'MongoDB copy of data used for redundancy and failover.',
            hints: ['Part of a replica set.', 'Helps availability.'],
            tags: ['availability', 'database']
        },
        {
            answer: 'ATLAS',
            clue: 'MongoDB cloud database service.',
            hints: ['Often used for hosted clusters.', 'Managed by MongoDB.'],
            tags: ['cloud', 'deployment']
        },
        {
            answer: 'BSON',
            clue: 'Binary data format MongoDB uses internally for documents.',
            hints: ['Extends JSON-like data with more types.', 'Supports ObjectId and Date.'],
            tags: ['data', 'storage']
        },
        {
            answer: 'QUERY',
            clue: 'Database request used to find, filter, update, or delete documents.',
            hints: ['Can use operators.', 'Should be indexed for large datasets.'],
            tags: ['database', 'queries']
        }
    ],
    'general-tech': [
        {
            answer: 'HTTP',
            clue: 'Protocol used by browsers and servers to exchange web requests and responses.',
            hints: ['Uses methods like GET and POST.', 'Status codes are part of it.'],
            tags: ['web', 'protocols']
        },
        {
            answer: 'HTTPS',
            clue: 'Secure version of HTTP that encrypts traffic with TLS.',
            hints: ['Important for login forms.', 'Browsers show a lock for it.'],
            tags: ['security', 'web']
        },
        {
            answer: 'API',
            clue: 'Contract that lets software systems communicate with each other.',
            hints: ['Can return JSON.', 'Frontend apps call it.'],
            tags: ['architecture', 'web']
        },
        {
            answer: 'DATABASE',
            clue: 'Organized system for storing and querying application data.',
            hints: ['Can be SQL or NoSQL.', 'Persistence lives here.'],
            tags: ['storage', 'backend']
        },
        {
            answer: 'CACHE',
            clue: 'Fast temporary storage used to avoid repeated expensive work.',
            hints: ['Can reduce database load.', 'Must be invalidated carefully.'],
            tags: ['performance', 'architecture']
        },
        {
            answer: 'LATENCY',
            clue: 'Delay between making a request and receiving a response.',
            hints: ['Lower is better for user experience.', 'Network distance affects it.'],
            tags: ['performance', 'networking']
        },
        {
            answer: 'BANDWIDTH',
            clue: 'Amount of data that can move across a network in a period of time.',
            hints: ['Large assets consume it.', 'Different from latency.'],
            tags: ['networking', 'performance']
        },
        {
            answer: 'FIREWALL',
            clue: 'Security system that controls allowed network traffic.',
            hints: ['Can block ports.', 'Used to protect servers.'],
            tags: ['security', 'networking']
        },
        {
            answer: 'ENCRYPTION',
            clue: 'Process of transforming readable data so only authorized parties can read it.',
            hints: ['TLS uses it.', 'Protects sensitive information.'],
            tags: ['security', 'data']
        },
        {
            answer: 'DEPLOYMENT',
            clue: 'Process of releasing an application to an environment where users can access it.',
            hints: ['Often uses CI/CD.', 'Can target cloud servers.'],
            tags: ['devops', 'release']
        },
        {
            answer: 'GIT',
            clue: 'Version control system used to track source code history.',
            hints: ['Uses commits and branches.', 'GitHub hosts repositories built with it.'],
            tags: ['tooling', 'workflow']
        },
        {
            answer: 'BRANCH',
            clue: 'Independent line of Git work used to develop changes without touching main code.',
            hints: ['Merged after review.', 'Useful for features and fixes.'],
            tags: ['git', 'workflow']
        },
        {
            answer: 'TERMINAL',
            clue: 'Text interface used to run development commands.',
            hints: ['npm scripts run here.', 'PowerShell and bash are examples.'],
            tags: ['tooling', 'development']
        },
        {
            answer: 'COMPILER',
            clue: 'Tool that transforms source code into another form before execution.',
            hints: ['TypeScript uses one.', 'Can produce machine code or JavaScript.'],
            tags: ['tooling', 'languages']
        },
        {
            answer: 'DEBUGGER',
            clue: 'Tool used to pause code, inspect variables, and step through execution.',
            hints: ['Breakpoints are common.', 'Helps locate bugs.'],
            tags: ['tooling', 'quality']
        }
    ]
};

const TOPIC_LABELS = {
    javascript: 'JavaScript',
    nodejs: 'Node.js',
    mongodb: 'MongoDB',
    'general-tech': 'General Tech Knowledge'
};

const GAME_LABELS = {
    crossword: 'Crossword',
    'word-search': 'Word Search'
};

const buildQuestion = (topic, gameType, term, index) => ({
    slug: `${topic}-${gameType}-${term.answer.toLowerCase()}-${index + 1}`,
    topic,
    gameType,
    difficulty: index > 9 ? 'intermediate' : 'beginner',
    question: gameType === 'crossword'
        ? term.clue
        : `Find ${term.answer} in the grid: ${term.clue}`,
    answer: term.answer,
    hints: term.hints,
    tags: [TOPIC_LABELS[topic].toLowerCase(), GAME_LABELS[gameType].toLowerCase(), ...term.tags]
});

export const QUESTION_TOPICS = Object.entries(TOPIC_LABELS).map(([value, label]) => ({ value, label }));
export const GAME_TYPES = Object.entries(GAME_LABELS).map(([value, label]) => ({ value, label }));

export const buildQuestionBank = () => Object.entries(TOPIC_TERMS).flatMap(([topic, terms]) => (
    ['crossword', 'word-search'].flatMap((gameType) => (
        terms.map((term, index) => buildQuestion(topic, gameType, term, index))
    ))
));

export default buildQuestionBank;
