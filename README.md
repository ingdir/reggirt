reggirt
=======

A jQuery plugin that emulates capturing events behavior: trigger them from top to bottom with .reggirt(), the "trigger" method reversed!

### What Does It Do?

As stated above, "reggirt" is "trigger" reversed.
You can now trigger event from a top container down to a deep target, for each element in the chain,
in the order similar to W3C Events capturing phase but with traditional jQuery event handlers.

During event processing, events are triggered from top container down to a specified selector or jQuery collection.
Nothing bubbles back, or course; we're doing seriuos business, who needs bubbles?

With simplified syntax, you can also trigger event(s) directly on the current jQuery collection; they will not bubble back to the top of a DOM tree.

### Usage

Basic syntax is:

```javascript
$('some selector').reggirt(
    'target.selector',  // can also be a jQuery element collection, see below
    'eventName',
    {extra: 'event data object', optional: true});
```

Consider this example (DOM structure + JS code):

```html
<div class="root">
    <div class="container">
        <div class="target">I will get the event!</div>
    </div>
</div>
```

```javascript
// on DOMReady
$(function() {
    // create handler with normal jQuery Event API
    $('div').on('eventName', function() {
        console.log(this.className);
    });

    // emulate capturing event
    $('.root').reggirt('.target', 'eventName');
});
```

The code above will output to the console:
```
root
container
target
```

You can also use jQuery collection as a target (or anything that can be converted into jQuery collection):
```javascript
$('.root').reggirt( $('div.target'), 'eventName');
```
**IMPORTANT**: the collection is filtered to allow only elements which are descendants of the root element.

You can pass extra parameters to .reggirt (the same API as for ``.trigger()``)

```javascript
$('.root').reggirt('.target', 'eventName', { answer: 42 });

```

``.reggirt()`` can trigger non-bubbling events directly on the current collection:
just omit the first argument that specifies a target, and plugin will take care of the rest.
Still you can pass extra data to your event:

```javascript
// this click will be triggered on all inputs but won't bubble back...
$('input').reggirt('click');

// ...neither will this, but extra data will be passed to every 'click' event handler:
$('input').reggirt('click', {extra: 'data'});
```

### Extended Event API

Inside event handlers, all event objects initiated by ``.reggirt()`` get some extra properties:

```javascript
$('div').on('eventName', function(e) {
    e.capturingOrigin;  // DOM element that initiated the event
    e.capturingTarget;  // The target element; the deepest element in the chain, the last to get the event

    // setting this to true is similar to e.stopPropagation() on normal events;
    // the event will NOT be passed along to a deeper element in the container chain.
    e.stopCapturing = true;
});

```
