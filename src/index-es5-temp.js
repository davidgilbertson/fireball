'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var callbacks = [];
var finalScore = 0;
var hasFinished = false;
var scores = [];

function newEl(tag, opt) {
    tag = tag || 'div';

    var el = document.createElement(tag);

    for (var prop in opt) {
        if (prop.hasOwnProperty) {
            if (prop === 'style') {
                for (var styleProp in opt[prop]) {
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
    callbacks.forEach(function (callback) {
        callback(finalScore);
    });
}

function getMedianScore() {
    if (!scores.length) return;

    var scoreArray = scores;
    var midPoint = Math.floor(scoreArray.length / 2);
    var result = undefined;

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
        var logEl = newEl('div', {
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

        var logH1 = newEl('h1', { textContent: 'Fireball' });
        logEl.appendChild(logH1);

        var logMedian = newEl('p', { id: 'log-median' });
        logEl.appendChild(logMedian);

        var logDiv = newEl('div', { id: 'log' });
        logEl.appendChild(logDiv);

        document.querySelector('body').appendChild(logEl);
    }

    var log = document.querySelector('#log');

    if (str === '_finished_') {
        document.querySelector('#log-median').textContent = 'Score: ' + getMedianScore().toLocaleString();

        log.style.color = 'grey';
    } else {
        log.innerHTML += '<p> >' + str + '</p>';
    }
}

function appendClasses(options) {
    var i = undefined;
    var className = options.speedRanges[0].className;

    for (i = 1; i < options.speedRanges.length; i++) {
        if (finalScore >= options.speedRanges[i].min) {
            className = options.speedRanges[i].className;
        }
    }

    options.speedRanges.forEach(function (speedRange) {
        if (finalScore >= speedRange.min) {
            className = speedRange.className;
        }
    });

    if (className) {
        var classSelector = options.classEl || 'body';
        var classEl = document.querySelector(classSelector);

        if (classEl) {
            classEl.classList.add(className); // If window.Worker exists, classList almost certainly does
        }
    }
}

function runFireball(options) {
    finalScore = options.defaultScore || 0;

    if (!window.Worker) {
        options.callback && options.callback();
        return;
    }

    options = options || {};

    var debug = options.debug || false;
    var runs = options.runs || 7;
    var count = 0;
    var fbWorker = new Worker('/fireball-js/fireball_worker.js');

    fbWorker.addEventListener('message', function (e) {
        logScore(e.data);
    }, false);

    function logScore(rawScore) {
        var thisScore = parseInt(rawScore * 6.1813, 10); //align it roughly with Octane

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

function addCallback(callback) {
    if (hasFinished) {
        callback(finalScore);
    } else {
        callbacks.push(callback);
    }
}

exports['default'] = {
    run: runFireball,
    getScore: getScore,
    onSuccess: addCallback
};
module.exports = exports['default'];
