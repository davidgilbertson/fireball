'use strict';

var Fireball = Fireball || {};

Fireball.scores = [];

Fireball.newEl = function (tag, opt) {
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
};

Fireball.getEl = function (str) {
    return document.querySelector(str);
};

Fireball.getMedianScore = function () {
    if (Fireball.scores.length === 0) {
        return;
    }

    var scoreArray = Fireball.scores;
    var midPoint = Math.floor(scoreArray.length / 2);
    var result;

    scoreArray.sort();

    if (scoreArray.length % 2) {
        result = scoreArray[midPoint];
    } else {
        result = (scoreArray[midPoint - 1] + scoreArray[midPoint]) / 2.0;
    }

    return Math.round(result);
};

Fireball.log = function (str) {
    if (!document.querySelector('#logging-panel')) {
        var logEl = Fireball.newEl('div', {
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

        var logH1 = Fireball.newEl('h1', {textContent: 'Fireball'});
        logEl.appendChild(logH1);

        var logMedian = Fireball.newEl('p', {id: 'log-median'});
        logEl.appendChild(logMedian);

        var logDiv = Fireball.newEl('div', {id: 'log'});
        logEl.appendChild(logDiv);

        document.getElementsByTagName('body')[0].appendChild(logEl);
    }

    var log = document.querySelector('#log');

    if (str === '_finished_') {
        document.querySelector('#log-median').textContent = 'Score: ' + Fireball.getMedianScore().toLocaleString();

        log.style.color = 'grey';
    } else {
        log.innerHTML += '<p> >' + str + '</p>';
    }
};

Fireball.appendClasses = function (options) {
    var i;
    var className = options.speedRanges[0].className;

    for (i = 1; i < options.speedRanges.length; i++) {
        if (Fireball.score >= options.speedRanges[i].min) {
            className = options.speedRanges[i].className;
        }
    }

    if (className) {
        var classEl = document.querySelector(options.classEl);

        if (classEl) {
            classEl.classList.add('fireball-' + className); // If window.Worker exists, classList almost certainly does
        }
    }
};

Fireball.run = function (options) {
    if (!window.Worker) {
        Fireball.score = options.defaultScore || 0;
        options.callback && options.callback();
        return;
    }

    options = options || {};

    var debug = options.debug || false;
    var runs = options.runs || 7;
    var count = 0;
    var fbWorker = new Worker('fireball_worker.js');

    fbWorker.addEventListener('message', function (e) {
        logScore(e.data);
    }, false);

    function logScore(score) {
        score = parseInt(score * 6.1813, 10); //align it roughly with Octane

        Fireball.scores.push(score);
        Fireball.score = Fireball.getMedianScore();

        count++;

        if (debug === true) {
            Fireball.log(score.toLocaleString());
        }

        if (count < runs) {
            window.setTimeout(function () {
                fbWorker.postMessage('run');
            }, 100);
        } else {
            if (debug === true) {
                Fireball.log('_finished_');
            }

            if (options.classEl && options.speedRanges) {
                Fireball.appendClasses(options);
            }

            options.callback && options.callback();
        }
    }

    fbWorker.postMessage('run');
};
