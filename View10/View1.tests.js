var View1 = require("./View1");
var test = require("test42");
var assert = test.assert;
var is = require("util42").is;

var view = View1;

/*

viewables
	simple value
	function
		capture
		return value



content undefined
	=> any => assign

content fn or value
	=> new viewable => assign

content []
	=> new fn or value => append
	=> object => std set (assign, call/apply)
	=> array => apply push
	=> [array] => push the array

*/

test("basic", function(){
	view("hello world");
	view("hello", " ", "world");
	view({
		addClass: "test",
		content: "yo"
	});
});

test("triforce", function(){
	view("content").css("color", "red");

	view({
		css: ["color", "white"],
		content: "content"
	});

	view(function(){
		this.append("content").css("color", "blue");
	});
});

test("external nesting", function(){
	var v1 = view("one", view("two three"), "four");
	var v2 = v1.clone();
	console.log(v1, v2);
});

test("extending", function(){
	var view2 = view.extend("one", function(){
		this.append(Date.now());
	});

	var v2 = view2();

	view.button("click me").click(function(){
		v2.capture(function(){
			view2();
		}, this);
	}.bind(this));
});

test("item", function(){
	var icon = view.extend({
		name: "icon",
		tag: "i",
		addClass: "icon fa fa-fw",
		set: {
			other: function(icon, value){
				if (is.str(value))
					icon.type(value);
				else if (is.bool(value))
					icon.enable(value);
				return icon;
			}
		},
		type: function(type){
			this.enable();
			this.$el.removeClass("fa-" + this._type).addClass("fa-" + type);
			this._type = type;
			return this;
		}
	});

	icon.prototype.set("circle").disable();

	var i1 = icon(); // disabled by default
	var i2 = icon("beer");

	var btn = view.extend({
		tag: "button"
	});

	var flex = view.extend({
		name: "flex",
		addClass: "flex"
	});

	var item = flex.extend({
		name: "item",
		set: {
			other: function(item, value){
				item.label.set(value);
				return item;
			}
		},
		icon: icon.x(),
		whatever: "woo hoo",
		label: view.x(function(){
			this.append(this.parent.whatever);
		}),
		btn: btn.x("yo"),
		content: function(){
			this.icon.render();
			this.label.render();
			this.btn.render();
		}
	});

	item();
	item({
		whatever: "yo"
	})
	item({
		icon: "plane",
		label: "no"
	})
	item("yea");
	item(["yea"]);

	item("so", "now", "this", "doesnt", "work");
});

test("override", function(){
	var v1 = view.extend({
		sub: view.x({
			addClass: "sub",
			content: "sub"
		}),
		content: function(){
			this.sub.render();
		}
	});

	v1({
		sub: view.x({
			addClass: "sub2",
			content: "sub2"
		})
	});
});