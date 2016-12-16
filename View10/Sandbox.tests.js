var View1 = require("./View1");
var test = require("test42");
var assert = test.assert;
var is = require("util42").is;

var view = View1;

var h1 = view.h1;
var h2 = view.h2;
var h3 = view.h3;
var p = view.p;

var full = view.extend({name: "full"});

var padded = view.extend({name: "padded"});

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

var spectrum = view.extend(function(){
	for (var i = 5; i >= 1; i--){
		view("d"+i).addClass("d"+i).addClass(this.colorClass);
	}
	view("std").addClass(this.colorClass).css("border", "2px solid white");
	for (var i = 1; i <=5; i++){
		view("l"+i).addClass("l"+i).addClass(this.colorClass);
	}
});

test("typography", function(){

	full(function(){

		full().css({
			height: "35px",
			background: "#555"
		})

		padded(function(){
			h1("Padded H1");

			p().filler("2-4s");


			full(function(){

				full().css({
					height: "35px",
					background: "#555"
				})

				h2("This is an H2");

				p("This section shows content that's aligned with the parent content.");

				full().css({
					height: "35px",
					background: "#555"
				})

				padded(function(){
					h2("Indented H2");

					p().filler("2-4s");
					
					spectrum({
						addClass: "test-colors pad-children",
						colorClass: "test-color"
					});
				});

				full().css({
					height: "35px",
					background: "#555"
				})
				
			});

		});

		full().css({
			height: "35px",
			background: "#555"
		})


	});
});

test("nesting", function(){

	full(function(){
		this.addClass("padded");
		h1("Primary BG").addClass("primary-bg shade");	
		p().filler("2-4s");
		h2("Standard H2");
		p().filler("2-4s");
		view(function(){
			this.addClass("primary-bg l4 padded");
			p().filler("2-4s").css("color", "#333").css("text-shadow", "none");
		});
		p().filler("2-4s");
		view(function(){
			this.addClass("primary-bg d2 padded");
			p().filler("2-4s")//.css("color", "#333").css("text-shadow", "none");
		});
		p().filler("2-4s");
		view(function(){
			this.addClass("stack");
			h2("List").addClass("primary-color l1 shade");
			h2("Of").addClass("primary-color l1 shade");
			h2("H2s").addClass("primary-color l1 shade");
		});
		view(function(){
			this.css({
				display: "flex",
				color: "#333"
			}).addClass("primary-bg l4 shade");

			icon("pie-chart").addClass("padded").css("font-size", "2em").css("background", "rgba(0,0,0,0.1)").css("padding", "0.5em");

			view(function(){
				this.addClass("padded");
				p("Try to make the above stack align with the right edge.  On hover, you could invert the shadow, and remove the bevel?").css("color", "#333").css("text-shadow", "none");
			});
		});
	});
	h1("Primary BG").addClass("primary-bg dark");	
	h1("Primary Color").addClass("primary-color l1");
});

test("cols", function(){

	view(function(){
		this.css({
			display: "flex"
		});

		view(function(){
			this.css({
				width: "33%"
			}).addClass("fix-child-margins");

			h1("This is an h1");

			p().filler("2s");

			h2("This is an h2");
			
			p().filler("2s");

			h3("This is an h3");

			p().filler("2s");
		});

		view(function(){
			this.css({
				width: "33%",
				fontSize: "0.75em"
			}).addClass("fix-child-margins");

			h1("This is an h1");

			p().filler("2s");

			h2("This is an h2");
			
			p().filler("2s");

			h3("This is an h3");

			p().filler("2s");
		});	

		view(function(){
			this.css({
				width: "33%",
				fontSize: "2em"
			}).addClass("fix-child-margins");

			h1("This is an h1");

			p().filler("2s");

			h2("This is an h2");
			
			p().filler("2s");

			h3("This is an h3");

			p().filler("2s");
		});

		
	});


	view(function(){
		this.css({
			display: "flex"
		});

		view(function(){
			this.css("width", "50%");

			full(function(){
				this.addClass("padded");
				h1("Primary BG").addClass("primary-bg");	
				p().filler("2-4s");
				p().filler("2-4s");
				p().filler("2-4s");
				h2("List").addClass("primary-color l1");
				h2("Of").addClass("primary-color l1");
				h2("H2s").addClass("primary-color l1");
			});
			h1("Primary BG").addClass("primary-bg dark");	
			h1("Primary Color").addClass("primary-color l1");
		});

		view(function(){
			this.css("width", "50%");
			this.css("font-size", "0.85em");

			full(function(){
				this.addClass("padded");
				h1("Primary BG").addClass("primary-bg");	
				p().filler("2-4s");
				p().filler("2-4s");
				p().filler("2-4s");
				h2("List").addClass("primary-color l1");
				h2("Of").addClass("primary-color l1");
				h2("H2s").addClass("primary-color l1");
			});
			h1("Primary BG").addClass("primary-bg dark");	
			h1("Primary Color").addClass("primary-color l1");
		});


	});

});