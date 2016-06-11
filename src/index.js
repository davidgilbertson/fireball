const callbacks = [];
let finalScore = 0;
let hasFinished = false;
const scores = [];

function newEl(tag, opt) {
    tag = tag || 'div';

    const el = document.createElement(tag);

    for (const prop in opt) {
        if (prop.hasOwnProperty) {
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
    callbacks.forEach((callback) => {
        callback(finalScore);
    });
}

function getMedianScore() {
    if (!scores.length) return;

    let scoreArray = scores;
    const midPoint = Math.floor(scoreArray.length / 2);
    let result;

    scoreArray.sort();

    if (scoreArray.length % 2) {
        result = scoreArray[midPoint];
    } else {
        result = (scoreArray[midPoint - 1] + scoreArray[midPoint]) / 2.0;
    }

    return Math.round(result);
}

function log(str) {
    if (!document.querySelector('#logging-panel')) {
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

        document.querySelector('body').appendChild(logEl);
    }

    const log = document.querySelector('#log');

    if (str === '_finished_') {
        document.querySelector('#log-median').textContent = 'Score: ' + getMedianScore().toLocaleString();

        log.style.color = 'grey';
    } else {
        log.innerHTML += '<p> >' + str + '</p>';
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
        const classEl = document.querySelector(classSelector);

        if (classEl) {
            classEl.classList.add(className); // If window.Worker exists, classList almost certainly does
        }
    }
}

const fireballWorker = function(){
    'use strict';

    self.addEventListener('message', function(e) {
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
        const opsPerMilli = OPS / (endTime - startTime);
        return opsPerMilli;
    }
};

function run(options) {
    finalScore = options.defaultScore || 0;

    if (!window.Worker) {
        options.callback && options.callback();
        return;
    }

    options = options || {};

    const debug = options.debug || false;
    const runs = options.runs || 7;
    let count = 0;
    var blobURL = URL.createObjectURL(new Blob(
        ['(', fireballWorker.toString(), ')()'],
        {type: 'application/javascript'}
    ));

    const fbWorker = new Worker(blobURL);

    URL.revokeObjectURL(blobURL);

    fbWorker.addEventListener('message', function (e) {
        logScore(e.data);
    }, false);

    function logScore(rawScore) {
        const thisScore = parseInt(rawScore * 6.1813, 10); //align it roughly with Octane

        scores.push(thisScore);
        finalScore = getMedianScore();

        count++;

        if (debug) log(finalScore.toLocaleString());

        if (count < runs) {
            window.setTimeout(function () {
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
    run: run,
    getScore: getScore,
    onSuccess: onSuccess
};
