Fireball
=====
_Because responsive web design is about more than just screen size._

Fireball is a small script that runs when your web page or app is loaded and generates a score.

It hands off the work to a worker process so won't slow the rest of your site down while it's running.

####Example usage:
```javascript
Fireball.run({
  debug: true, //default to false
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

None of the parameters are required. `Fireball.run()` will work fine. The default score will be used if run on a machine that doesn't support web workers. It's up to you to assume what no support means (personally, I think machines that don't support web workers are likely to be older desktops, and I like to default it to 5,000).

The debug mode gives you a read out on-screen. This lets you run your site on different devices and see what score they get. For example your phone might get 4,000, your tablet 8,000 and your desktop 20,000. If your animation looks good on the desktop and tablet, but stutters on the phone, then you might conditionally run the animation only if `Fireball.score > 5000`.

Load up the index.html in the same folder as the two JS files to see it in action.