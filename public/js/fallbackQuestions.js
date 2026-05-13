(function () {
    const topics = {
        javascript: [
            ['CLOSURE', 'Function concept where an inner function keeps access to variables from its outer scope.'],
            ['PROMISE', 'Object that represents a future asynchronous success or failure.'],
            ['CALLBACK', 'Function passed into another function to run later.'],
            ['HOISTING', 'JavaScript behavior where declarations are processed before code execution.'],
            ['PROTOTYPE', 'Object used by JavaScript to share methods through the inheritance chain.'],
            ['EVENTLOOP', 'Runtime mechanism that coordinates the call stack, queues, and async callbacks.'],
            ['DESTRUCTURE', 'Syntax for unpacking object properties or array values into variables.'],
            ['ARROW', 'Short function syntax that does not bind its own this value.'],
            ['MODULE', 'Reusable JavaScript file unit that can export and import values.'],
            ['STRICT', 'Mode that catches silent JavaScript errors and prevents some unsafe behavior.'],
            ['SPREAD', 'Syntax that expands arrays or object properties into another expression.'],
            ['THIS', 'Keyword whose value depends on how a function is called.'],
            ['MAP', 'Array method that returns a new array by transforming each item.'],
            ['REDUCE', 'Array method that accumulates many values into one result.'],
            ['JSON', 'Text data format commonly parsed and stringified in JavaScript APIs.']
        ],
        nodejs: [
            ['EXPRESS', 'Minimal Node.js web framework commonly used for routing and middleware.'],
            ['MIDDLEWARE', 'Function layer that runs during the request-response cycle.'],
            ['ROUTER', 'Express object used to group related endpoints.'],
            ['REQUEST', 'Express object that contains URL params, body, query, headers, and cookies.'],
            ['RESPONSE', 'Express object used to send HTML, JSON, redirects, or status codes.'],
            ['NODEMON', 'Development tool that restarts a Node process after file changes.'],
            ['PACKAGE', 'Project metadata file that lists scripts and dependencies.'],
            ['MODULE', 'Reusable JavaScript unit imported by Node.js files.'],
            ['STREAM', 'Node abstraction for processing data piece by piece.'],
            ['BUFFER', 'Node object for handling binary data.'],
            ['ASYNC', 'Keyword used to define a function that returns a Promise.'],
            ['COOKIE', 'Small browser-stored value often used to remember authentication state.'],
            ['SESSION', 'Server-side or signed state used to remember a user across requests.'],
            ['CORS', 'Browser security policy for cross-origin HTTP access.'],
            ['JWT', 'Compact token format often used for stateless authentication.']
        ],
        mongodb: [
            ['DOCUMENT', 'MongoDB record stored as a BSON-like object.'],
            ['COLLECTION', 'MongoDB grouping of documents, similar to a table in relational databases.'],
            ['OBJECTID', 'Default MongoDB identifier type used for _id values.'],
            ['SCHEMA', 'Mongoose structure that defines fields, types, validation, and indexes.'],
            ['MODEL', 'Mongoose class used to create, query, update, and delete documents.'],
            ['INDEX', 'Database structure that speeds up reads for selected fields.'],
            ['AGGREGATE', 'MongoDB pipeline feature for grouping, transforming, and calculating data.'],
            ['PIPELINE', 'Ordered list of aggregation stages that process documents step by step.'],
            ['POPULATE', 'Mongoose helper that replaces referenced ids with actual documents.'],
            ['LEAN', 'Mongoose query option that returns plain objects instead of full documents.'],
            ['VALIDATE', 'Process of checking data rules before saving or accepting input.'],
            ['REPLICA', 'MongoDB copy of data used for redundancy and failover.'],
            ['ATLAS', 'MongoDB cloud database service.'],
            ['BSON', 'Binary data format MongoDB uses internally for documents.'],
            ['QUERY', 'Database request used to find, filter, update, or delete documents.']
        ],
        'general-tech': [
            ['HTTP', 'Protocol used by browsers and servers to exchange web requests and responses.'],
            ['HTTPS', 'Secure version of HTTP that encrypts traffic with TLS.'],
            ['API', 'Contract that lets software systems communicate with each other.'],
            ['DATABASE', 'Organized system for storing and querying application data.'],
            ['CACHE', 'Fast temporary storage used to avoid repeated expensive work.'],
            ['LATENCY', 'Delay between making a request and receiving a response.'],
            ['BANDWIDTH', 'Amount of data that can move across a network in a period of time.'],
            ['FIREWALL', 'Security system that controls allowed network traffic.'],
            ['ENCRYPTION', 'Process of transforming readable data so only authorized parties can read it.'],
            ['DEPLOYMENT', 'Process of releasing an application to an environment where users can access it.'],
            ['GIT', 'Version control system used to track source code history.'],
            ['BRANCH', 'Independent line of Git work used to develop changes without touching main code.'],
            ['TERMINAL', 'Text interface used to run development commands.'],
            ['COMPILER', 'Tool that transforms source code into another form before execution.'],
            ['DEBUGGER', 'Tool used to pause code, inspect variables, and step through execution.']
        ]
    };

    const hints = (answer) => [
        `Starts with ${answer[0]} and has ${answer.length} letters.`,
        'Beginner-to-intermediate technical interview term.'
    ];

    window.FALLBACK_QUESTION_BANK = Object.entries(topics).flatMap(([topic, terms]) => (
        ['crossword', 'word-search'].flatMap((gameType) => (
            terms.map(([answer, clue], index) => ({
                id: `fallback-${topic}-${gameType}-${answer.toLowerCase()}-${index + 1}`,
                slug: `fallback-${topic}-${gameType}-${answer.toLowerCase()}-${index + 1}`,
                topic,
                gameType,
                difficulty: index > 9 ? 'intermediate' : 'beginner',
                question: gameType === 'crossword' ? clue : `Find ${answer} in the grid: ${clue}`,
                answer,
                hints: hints(answer),
                tags: [topic, gameType]
            }))
        ))
    ));
}());
