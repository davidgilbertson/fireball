const callbacks = [];
let finalScore = 0;
let hasFinished = false;
const scores = [];

const getEl = selector => document.querySelector(selector);

function newEl(tag, opt) {
    const el = document.createElement(tag);

    for (const prop in opt) {
        if (opt.hasOwnProperty(prop)) {
            if (prop === 'style') {
                for (const styleProp in opt[prop]) {
                    el[prop][styleProp] = opt[prop][styleProp];
                }
            } else {
                el[prop] = opt[prop];
            }
        }
    }

    return el;
}

function runCallbacks() {
    callbacks.forEach(callback => {
        callback(finalScore);
    });
}

function getMedianScore() {
    if (!scores.length) return;

    const midPoint = Math.floor(scores.length / 2);
    let result;

    scores.sort();

    if (scores.length % 2) {
        result = scores[midPoint];
    } else {
        result = (scores[midPoint - 1] + scores[midPoint]) / 2.0;
    }

    return Math.round(result);
}

function log(str) {
    if (!getEl('#logging-panel')) {
        const logEl = newEl('div', {
            id: 'logging-panel',
            style: {
                'position': 'fixed',
                'width': '300px',
                'height': '260px',
                'bottom': '10px',
                'left': '10px',
                'padding': '10px',
                'background': '#111',
                'font-family': 'monospace',
                'font-size': '12px',
                'line-height': '14px',
                'color': '#eee',
                'overflow': 'auto',
                'box-shadow': '2px 2px 20px rgba(0, 0, 0, 0.5)',
                'z-index': '99'
            }
        });

        const logH1 = newEl('h1', {textContent: 'Fireball'});
        logEl.appendChild(logH1);

        const logMedian = newEl('p', {id: 'log-median'});
        logEl.appendChild(logMedian);

        const logDiv = newEl('div', {id: 'log'});
        logEl.appendChild(logDiv);

        getEl('body').appendChild(logEl);
    }

    const log = getEl('#log');

    if (str === '_finished_') {
        getEl('#log-median').textContent = `Score: ${getMedianScore().toLocaleString()}`;

        log.style.color = 'grey';
    } else {
        log.innerHTML += `<p> > ${str} </p>`;
    }
}

function appendClasses(options) {
    let i;
    let className = options.speedRanges[0].className;

    for (i = 1; i < options.speedRanges.length; i++) {
        if (finalScore >= options.speedRanges[i].min) {
            className = options.speedRanges[i].className;
        }
    }

    options.speedRanges.forEach(speedRange => {
        if (finalScore >= speedRange.min) {
            className = speedRange.className;
        }
    });

    if (className) {
        const classSelector = options.classEl || 'body';
        const classEl = getEl(classSelector);

        if (classEl) {
            classEl.classList.add(className); // If window.Worker exists, classList almost certainly does
        }
    }
}

const fireballWorker = () => {
    'use strict';

    self.addEventListener('message', () => {
        self.postMessage(runTest());
    }, false);

    function runTest() {
        const OPS = 1000000;
        var startTime = new Date().valueOf();

        for (let i = 0; i < OPS; i++) {
            /=/.exec('111soqs57qo8o8480qo18sor2011r3n591q7s6s37r120904');
            /=/.exec('SbeprqRkcvengvba=633669315660164980');
            /=/.exec('FrffvbaQQS2=111soqs57qo8o8480qo18sor2011r3n591q7s6s37r120904');
        }

        const endTime = new Date().valueOf();
        return OPS / (endTime - startTime);
    }
};

function run(options = {}) {
    finalScore = options.defaultScore || 0;

    if (!window.Worker) {
        options.callback && options.callback();
        return;
    }

    const debug = options.debug || false;
    const runs = options.runs || 7;
    let count = 0;
    const blobURL = URL.createObjectURL(new Blob(
        [`(${fireballWorker.toString()})()`],
        {type: 'application/javascript'}
    ));

    const fbWorker = new Worker(blobURL);

    URL.revokeObjectURL(blobURL);

    fbWorker.addEventListener('message', e => {
        logScore(e.data);
    }, false);

    function logScore(rawScore) {
        const thisScore = parseInt(rawScore * 6.1813, 10); //align it roughly with Octane

        scores.push(thisScore);
        finalScore = getMedianScore();

        count++;

        if (debug) log(finalScore.toLocaleString());

        if (count < runs) {
            setTimeout(() => {
                fbWorker.postMessage('run');
            }, 100);
        } else {
            hasFinished = true;

            runCallbacks();

            if (debug) log('_finished_');

            if (options.speedRanges) appendClasses(options);

            options.callback && options.callback();
        }
    }

    fbWorker.postMessage('run');
}

function getScore() {
    return finalScore;
}

function onSuccess(callback) {
    if (hasFinished) {
        callback(finalScore);
    } else {
        callbacks.push(callback);
    }
}

export default {
    run,
    getScore,
    onSuccess,
};
