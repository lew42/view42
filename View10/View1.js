var Mod4 = require("mod42/Mod4");
var Mod2 = require("mod42/Mod2");
var is = require("util42").is;
var $ = require("jquery");
// var Route = require("route42");

require("font-awesome-webpack");
require("./styles.less");

var ViewCaptor = require("../ViewCaptor");

jQuery = $;

var Enabler = Mod2.Sub.extend({
	name: "Enabler",
	enabled: true,
	disabled: false,
	enable: function(value){
		if (value === false){
			this.enabled = false;
			this.disabled = true;
		} else {
			this.enabled = true;
			this.disabled = false;
		}
	},
	disable: function(value){
		if (value === false){
			this.disabled = false;
			this.enabled = true;
		} else {
			this.disabled = true;
			this.enabled = false;
		}
	}
});

var View1 = module.exports = Enabler.extend({
	name: "View1",
	tag: "div",
	captive: true,
	captor: true,
	autoRender: true,
	cbs: [],
	dcbs: [],
	set: {
		other: function(view, value){
			if (value instanceof View1){
						// wtf - now we can't do view(view("yo"), view("no"))
						// setting a view should append it?
						// but then how do we override?
						// MyView({ subView: view() })
						// unfortunately, I've unified view( x )
						// and subView: x
						// the only way around it might be to do some funny business with an [] wrapper
				// let self get overridden 
				return value;
			} else {
				view.setContent(value);
				return view;
			}
		}
	},
	instantiate: function(o){
		this.inst_el(o);
		Mod4.prototype.instantiate.apply(this, arguments);
	},
	inst_el: function(o){
		if (o && o.tag){
			this.tag = o.tag;
			delete o.tag;
		}

		this.$el = $("<" + this.tag + ">").addClass(this.$el.attr("class")).attr("style", this.$el.attr("style"));
	},
	init: function(){
		if (this.autoRender)
			this.render(); // forcing the user to call render manually is probably a good idea...
			// that way, they have to choose whether to put their code before or after render, and not forget how it works
	},
	setContent: function(value){
		if (!is.def(this.content))
			this.content = value;
		else if (is.arr(this.content)){
			if (is.arr(value))
				this.content.push.apply(this.content, value);
			else
				this.content.push(value);
		} else {
			if (is.arr(value)){
				this.content = [this.content];
				this.content.push.apply(this.content, value);
			} else {
				this.content = value;
			}
		}
	},
	addContent: function(value){
		if (!is.def(this.content)){
			this.content = value;
		} else if (is.arr(this.content)) {
			this.content.push(value);
		} else {
			// is defined, but not an array
			this.content = [this.content, value];
		}
	},
	// render() is also used to re-capture
	render: function(){
		if (this.enabled){
			// set to false to skip
			this.captive && this.getCaptured();

			if (!this.hasOwnProperty("isRendered") || !this.isRendered){
				this.name !== "view1" && this.addClass(this.name);
				this.capture(this.content);
				this.behaviors();
				this.rendered();
				this.isRendered = true;
			}
		}
		return this;
	},
	// catch and add to .content[]
	keep: function(fn){},
	// catch and release:  
	catch: function(fn){},
	// override points
	behaviors: function(){},
	rendered: function(){},
	rerender: function(){
		this.isRendered = false;
		this.render();
	},
	capture: function(value, value2){ /// + argument loop
		if (!is.def(value)){
			return false;
		} else if (is.fn(value)){
			this.captureFn(value);
		} else if (is.obj(value)){
			if (is.fn(value.render)){
				this.captureFn(value.render, value);
			}
		} else if (is.arr(value)){
			for (var i = 0; i < value.length; i++)
				this.capture(value[i]);
		} else {
			this.append(value); // DOM, view
		}
	},
	captureFn: function(fn, ctx){
		var ret;
		this.captor && this.becomeCaptor();
		ret = fn.call(ctx || this, this); // allow fn to bind to something else, and then use the first arg as the reference to the view
		this.captor && this.restoreCaptor();

		if (is.def(ret) && ret !== ctx){
			console.warn("capturing function return value");
			this.capture(ret);
		}
	},
	becomeCaptor: function(){
		if (this.captor){
			this.previousCaptor = ViewCaptor.captor;
			ViewCaptor.captor = this;
		}
	},
	restoreCaptor: function(){
		if (this.captor){
			ViewCaptor.captor = this.previousCaptor;
		}
	},
	getCaptured: function(){
		if (this.captive && ViewCaptor.captor){
			ViewCaptor.captor.add(this);
		}
	},
	// these come from within captured fns
	add: function(view){
		if (!this[view.name])
			this[view.name] = view;

		if (view.setup)
			view.setup(this);

		// this is all that really needs to happen
		view.$el.appendTo(this.$el);
	},
	// a jQuery filler text plugin
	filler: function(quantity){
		this.attr("data-lorem", quantity);
		return this;
	},
	activate: function(){
		if (!this.active){
			this.active = true;

			if (this.route)
				this.route.activate();

			this.execCBs.apply(this, arguments);
		}
	},
	execCBs: function(){
		for (var i = 0; i < this.cbs.length; i++){
			this.cbs[i].apply(this, arguments);
		}
	},
	then: function(cb){
		this.cbs.push(cb);
	}
}).set({
	extend: {
		instantiate_prototype: function(NewView, OldView){
			// protect prototype chain
			NewView.prototype.inst_el();
		}
	},
	x: function(){
		return new (this.bind.apply(this, [null, {
			autoRender: false
		}].concat([].slice.call(arguments))));
	}, // maybe i can just use new this.apply()?
	// no, i think the challenge is applying without changing the ctx
	child: function(){
		// doesn't work - "apply is not a constructor"
		return new this.apply(null, arguments);
	}
});

View1.prototype.$el = $("<div>");


/*   Forward jQuery fns to view.$el   */
// this just maps view.whatever() to view.$el.whatever(), so you can view.hide(), or view.show(), etc...
// if we view.append(anotherView), we need to pass anotherView.$el
// I think a rather simple check for .$el should work... 
var aliasFnToEl = function(fn){
	return function(view){
		var ret;
		// if we .. append(view), we really need to append(view.$el)
		if (view && view.$el)
			ret = this.$el[fn].call(this.$el, view.$el);
		// otherwise, just pass all arguments along, untouched
		else 
			ret = this.$el[fn].apply(this.$el, arguments);
		
		// sometimes jQuery returns a new collection with the same items, so check the actual DOM element
		if (ret && ret[0] === this.$el[0]){
			// return the view, not the $el, for chaining
			return this;
		} else {
			return ret;
		}
	};
};

// I've been adding as needed - not an exhaustive list
[	'append', 'prepend', 'click', 'show', 'hide', 'appendTo', 'prependTo', 'addClass', 'removeClass', 
	'css', 'attr', 'remove', 'empty', 'hasClass', 'html', "text", "slideDown", "slideUp", "fadeIn", "fadeOut", "animate", "slideToggle", "fadeToggle", "toggle"].forEach(function(v){
		View1.prototype[v] = aliasFnToEl(v);
});



/*  Create some standard elements, put them on the View constructor, and on the prototype  */
var Element;
["p", "h1", "h2", "h3", "button", "section"].forEach(function(v){
	Element = View1.extend({
		name: v,
		tag: v
	});

	View1[v] = Element;

	View1.prototype[v] = Element;
});


var Icon = View1.Icon = View1.prototype.Icon = View1.extend({
	name: "Icon",
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

Icon.prototype.set("circle").disable();


var Flex = View1.Flex = View1.prototype.flex = View1.extend({
	name: "Flex",
	addClass: "flex"
});

var Item = View1.Item = View1.prototype.Item = Flex.extend({
	name: "Item",
	addClass: "item flex pad-children",
	set: {
		other: function(item, value){
			item.label.set(value);
			return item;
		}
	},
	icon: Icon.x(),
	label: View1.x(function(){
		this.append(this.parent.name);
	}),
	btn: Icon.x("beer"),
	content: function(){
		this.icon.render();
		this.label.render();
		this.btn.render();
	}
});