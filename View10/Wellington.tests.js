var View1 = require("./View1");
var test = require("test42");
var assert = test.assert;
var is = require("util42").is;

var view = View1;

var h1 = view.h1;
var h2 = view.h2;
var h3 = view.h3;
var p = view.p;

view(function(){
	this.addClass("well padded");
})