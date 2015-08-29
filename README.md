# Fireball
Breakpoints for performance.

Fireball is a small script that runs when your web page is loaded. It generates a score based on the performance of the user's hardware. 

It hands off the work to a worker process so won't slow the rest of your site down while it's running.

## Example usage
### The simple way
`Fireball.run()`

The resulting score will be available in your JavaScript as `Fireball.score` after a few seconds.

```javascript
if (Fireball.score > 8000){
    //Do something to delight the user
} else {
    //Do something boring but easy on the CPU
}
```

### With classes
```javascript
Fireball.run({
    speedRanges: [
        {min: 0, className: 'sloth'},
        {min: 4000, className: 'tortoise'},
        {min: 8000, className: 'puppy'},
        {min: 16000, className: 'cheetah'}
    ]
});
```

These breakpoints will be prefixed with `fireball-` and added as classes to the `<body>` so you can target them in CSS. E.g.

```css
body.fireball-sloth .my-element {
    /* no box shadows, transitions, etc. */
}

body.fireball-cheetah .my-element {
    /* some hella fancy animation */
}
```

### With all the bells and whistles
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
    }
});
```

### Benchmark
The Fireball score is roughly aligned with [the Octane benchmark](http://chromium.github.io/octane/) score;
if a machine gets 15,000 on octane, the Fireball score will be within a few thousand of that.
