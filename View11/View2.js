var View1 = require("../View10");
/*

view({
	preview: view("preview"),
	content: view("content")
});

I think this has promise for quickly whipping together views.

You could always assign: {} a sub view if you didn't want to auto-append it...

But, some challenges:
- "extending" an existing view:
	if we have an item() view, and we do:
		item({
			preview: [icon("beer"), "string", btn("arrow")],
			content: function(){
				// ...
			}
		})
	let's say preview already exists...
		wouldn't passing an array mean "append"??
			if preview is an empty container, then sure, append them...
			the first ["^", prepend, these, "$", append, these]
		and passing a single view means override?

the preview view would probably already exist in the .contents[] array?  Unless it was a dynamic preview, that only shows up when something is added to it... 

Now we're just getting too tricky..

But, I suppose any view could be an "auto view". That is auto adopted, that auto-appends new views, and that auto enables itself only if it has content.  After all, an empty view is kinda stupid...

Ok, so the preview exists in the contents[] array, and controls itself (just passes on rendering if no content has been added).




Adopting all of these properly is a little out of scope for now...
I need to use view1 to make good debug views...
*/
var View2 = module.exports = View1.extend({
	name: "View2",
	setup: function(parent, name){
		// name is only present when .setup from .set
		// name is undefined when captured
		if (!this.parent || name){ // this is tricky, see below
			this.parent = parent;
			this.name = name;
			parent.capture(this);
		}
	},
	// set: {
	// 	obj: function(mod, obj){
	// 		for (var i in obj){
	// 			if (obj[i] instanceof View1)
	// 				this.viewProp(mod, i, obj[i]);
	// 			else
	// 				this.prop(mod, i, obj[i]);
	// 		}
	// 		return mod; // used in .objProp()
	// 	},
	// 	viewProp: function(mod, i, view){

	// 	}
	// }
});


/*

The sub views are being captured the first time by the wrap.

parent.capture(view)
	parent.add(view)
		view.setup(parent) // no name passed
			parent.capture(view) // RECURSION!!!


The second time, we allow a recapture, programmed by the presence of the name variable, as noted above.
	This is a pretty hacky way to do it.  I doubt I'll remember what's going on here in 5 minutes.

v.set({
	x: vx()
		v.x.setup(v, "x") // name passed


})

To prevent recursion, we have to be careful.

When the vx is first created, its captured by an outsider, not the parent it's getting set to.

Then, we need to recapture it, and we're doing that with .setup.

When v.x.setup(v, "x"), x has already been captured by the outsider, but because we're passing in a name, this signifies that it's being .set->.setup, and that we want to recapture.

Then, 

*/