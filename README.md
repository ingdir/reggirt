reggirt
=======

A jQuery plugin that emulates capturing events behavior: trigger them from top to bottom with .reggirt(), the "trigger" method reversed!

### Usage

As stated above, "reggirt" is "trigger" reversed.
You can now trigger event from a top container down to a deep target, for each element in the chain,
in the order similar to a capturing phase of W3C Events but with traditional jQuery event handlers.

During event processing, events are triggered from top container down to a specified selector or jQuery collection.
Nothing bubbles back, or course; we're doing seriuos business, who needs bubbles?

Example:

```html
<div class="root">
    <div class="container">
        <div class="target">I will get the event!</div>
    </div>
</div>
```

```javascript
$('div').on('eventName', function() {
    console.log(this.className);
});

$('.root').reggirt('.target', 'eventName');
```

will output:
```
root
container
target
```

You can also use jQuery collection (or anything that can be converted into it):
```javascript
$('.root').reggirt( $('div.target'), 'eventName');
```
The collection is filtered to allow only elements which are descendants of the root element.


You can pass extra parameters to .reggirt (the same API as for .trigger())

```javascript
$('.root').reggirt('.target', 'eventName', { answer: 42 });

```

Inside your handlers, the event object gets some extra properties:

```javascript
$('div').on('eventName', function(e) {
    e.capturingOrigin;  // DOM element that initiated the event
    e.capturingTarget;  // The target element; the deepest element in the chain, the last to get the event

    // setting this to true is similar to e.stopPropagation() on normal events;
    // the event will NOT be passed along to a deeper element in the container chain.
    e.stopCapturing = true;
});

```
