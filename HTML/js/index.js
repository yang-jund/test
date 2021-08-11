!(function(win,doc){
	function Tab(id){
		this.oTab = doc.getElementById(id);
		this.tabs = this.oTab.getElementsByTagName('ul')[0];
		this.tab = this.tabs.children;
		this.tabCon = this.oTab.getElementsByClassName('contents')[0];
		this.tabWidth = this.tabs.offsetWidth/this.tab.length;
		this.tabCons = this.tabCon.children;
		this.moveWidth = 0;
		this.init();

	}
	Tab.prototype = {
		setTabWidth:function(){
			for(var i = 0;i<this.tab.length;i++){
				var self = this;
				this.tab[i].index = i;
				this.tab[i].onclick = function(){
					self.change(this);
				}
			}
		},
		setTabCon:function(){
			this.tabCon.style.width = this.tabs.offsetWidth*this.tabCons.length+"px";
			for(var i = 0;i<this.tabCons.length;i++){
				this.tabCons[i].style.width = this.tabs.offsetWidth + "px";
			}
		},
		change:function(obj){
			for(var i = 0;i<this.tab.length;i++){
				this.tab[i].className = "";
			}
			obj.className = "active";
			this.moveWidth = -(this.tabCons[0].offsetWidth*obj.index)+"px";
			this.tabCon.style.transform = "translate("+this.moveWidth+")";
		},
		init:function(){
			this.setTabWidth();
			this.setTabCon();
		}
	}
	win.Tab = Tab;
}(window,document))