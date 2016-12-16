var View1 = require("./View1");
var test = require("test42");
var assert = test.assert;
var is = require("util42").is;

var view = View1;

var h1 = view.h1;
var h2 = view.h2;
var h3 = view.h3;
var p = view.p;

var cols = view.extend({
	name: "cols"
});

var col = view.extend({
	name: "col"
});


view(function(){
	this.addClass("wires");




	cols(function(){
		col(function(){
			this.css("width", "50%").append("50%")
		})
		col(function(){
			this.css("width", "50%").append("50%")
		})
	});	

	cols(function(){
		col(function(){
			this.css("width", "33.333%").append("33%")
		})
		col(function(){
			this.css("width", "33.333%").append("33%")
		})
		col(function(){
			this.css("width", "33.333%").append("33%")
		})
	});	

	cols(function(){
		col(function(){
			this.css("width", "25%").append("25%")
		})
		col(function(){
			this.css("width", "25%").append("25%")
		})
		col(function(){
			this.css("width", "25%").append("25%")
		})
		col(function(){
			this.css("width", "25%").append("25%")
		})

	});
});
