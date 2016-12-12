var Base = require("base42");
var $ = require("jquery");

/* Should we just use require("view42").captor?  It's global, it should be the same for all?  Actually, no, it might not be... (if you have different versions of a module installed in 2 locations, which can easily happen).

For that reason, a captor42 module might be a good idea.  Then, you just never change the version... It should always point to the same package.

But, can 2 modules both install them locally in separate places?  Same version, same code, but exists in 2 locations?  Yes, I think so...

I think node/window globals might be the best solution for this. */
var View1 = Base.extend({
	name: "View1",
	init: function(){
		this.$el = $("<div>").addClass("test-class").append("hello world").appendTo("body");
	}
});