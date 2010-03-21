/***
 *  Document   : ext-onside-panel-title-override
 *  Created on : 21/03/2010, 03:35:51 AM
 *  Author     : Javier Rincon (syscobra)
 *  Description:
 *      Javascript file with the ExtJS On Side Titles Panel Override
 */

Ext.override(Ext.Panel,{

// Set the default option
headerDir : 'top',

// Rewrite the onRender function adding the new functionality for left title
onRender : function(ct, position){
    Ext.Panel.superclass.onRender.call(this, ct, position);
    this.createClasses();

    var el = this.el,
        d = el.dom,
        bw,
        ts;


    if(this.collapsible && !this.hideCollapseTool){
        this.tools = this.tools ? this.tools.slice(0) : [];
        this.tools[this.collapseFirst?'unshift':'push']({
            id: 'toggle',
            handler : this.toggleCollapse,
            scope: this
        });
    }

    if(this.tools){
        ts = this.tools;
        this.elements += (this.header !== false) ? ',header' : '';
    }
    this.tools = {};

    el.addClass(this.baseCls);
    if(d.firstChild){ // existing markup
        this.header = el.down('.'+this.headerCls);
        this.bwrap = el.down('.'+this.bwrapCls);
        var cp = this.bwrap ? this.bwrap : el;
        this.tbar = cp.down('.'+this.tbarCls);
        this.body = cp.down('.'+this.bodyCls);
        this.bbar = cp.down('.'+this.bbarCls);
        this.footer = cp.down('.'+this.footerCls);
        this.fromMarkup = true;
    }
    if (this.preventBodyReset === true) {
        el.addClass('x-panel-reset');
    }
    if(this.cls){
        el.addClass(this.cls);
    }

    if(this.buttons){
        this.elements += ',footer';
    }

    // This block allows for maximum flexibility and performance when using existing markup

    // framing requires special markup
    if(this.frame){
        // if the header dir is left (title on left)
        if(this.headerDir==='left'){
            el.insertHtml('afterBegin','<div class=\"headerwrap\"><div class=\"x-panel-tl\"></div><div class=\"x-panel-ml\"></div><div class=\"x-panel-bl\"></div></div>');
            this.createElement('header', d.firstChild.childNodes[1]);
            this.createElement('bwrap', el);

            // append the mid and bottom frame to the bwrap
            bw = this.bwrap;
            bw.insertHtml('beforeEnd','<div class=\"x-panel-tr\"><div class=\"x-panel-tc\"></div></div>');
            bw.insertHtml('beforeEnd','<div class=\"x-panel-mr\"><div class=\"x-panel-mc\"></div></div>');
            bw.insertHtml('beforeEnd','<div class=\"x-panel-br\"><div class=\"x-panel-bc\"></div></div>');

            var mc = bw.dom.childNodes[1].firstChild;
            this.createElement('tbar', mc);
            this.createElement('body', mc);
            this.createElement('bbar', mc);
            this.createElement('footer', bw.dom.lastChild.firstChild);
            if(!this.footer){
                this.bwrap.dom.lastChild.className += ' x-panel-nofooter';
            }
            /*
             * Store a reference to this element so:
             * a) We aren't looking it up all the time
             * b) The last element is reported incorrectly when using a loadmask
             */
            this.ft = Ext.get(this.bwrap.dom.lastChild);
            this.mc = Ext.get(mc);
        } else {
            el.insertHtml('afterBegin', String.format(Ext.Element.boxMarkup, this.baseCls));

            this.createElement('header', d.firstChild.firstChild.firstChild);
            this.createElement('bwrap', d);

            // append the mid and bottom frame to the bwrap
            bw = this.bwrap.dom;
            var ml = d.childNodes[1], bl = d.childNodes[2];
            bw.appendChild(ml);
            bw.appendChild(bl);

            var mc = bw.firstChild.firstChild.firstChild;
            this.createElement('tbar', mc);
            this.createElement('body', mc);
            this.createElement('bbar', mc);
            this.createElement('footer', bw.lastChild.firstChild.firstChild);

            if(!this.footer){
                this.bwrap.dom.lastChild.className += ' x-panel-nofooter';
            }
            /*
             * Store a reference to this element so:
             * a) We aren't looking it up all the time
             * b) The last element is reported incorrectly when using a loadmask
             */
            this.ft = Ext.get(this.bwrap.dom.lastChild);
            this.mc = Ext.get(mc);
        }
    }else{
        this.createElement('header', d);
        this.createElement('bwrap', d);

        // append the mid and bottom frame to the bwrap
        bw = this.bwrap.dom;
        this.createElement('tbar', bw);
        this.createElement('body', bw);
        this.createElement('bbar', bw);
        this.createElement('footer', bw);

        if(!this.header){
            this.body.addClass(this.bodyCls + '-noheader');
            if(this.tbar){
                this.tbar.addClass(this.tbarCls + '-noheader');
            }
        }
    }

    if(Ext.isDefined(this.padding)){
        this.body.setStyle('padding', this.body.addUnits(this.padding));
    }

    if(this.border === false){
        this.el.addClass(this.baseCls + '-noborder');
        this.body.addClass(this.bodyCls + '-noborder');
        if(this.header){
            this.header.addClass(this.headerCls + '-noborder');
        }
        if(this.footer){
            this.footer.addClass(this.footerCls + '-noborder');
        }
        if(this.tbar){
            this.tbar.addClass(this.tbarCls + '-noborder');
        }
        if(this.bbar){
            this.bbar.addClass(this.bbarCls + '-noborder');
        }
    }

    if(this.bodyBorder === false){
       this.body.addClass(this.bodyCls + '-noborder');
    }

    this.bwrap.enableDisplayMode('block');

    if(this.header){
        this.header.unselectable();

        // for tools, we need to wrap any existing header markup
        if(this.headerAsText){
            if(this.headerDir=='left')
                this.header.dom.innerHTML =
                '<span class="' + this.headerTextCls + '"><div>'+this.header.dom.innerHTML+'</div></span>';
            else
                this.header.dom.innerHTML =
                '<span class="' + this.headerTextCls + '">'+this.header.dom.innerHTML+'</span>';

            if(this.iconCls){
                this.setIconClass(this.iconCls);
            }
        }
    }

    if(this.floating){
        this.makeFloating(this.floating);
    }

    if(this.collapsible && this.titleCollapse && this.header){
        this.mon(this.header, 'click', this.toggleCollapse, this);
        this.header.setStyle('cursor', 'pointer');
    }
    if(ts){
        this.addTool.apply(this, ts);
    }
    if(this.fbar){
        this.footer.addClass('x-panel-btns');
        this.fbar.render(this.footer);
        this.footer.createChild({cls:'x-clear'});
    }

    if(this.tbar && this.topToolbar){
        this.topToolbar.render(this.tbar);
    }
    if(this.bbar && this.bottomToolbar){
        this.bottomToolbar.render(this.bbar);

    }
    // if the header dir is left (title on left) add the class and slide anchor
    if((this.headerDir=='left')&&(this.header)){
        this.addClass('x-left-panel');
        this.slideAnchor = 'l';
    }
},
// function to get the toolbars count
tbCount : function() {
    var h = 0;
    Ext.each(this.toolbars, function(tb){
        h += 1;
    }, this);
    return h
},
// function to get the tools count
toolsCount : function() {
    var h = 0;
    for (i in this.tools) h += 1;
    return h
},
// function to get the tools height before these are rendered (manually setted up)
toolsHeight : function() {
    var h = 0;
    for (i in this.tools) h += Ext.isWebkit? 22 : 21;
    return h
},
// override to allow a good calculation of body because the header is on left now
adjustBodyWidth : function(w) {
    if((Ext.isNumber(w))&&(this.headerDir=='left'))
        {
            if(this.frame) return w-28; else return w-22;
        }
    else return w
},
// the magic function :) this is the one that puts the height for the rotated titles to appear well
headerHeight : function() {
    if(this.headerDir=='left')
        {
            this.header.setWidth(22);
            var th = this.body.getHeight()+this.getFrameHeight()-this.toolsHeight()-12;
            th += this.toolsCount()*3;
            if (this.frame)
                this.getEl().child('div').child('div.x-panel-ml').setHeight(this.body.getHeight()+this.getFrameHeight()-6);
            else this.getEl().child('div').setHeight(this.body.getHeight()+this.getFrameHeight());
            this.header.child('span').setSize(15,th);
            this.header.child('span').child('div').setSize(th,th);
        }
},
//override this function to exclude the header height from the body height calculation
getFrameHeight : function(){
    var h  = this.el.getFrameWidth('tb') + this.bwrap.getFrameWidth('tb');
    h += (this.tbar ? this.tbar.getHeight() : 0) +
         (this.bbar ? this.bbar.getHeight() : 0);

    if(this.frame){
        if (!this.headerDir==='left')
        h += this.el.dom.firstChild.offsetHeight + this.ft.dom.offsetHeight + this.mc.getFrameWidth('tb');
        else h += this.ft.dom.offsetHeight + this.mc.getFrameWidth('tb');
    }else{
        if (!this.headerDir==='left')
        h += (this.header ? this.header.getHeight() : 0) +
            (this.footer ? this.footer.getHeight() : 0);
        else h+=(this.footer ? this.footer.getHeight() : 0);
    }
    return h;
},
onResize : function(w, h){
    if(Ext.isDefined(w) || Ext.isDefined(h)){
        if(!this.collapsed){
            // First, set the the Panel's body width.
            // If we have auto-widthed it, get the resulting full offset width so we can size the Toolbars to match
            // The Toolbars must not buffer this resize operation because we need to know their heights.

            if(Ext.isNumber(w)){
                this.body.setWidth(w = this.adjustBodyWidth(w - this.getFrameWidth()));
            } else if (w == 'auto') {
                w = this.body.setWidth('auto').dom.offsetWidth;
            } else {
                w = this.body.dom.offsetWidth;
            }

            if(this.tbar){
                this.tbar.setWidth(w);
                if(this.topToolbar){
                    this.topToolbar.setSize(w);
                }
            }
            if(this.bbar){
                this.bbar.setWidth(w);
                if(this.bottomToolbar){
                    this.bottomToolbar.setSize(w);
                    // The bbar does not move on resize without this.
                    if (Ext.isIE) {
                        this.bbar.setStyle('position', 'static');
                        this.bbar.setStyle('position', '');
                    }
                }
            }
            if(this.footer){
                this.footer.setWidth(w);
                if(this.fbar){
                    this.fbar.setSize(Ext.isIE ? (w - this.footer.getFrameWidth('lr')) : 'auto');
                }
            }

            // At this point, the Toolbars must be layed out for getFrameHeight to find a result.
            if(Ext.isNumber(h)){
                h = Math.max(0, this.adjustBodyHeight(h - this.getFrameHeight()));
                this.body.setHeight(h);
            }else if(h == 'auto'){
                this.body.setHeight(h);
            }

            if(this.disabled && this.el._mask){
                this.el._mask.setSize(this.el.dom.clientWidth, this.el.getHeight());
            }
        }else{
            this.queuedBodySize = {width: w, height: h};
            if(!this.queuedExpand && this.allowQueuedExpand !== false){
                this.queuedExpand = true;
                this.on('expand', function(){
                    delete this.queuedExpand;
                    this.onResize(this.queuedBodySize.width, this.queuedBodySize.height);
                }, this, {single:true});
            }
        }
        this.onBodyResize(w, h);
    }
    // this is just what i added here calculate the height of the header title for rotating purpouse
    this.headerHeight();

    this.syncShadow();
    Ext.Panel.superclass.onResize.call(this);
},
// override the title to set the header heights and widths necessary for the renderer function
setTitle : function(title, iconCls){
    this.title = title;
    if(this.header && this.headerAsText){
        if(this.headerDir=='left')
            {
                //wrapped the title to have the div with height and width for rotating
                this.header.child('span').child('div').update(title);
            }
        else this.header.child('span').update(title);
    }
    if(iconCls){
        this.setIconClass(iconCls);
    }
    this.fireEvent('titlechange', this, title);
    return this;
}
})