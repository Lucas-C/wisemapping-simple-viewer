/*
* Licensed to the Apache Software Foundation (ASF) under one or more
* contributor license agreements.  See the NOTICE file distributed with
* this work for additional information regarding copyright ownership.
* The ASF licenses this file to You under the Apache License, Version 2.0
* (the "License"); you may not use this file except in compliance with
* the License.  You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* $Id: file 64488 2006-03-10 17:32:09Z paulo $
*/

web2d.peer.svg.CurvedLinePeer = function()
{
    var svgElement = window.document.createElementNS(this.svgNamespace, 'path');
    web2d.peer.svg.ElementPeer.call(this, svgElement);
    this._style={fill:'gray'};
    this._updateStyle();
    this._customControlPoint_1 = false;
    this._customControlPoint_2 = false;
    this._control1=new core.Point();
    this._control2=new core.Point();
    this._lineStyle=true;
};

objects.extend(web2d.peer.svg.CurvedLinePeer, web2d.peer.svg.ElementPeer);

web2d.peer.svg.CurvedLinePeer.prototype.setSrcControlPoint = function(control){
    this._customControlPoint_1 = true;
    if(core.Utils.isDefined(control.x)){
        this._control1 = control;
        this._control1.x = parseInt(this._control1.x);
        this._control1.y = parseInt(this._control1.y)
    }
    this._updatePath();
};

web2d.peer.svg.CurvedLinePeer.prototype.setDestControlPoint = function(control){
    this._customControlPoint_2 = true;
    if(core.Utils.isDefined(control.x)){
        this._control2 = control;
        this._control2.x = parseInt(this._control2.x);
        this._control2.y = parseInt(this._control2.y)
    }
    this._updatePath();
};

web2d.peer.svg.CurvedLinePeer.prototype.isSrcControlPointCustom = function() {
    return this._customControlPoint_1;
};

web2d.peer.svg.CurvedLinePeer.prototype.isDestControlPointCustom = function() {
    return this._customControlPoint_2;
};

web2d.peer.svg.CurvedLinePeer.prototype.setIsSrcControlPointCustom = function(isCustom) {
    this._customControlPoint_1 = isCustom;
};

web2d.peer.svg.CurvedLinePeer.prototype.setIsDestControlPointCustom = function(isCustom) {
    this._customControlPoint_2 = isCustom;
};



web2d.peer.svg.CurvedLinePeer.prototype.getControlPoints = function(){
    return [this._control1, this._control2];
};

web2d.peer.svg.CurvedLinePeer.prototype.setFrom = function(x1, y1)
{
    this._x1 = parseInt(x1);
    this._y1 = parseInt(y1);
    this._updatePath();
};

web2d.peer.svg.CurvedLinePeer.prototype.setTo = function(x2, y2)
{
    this._x2 = parseInt(x2);
    this._y2 = parseInt(y2);
    this._updatePath();
};

web2d.peer.svg.CurvedLinePeer.prototype.getFrom = function()
{
    return new core.Point(this._x1,this._y1);
};

web2d.peer.svg.CurvedLinePeer.prototype.getTo = function()
{
    return new core.Point(this._x2,this._y2);
};

web2d.peer.svg.CurvedLinePeer.prototype.setStrokeWidth = function(width)
{
    this._style['stroke-width']= width;
    this._updateStyle();
};

web2d.peer.svg.CurvedLinePeer.prototype.setColor = function(color)
{
    this._style['stroke']= color;
    this._style['fill']=color;
    this._updateStyle();
};

web2d.peer.svg.CurvedLinePeer.prototype.updateLine = function(avoidControlPointFix){
    this._updatePath(avoidControlPointFix);
};

web2d.peer.svg.CurvedLinePeer.prototype.setLineStyle = function (style){
    this._lineStyle=style;
    if(this._lineStyle){
        this._style['fill']=this._fill;
    } else {
        this._fill = this._style['fill'];
        this._style['fill']='none';
    }
    this._updateStyle();
    this.updateLine();
};

web2d.peer.svg.CurvedLinePeer.prototype.getLineStyle = function (){
    return this._lineStyle;
};


web2d.peer.svg.CurvedLinePeer.prototype.setShowArrow = function(visible){
    this._showArrow =visible;
    this.updateLine();
};

web2d.peer.svg.CurvedLinePeer.prototype.isShowArrow = function(){
    return this._showArrow;
};


web2d.peer.svg.CurvedLinePeer.prototype._updatePath = function(avoidControlPointFix)
{
    this._calculateAutoControlPoints(avoidControlPointFix);
    var x,y, xp, yp;
    if(this._showArrow){
        if(this._control2.y == 0)
            this._control2.y=1;
        var y0 = this._control2.y;
        var x0 = this._control2.x;
        var x2=x0+y0;
        var y2 = y0-x0;
        var x3 = x0-y0;
        var y3 = y0+x0;
        var m = y2/x2;
        var mp = y3/x3;
        var l = 6;
        var pow = Math.pow;
        x = (x2==0?0:Math.sqrt(pow(l,2)/(1+pow(m,2))));
        x *=Math.sign(x2);
        y = (x2==0?l*Math.sign(y2):m*x);
        xp = (x3==0?0:Math.sqrt(pow(l,2)/(1+pow(mp,2))));
        xp *=Math.sign(x3);
        yp = (x3==0?l*Math.sign(y3):mp*xp);
    }
    var path = "M"+this._x1+","+this._y1
             +" C"+(this._control1.x+this._x1)+","+(this._control1.y+this._y1)+" "
                  +(this._control2.x+this._x2)+","+(this._control2.y+this._y2)+" "
                  +this._x2+","+this._y2+
                  (this._lineStyle?" "
                    +(this._control2.x+this._x2)+","+(this._control2.y+this._y2+3)+" "
                    +(this._control1.x+this._x1)+","+(this._control1.y+this._y1+3)+" "
                    +this._x1+","+(this._y1+3)+" Z"
                    :""
                  )+
                  (this._showArrow?" "
                   +"M"+this._x2+","+this._y2+" "
                   +"L"+(x+this._x2)+","+(y+this._y2)
                   +"M"+this._x2+","+this._y2+" "
                   +"L"+(xp+this._x2)+","+(yp+this._y2)
                   :"");
    this._native.setAttribute("d",path);
};

web2d.peer.svg.CurvedLinePeer.prototype._updateStyle = function()
{
    var style = "";
    for(var key in this._style){
        style+=key+":"+this._style[key]+" ";
    }
    this._native.setAttribute("style",style);
};

web2d.peer.svg.CurvedLinePeer.prototype._calculateAutoControlPoints = function(avoidControlPointFix){
    if(core.Utils.isDefined(this._x1) && core.Utils.isDefined(this._x2)){
        //Both points available, calculate real points
        var defaultpoints = core.Utils.calculateDefaultControlPoints(new core.Point(this._x1, this._y1),new core.Point(this._x2,this._y2));
        if(!this._customControlPoint_1 && !(core.Utils.isDefined(avoidControlPointFix) && avoidControlPointFix==0)){
            this._control1.x = defaultpoints[0].x;
            this._control1.y = defaultpoints[0].y;
        }
        if(!this._customControlPoint_2 && !(core.Utils.isDefined(avoidControlPointFix) && avoidControlPointFix==1)){
            this._control2.x = defaultpoints[1].x;
            this._control2.y = defaultpoints[1].y;
        }
    }
};

web2d.peer.svg.CurvedLinePeer.prototype.setDashed = function(length,spacing){
    if(core.Utils.isDefined(length) && core.Utils.isDefined(spacing)){
        this._native.setAttribute("stroke-dasharray",length+","+spacing);
    } else {
        this._native.setAttribute("stroke-dasharray","");
    }

};
