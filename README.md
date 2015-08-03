# Fireball

Breakpoints for performance.

Fireball is a small script that runs when your web page is loaded. It generates a score based on the performance of the user's hardware. 

It hands off the work to a worker process so won't slow the rest of your site down while it's running.

## Example usage
```javascript
Fireball.run({
  debug: true, //defaults to false
  runs: 7, //defaults to 7
  defaultScore: 5000, //defaults to 0
  callback: function(score) {
    if (Fireball.score > 5000){
      //Start some awesome background animation
    } else {
      //Load some boring background image
    }
  }
});
```

None of the parameters are required. `Fireball.run()` will work fine. The default score will be used if run on a machine 
that doesn't support web workers. 
It's up to you to assume what no support means (personally, I think machines that don't support web workers are likely to 
be older desktops, and I like to default it to 5,000).

The debug mode gives you a read out on-screen. This lets you run your site on different devices and see what score they get. 
For example the phones you've tested your site on get around 4,000 - 6,000, some tablets around 8,000 and your desktop 20,000. 
If your animation looks good on the desktop and tablet, but stutters on the slower phones, 
then you might conditionally run the animation only if `Fireball.score > 5000`.

Load up the index.html in the same folder as the two JS files to see it in action.