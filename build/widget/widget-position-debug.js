YUI.add('widget-position', function(Y) {

/**
 * @module widget-position
 */
    var Lang = Y.Lang,
        Widget = Y.Widget,

        POSITION = "position",
        XY_COORD = "xy",

        POSITIONED = "positioned",
        BOUNDING_BOX = "boundingBox",

        RENDERUI = "renderUI",
        BINDUI = "bindUI",
        SYNCUI = "syncUI",

        UI = Widget.UI_SRC,

        PositionChange = "positionChange",
        XYChange = "xyChange";

    /**
     * Widget extension, which can be used to add positioning support to the base Widget class.
     * 
     * @class WidgetPosition
     * @param Object config User configuration
     */
    function Position(config) {
        this._posNode = this.get(BOUNDING_BOX);

        // WIDGET METHOD OVERLAP
        Y.after(this._renderUIPosition, this, RENDERUI);
        Y.after(this._syncUIPosition, this, SYNCUI);
        Y.after(this._bindUIPosition, this, BINDUI);
    }

    /**
     * Static property used to define the default attribute 
     * configuration introduced by WidgetPosition.
     * 
     * @property WidgetPosition.ATTRS
     */
    Position.ATTRS = {

        /**
         * @attribute x
         * @type number
         * @default 0
         *
         * @description Page X co-ordinate for the widget. This attribute acts as a facade for the 
         * xy attribute. Changes in position can be monitored by listening for xyChange events.
         */
        x: {
            set: function(val) {
                this._setX(val);
            },
            get: function() {
                return this._getX();
            }
        },

        /**
         * @attribute y
         * @type number
         * @default 0
         *
         * @description Page Y co-ordinate for the widget. This attribute acts as a facade for the 
         * xy attribute. Changes in position can be monitored by listening for xyChange events.
         */
        y: {
            set: function(val) {
                this._setY(val);
            },
            get: function() {
                return this._getY();
            }
        },

        /**
         * @attribute xy
         * @type Array
         * @default [0,0]
         *
         * @description Page XY co-ordinate pair for the widget.
         */
        xy: {
            value:[0,0],
            validator: function(val) {
                return this._validateXY(val);
            }
        },

        /**
         * @attribute position
         * @type string
         * @default "absolute.
         *
         * @description The position value for the Widget.
         */
        position: {
            value:"absolute"
        }
    };

    /**
     * Default class used to mark the boundingBox of a positioned widget.
     *
     * @property WidgetStack.POSITIONED_CLASS
     * @type String
     * @default "yui-widget-positioned"
     */
    Position.POSITIONED_CLASS = Widget.getClassName(POSITIONED);

    Position.prototype = {

        /**
         * Creates/Initializes the DOM to support xy page positioning.
         *
         * This method in invoked after renderUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         *
         * @method _renderUIPosition
         * @protected
         */
        _renderUIPosition : function() {
            this._posNode.addClass(Position.POSITIONED_CLASS);
        },

        /**
         * Synchronizes the UI to match the Widgets xy page position state.
         * 
         * This method in invoked after syncUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         * 
         * @method _syncUIPosition
         * @protected
         */
        _syncUIPosition : function() {
            this._uiSetPosition(this.get(POSITION));
            this._uiSetXY(this.get(XY_COORD));
        },

        /**
         * Binds event listeners responsible for updating the UI state in response to 
         * Widget position related state changes.
         *
         * This method in invoked after bindUI is invoked for the Widget class
         * using YUI's aop infrastructure.
         *
         * @method _bindUIPosition
         * @protected
         */
        _bindUIPosition :function() {
            this.after(PositionChange, this._onPositionChange);
            this.after(XYChange, this._onXYChange);
        },

        /**
         * Moves the Widget to the specified page xy co-ordinate position.
         *
         * @method move
         *
         * @param {Number} x The new x position
         * @param {Number} y The new y position
         * <p>Or</p>
         * @param {Array} x, y values passed as an array (x = index 0, y = index 1), to support
         * simple pass through of Y.Node.getXY results
         */
        move: function () {
            var args = arguments,
                coord = (Lang.isArray(args[0])) ? args[0] : [args[0], args[1]];
                this.set(XY_COORD, coord);
        },

        /**
         * Synchronizes the Panel's "xy", "x", and "y" properties with the 
         * Widget's position in the DOM.
         *
         * @method syncXY
         */
        syncXY : function () {
            this.set(XY_COORD, this._posNode.getXY(), {src: UI});
        },

        /**
         * Default validator for the XY attribute
         *
         * @method _validateXY
         * @param {Array} val The XY page co-ordinate value which is being set.
         */
        _validateXY : function(val) {
            return (Lang.isArray(val) && Lang.isNumber(val[0]) && Lang.isNumber(val[1]));
        },

        /**
         * Default setter for the X attribute. The setter passes the X value through
         * to the XY attribute, which is the sole store for the XY state.
         *
         * @method _setX
         * @param {Number} val The X page co-ordinate value
         */
        _setX : function(val) {
            this.set(XY_COORD, [val, this.get(XY_COORD)[0]]);
        },

        /**
         * Default setter for the Y attribute. The setter passes the Y value through
         * to the XY attribute, which is the sole store for the XY state.
         *
         * @method _setY
         * @param {Number} val The Y page co-ordinate value
         */
        _setY : function(val) {
            this.set(XY_COORD, [this.get(XY_COORD)[1], val]);
        },

        /**
         * Default getter for the X attribute. The value is retrieved from 
         * the XY attribute, which is the sole store for the XY state.
         *
         * @method _getX
         * @return {Number} The X page co-ordinate value
         */
        _getX : function() {
            return this.get(XY_COORD)[0];
        },

        /**
         * Default getter for the Y attribute. The value is retrieved from 
         * the XY attribute, which is the sole store for the XY state.
         *
         * @method _getY
         * @return {Number} The Y page co-ordinate value
         */
        _getY : function() {
            return this.get(XY_COORD)[1];
        },

        /**
         * Default attribute change listener for the position attribute, responsible
         * for updating the UI, in response to attribute changes.
         * 
         * @method _onPositionChange
         * @protected
         * @param {Event.Facade} e The Event Facade object.
         */
        _onPositionChange : function(e) {
            this._uiSetPosition(e.newVal);
        },

        /**
         * Default attribute change listener for the xy attribute, responsible
         * for updating the UI, in response to attribute changes.
         * 
         * @method _onXYChange
         * @protected
         * @param {Event.Facade} e The Event Facade object.
         */
        _onXYChange : function(e) {
            if (e.src != UI) {
                this._uiSetXY(e.newVal);
            }
        },

        /**
         * Updates the UI to reflect the position value passed in.
         * @method _uiSetPosition
         * @protected
         * @param {String} val The position value to be reflected in the UI
         */
        _uiSetPosition : function(val) {
            this._posNode.setStyle(POSITION, val);
        },

        /**
         * Updates the UI to reflect the XY page co-ordinates passed in.
         * 
         * @method _uiSetXY
         * @protected
         * @param {String} val The XY page co-ordinates value to be reflected in the UI
         */
        _uiSetXY : function(val) {
            this._posNode.setXY(val);
        }
    };

    Y.WidgetPosition = Position;



}, '@VERSION@' ,{requires:['widget']});