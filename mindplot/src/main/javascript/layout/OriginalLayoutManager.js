/*
 *    Copyright [2011] [wisemapping]
 *
 *   Licensed under WiseMapping Public License, Version 1.0 (the "License").
 *   It is basically the Apache License, Version 2.0 (the "License") plus the
 *   "powered by wisemapping" text requirement on every single page;
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the license at
 *
 *       http://www.wisemapping.org/license
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

mindplot.layout.OriginalLayoutManager = new Class({
    Extends:mindplot.layout.BaseLayoutManager,
    options:{

    },
    initialize:function(designer, options) {
        this.parent(designer, options);

    },

    prepareNode:function(node, children) {
        // Sort children by order to solve adding order in for OriginalLayoutManager...
        var nodesByOrder = new Hash();
        var maxOrder = 0;
        var result = [];
        if (children.length > 0) {
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var order = child.getOrder();
                if (!$defined(order)) {
                    order = ++maxOrder;
                    child.setOrder(order);
                }

                if (nodesByOrder.has(order)) {
                    if (Math.sign(child.getPosition().x) == Math.sign(nodesByOrder.get(order).getPosition().x)) {
                        //duplicated order. Change order to next available.
                        order = ++maxOrder;
                        child.setOrder(order);
                    }
                } else {
                    nodesByOrder.set(order, child);
                    if (order > maxOrder)
                        maxOrder = order;
                }
                result[order] = child;
            }
        }
        nodesByOrder = null;
        return node.getTopicType() != mindplot.model.INodeModel.CENTRAL_TOPIC_TYPE ? result : children;
    },

    _nodeResizeEvent:function(node) {

    },

    _nodeRepositionateEvent:function(node) {
        this.getTopicBoardForTopic(node).repositionate();
    },

    getDragTopicPositioner : function() {
        return this._dragTopicPositioner;
    },



    _createMainTopicBoard:function(node) {
        return new mindplot.layout.boards.original.MainTopicBoard(node, this);
    },

    _createCentralTopicBoard:function(node) {
        return new mindplot.layout.boards.original.CentralTopicBoard(node, this);
    },

    getClassName:function() {
        return mindplot.layout.OriginalLayoutManager.NAME;
    }
});

mindplot.layout.OriginalLayoutManager.NAME = "OriginalLayoutManager";