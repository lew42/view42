var View2 = require("./View2");
var test = require("test42");
var assert = test.assert;

var view = View2;

test("nesting", function(){


	view(function(){
		this.addClass("wrap");
		var v = view.extend({
			name: "v",
			addClass: "v",
			preview: view("preview"),
			btn: view({ tag: "button" }, "btn"),
			nest: view({
				wee: view("weee"),
				nesting: view({
					i: view("i"),
					am: view("am"),
					nesting: view("nesting")
				})
			}),
			content: view("contents")
		});

		v();

		console.log(v());
	});

});