# Fireball
Breakpoints for performance.

Fireball is a small script that runs when your web page is loaded. It generates a score based on the performance of the user's hardware. 

It hands off the work to a different thread so won't slow the rest of your site down while it's running.

## Installation

```
npm install fireball --save
```

```
bower install fireball
```

## Example usage

### Setup
Fireball uses a [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) to calculate a score, which is loaded dynamically when fireball initialises. No need to host the worker script in another file.

### Running fireball, the simple way
```javascript
var Fireball = require('fireball-js');
Fireball.run();
```

or if adding the script directly or using bower Fireball will be already available: 

```javascript
Fireball.run();
```


The resulting score will be available in your JavaScript as `Fireball.getScore()` after a few seconds.

```javascript
if (Fireball.getScore() > 8000){
    //Do something to delight the user
} else {
    //Do something boring but easy on the CPU
}
```

### Running fireball with classes
```javascript
Fireball.run({
    speedRanges: [
        {min: 0, className: 'speed-of-sloth'},
        {min: 4000, className: 'speed-of-tortoise'},
        {min: 8000, className: 'speed-of-puppy'},
        {min: 16000, className: 'speed-of-cheetah'}
    ]
});
```

These breakpoints will be added as classes to the `<body>` so you can target them in CSS. E.g.

```css
body.speed-of-sloth .my-element {
    /* no box shadows, transitions, etc. */
}

body.speed-of-cheetah .my-element {
    /* some hella fancy animation */
}
```

### Running fireball with all the bells and whistles
```javascript
Fireball.run({
    debug: true, //shows an onscreen readout. Defaults to false
    runs: 7, //defaults to 7
    defaultScore: 5000, //defaults to 0
    classEl: 'body', //append a class indicating speed to this element. Defaults to 'body'
    speedRanges: [ //the speed breakpoints and classnames to use
        {min: 0, className: 'sloth'},
        {min: 4000, className: 'tortoise'},
        {min: 8000, className: 'puppy'},
        {min: 16000, className: 'cheetah'}
    ],
    callback: function(score) {
        //do something now that the tests are done
        //  or store the score in a global variable if you're that way inclined
    }
});
```

You can also register a callback like so.

```
Fireball.onSuccess(callback);
```

`callback` will be passed a single argument, the score.

This is handy if you have a modular system and want to access the fireball score in a different module 
without using a global variable. If the score has already been calculated this will execute immediately.

## Browser support
Modern browsers and IE10+, Android 4.4+, Safari 5.1+

## Benchmark
The Fireball score is roughly aligned with [the Octane benchmark](http://chromium.github.io/octane/) score;
if a machine gets 15,000 on octane, the Fireball score will be within a few thousand of that. Probably.

Check out the demo on [my site](http://www.dg707.com/fireball) to see what score your machine gets.
