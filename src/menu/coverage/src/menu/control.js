function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.src = null;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength, src) {
        this.position = position;
        this.nodeLength = nodeLength;
        this.src = src;
        return this;
    }

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"src":' + jscoverage_quote(this.src)
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function() {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + this.src;
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + this.src;
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
          message += '\n- '+ conditions[i].message();
    }
    return message;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '{}'
    }
    var json = '';
    for (var line in branchData) {
        if (json !== '')
            json += ','
        json += '"' + line + '":' + convertBranchDataConditionArrayToJSON(branchData[line]);
    }
    return '{' + json + '}';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return {};
    }
    for (var line in jsonObject) {
        var branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (var conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                var condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
            case '\b':
                return '\\b';
            case '\f':
                return '\\f';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\t':
                return '\\t';
            // IE doesn't support this
            /*
             case '\v':
             return '\\v';
             */
            case '"':
                return '\\"';
            case '\\':
                return '\\\\';
            default:
                return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
        }
    }) + '"';
}

function getArrayJSON(coverage) {
    var array = [];
    if (coverage === undefined)
        return array;

    var length = coverage.length;
    for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
            value = 'null';
        }
        array.push(value);
    }
    return array;
}

function jscoverage_serializeCoverageToJSON() {
    var json = [];
    for (var file in _$jscoverage) {
        var lineArray = getArrayJSON(_$jscoverage[file].lineData);
        var fnArray = getArrayJSON(_$jscoverage[file].functionData);

        json.push(jscoverage_quote(file) + ':{"lineData":[' + lineArray.join(',') + '],"functionData":[' + fnArray.join(',') + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage[file].branchData) + '}');
    }
    return '{' + json.join(',') + '}';
}


function jscoverage_pad(s) {
    return '0000'.substr(s.length) + s;
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    this._$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (! this._$jscoverage) {
  this._$jscoverage = {};
}
if (! _$jscoverage['/menu/control.js']) {
  _$jscoverage['/menu/control.js'] = {};
  _$jscoverage['/menu/control.js'].lineData = [];
  _$jscoverage['/menu/control.js'].lineData[6] = 0;
  _$jscoverage['/menu/control.js'].lineData[8] = 0;
  _$jscoverage['/menu/control.js'].lineData[16] = 0;
  _$jscoverage['/menu/control.js'].lineData[26] = 0;
  _$jscoverage['/menu/control.js'].lineData[30] = 0;
  _$jscoverage['/menu/control.js'].lineData[32] = 0;
  _$jscoverage['/menu/control.js'].lineData[41] = 0;
  _$jscoverage['/menu/control.js'].lineData[42] = 0;
  _$jscoverage['/menu/control.js'].lineData[43] = 0;
  _$jscoverage['/menu/control.js'].lineData[44] = 0;
  _$jscoverage['/menu/control.js'].lineData[49] = 0;
  _$jscoverage['/menu/control.js'].lineData[50] = 0;
  _$jscoverage['/menu/control.js'].lineData[54] = 0;
  _$jscoverage['/menu/control.js'].lineData[58] = 0;
  _$jscoverage['/menu/control.js'].lineData[59] = 0;
  _$jscoverage['/menu/control.js'].lineData[61] = 0;
  _$jscoverage['/menu/control.js'].lineData[62] = 0;
  _$jscoverage['/menu/control.js'].lineData[63] = 0;
  _$jscoverage['/menu/control.js'].lineData[65] = 0;
  _$jscoverage['/menu/control.js'].lineData[69] = 0;
  _$jscoverage['/menu/control.js'].lineData[70] = 0;
  _$jscoverage['/menu/control.js'].lineData[71] = 0;
  _$jscoverage['/menu/control.js'].lineData[72] = 0;
  _$jscoverage['/menu/control.js'].lineData[79] = 0;
  _$jscoverage['/menu/control.js'].lineData[82] = 0;
  _$jscoverage['/menu/control.js'].lineData[83] = 0;
  _$jscoverage['/menu/control.js'].lineData[84] = 0;
  _$jscoverage['/menu/control.js'].lineData[85] = 0;
  _$jscoverage['/menu/control.js'].lineData[87] = 0;
  _$jscoverage['/menu/control.js'].lineData[89] = 0;
  _$jscoverage['/menu/control.js'].lineData[108] = 0;
  _$jscoverage['/menu/control.js'].lineData[111] = 0;
  _$jscoverage['/menu/control.js'].lineData[114] = 0;
  _$jscoverage['/menu/control.js'].lineData[115] = 0;
  _$jscoverage['/menu/control.js'].lineData[118] = 0;
  _$jscoverage['/menu/control.js'].lineData[121] = 0;
  _$jscoverage['/menu/control.js'].lineData[122] = 0;
  _$jscoverage['/menu/control.js'].lineData[125] = 0;
  _$jscoverage['/menu/control.js'].lineData[128] = 0;
  _$jscoverage['/menu/control.js'].lineData[132] = 0;
  _$jscoverage['/menu/control.js'].lineData[133] = 0;
  _$jscoverage['/menu/control.js'].lineData[135] = 0;
  _$jscoverage['/menu/control.js'].lineData[139] = 0;
  _$jscoverage['/menu/control.js'].lineData[140] = 0;
  _$jscoverage['/menu/control.js'].lineData[143] = 0;
  _$jscoverage['/menu/control.js'].lineData[144] = 0;
  _$jscoverage['/menu/control.js'].lineData[147] = 0;
  _$jscoverage['/menu/control.js'].lineData[148] = 0;
  _$jscoverage['/menu/control.js'].lineData[150] = 0;
  _$jscoverage['/menu/control.js'].lineData[151] = 0;
  _$jscoverage['/menu/control.js'].lineData[153] = 0;
  _$jscoverage['/menu/control.js'].lineData[154] = 0;
  _$jscoverage['/menu/control.js'].lineData[157] = 0;
  _$jscoverage['/menu/control.js'].lineData[158] = 0;
  _$jscoverage['/menu/control.js'].lineData[160] = 0;
  _$jscoverage['/menu/control.js'].lineData[161] = 0;
  _$jscoverage['/menu/control.js'].lineData[163] = 0;
  _$jscoverage['/menu/control.js'].lineData[164] = 0;
  _$jscoverage['/menu/control.js'].lineData[166] = 0;
  _$jscoverage['/menu/control.js'].lineData[167] = 0;
  _$jscoverage['/menu/control.js'].lineData[172] = 0;
  _$jscoverage['/menu/control.js'].lineData[174] = 0;
  _$jscoverage['/menu/control.js'].lineData[185] = 0;
  _$jscoverage['/menu/control.js'].lineData[188] = 0;
  _$jscoverage['/menu/control.js'].lineData[189] = 0;
  _$jscoverage['/menu/control.js'].lineData[192] = 0;
  _$jscoverage['/menu/control.js'].lineData[193] = 0;
  _$jscoverage['/menu/control.js'].lineData[196] = 0;
  _$jscoverage['/menu/control.js'].lineData[198] = 0;
  _$jscoverage['/menu/control.js'].lineData[199] = 0;
  _$jscoverage['/menu/control.js'].lineData[200] = 0;
  _$jscoverage['/menu/control.js'].lineData[201] = 0;
  _$jscoverage['/menu/control.js'].lineData[205] = 0;
  _$jscoverage['/menu/control.js'].lineData[235] = 0;
  _$jscoverage['/menu/control.js'].lineData[236] = 0;
  _$jscoverage['/menu/control.js'].lineData[237] = 0;
  _$jscoverage['/menu/control.js'].lineData[239] = 0;
}
if (! _$jscoverage['/menu/control.js'].functionData) {
  _$jscoverage['/menu/control.js'].functionData = [];
  _$jscoverage['/menu/control.js'].functionData[0] = 0;
  _$jscoverage['/menu/control.js'].functionData[1] = 0;
  _$jscoverage['/menu/control.js'].functionData[2] = 0;
  _$jscoverage['/menu/control.js'].functionData[3] = 0;
  _$jscoverage['/menu/control.js'].functionData[4] = 0;
  _$jscoverage['/menu/control.js'].functionData[5] = 0;
  _$jscoverage['/menu/control.js'].functionData[6] = 0;
  _$jscoverage['/menu/control.js'].functionData[7] = 0;
  _$jscoverage['/menu/control.js'].functionData[8] = 0;
  _$jscoverage['/menu/control.js'].functionData[9] = 0;
  _$jscoverage['/menu/control.js'].functionData[10] = 0;
}
if (! _$jscoverage['/menu/control.js'].branchData) {
  _$jscoverage['/menu/control.js'].branchData = {};
  _$jscoverage['/menu/control.js'].branchData['30'] = [];
  _$jscoverage['/menu/control.js'].branchData['30'][1] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['30'][2] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['43'] = [];
  _$jscoverage['/menu/control.js'].branchData['43'][1] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['61'] = [];
  _$jscoverage['/menu/control.js'].branchData['61'][1] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['71'] = [];
  _$jscoverage['/menu/control.js'].branchData['71'][1] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['84'] = [];
  _$jscoverage['/menu/control.js'].branchData['84'][1] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['84'][2] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['88'] = [];
  _$jscoverage['/menu/control.js'].branchData['88'][1] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['114'] = [];
  _$jscoverage['/menu/control.js'].branchData['114'][1] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['121'] = [];
  _$jscoverage['/menu/control.js'].branchData['121'][1] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['132'] = [];
  _$jscoverage['/menu/control.js'].branchData['132'][1] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['147'] = [];
  _$jscoverage['/menu/control.js'].branchData['147'][1] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['157'] = [];
  _$jscoverage['/menu/control.js'].branchData['157'][1] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['166'] = [];
  _$jscoverage['/menu/control.js'].branchData['166'][1] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['188'] = [];
  _$jscoverage['/menu/control.js'].branchData['188'][1] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['192'] = [];
  _$jscoverage['/menu/control.js'].branchData['192'][1] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['198'] = [];
  _$jscoverage['/menu/control.js'].branchData['198'][1] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['200'] = [];
  _$jscoverage['/menu/control.js'].branchData['200'][1] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['236'] = [];
  _$jscoverage['/menu/control.js'].branchData['236'][1] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['239'] = [];
  _$jscoverage['/menu/control.js'].branchData['239'][1] = new BranchData();
  _$jscoverage['/menu/control.js'].branchData['239'][2] = new BranchData();
}
_$jscoverage['/menu/control.js'].branchData['239'][2].init(41, 26, 'menuItem && menuItem.el.id');
function visit22_239_2(result) {
  _$jscoverage['/menu/control.js'].branchData['239'][2].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['239'][1].init(124, 32, 'menuItem && menuItem.el.id || \'\'');
function visit21_239_1(result) {
  _$jscoverage['/menu/control.js'].branchData['239'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['236'][1].init(14, 15, 'e.target.isMenu');
function visit20_236_1(result) {
  _$jscoverage['/menu/control.js'].branchData['236'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['200'][1].init(64, 55, 'child.containsElement && child.containsElement(element)');
function visit19_200_1(result) {
  _$jscoverage['/menu/control.js'].branchData['200'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['198'][1].init(368, 9, 'i < count');
function visit18_198_1(result) {
  _$jscoverage['/menu/control.js'].branchData['198'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['192'][1].init(177, 34, 'self.view.containsElement(element)');
function visit17_192_1(result) {
  _$jscoverage['/menu/control.js'].branchData['192'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['188'][1].init(75, 33, '!self.get("visible") || !self.$el');
function visit16_188_1(result) {
  _$jscoverage['/menu/control.js'].branchData['188'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['166'][1].init(2194, 15, 'nextHighlighted');
function visit15_166_1(result) {
  _$jscoverage['/menu/control.js'].branchData['166'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['157'][1].init(43, 16, '!highlightedItem');
function visit14_157_1(result) {
  _$jscoverage['/menu/control.js'].branchData['157'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['147'][1].init(41, 16, '!highlightedItem');
function visit13_147_1(result) {
  _$jscoverage['/menu/control.js'].branchData['147'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['132'][1].init(73, 45, 'highlightedItem = self.get(\'highlightedItem\')');
function visit12_132_1(result) {
  _$jscoverage['/menu/control.js'].branchData['132'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['121'][1].init(456, 9, 'len === 0');
function visit11_121_1(result) {
  _$jscoverage['/menu/control.js'].branchData['121'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['114'][1].init(237, 59, 'highlightedItem && highlightedItem.handleKeyDownInternal(e)');
function visit10_114_1(result) {
  _$jscoverage['/menu/control.js'].branchData['114'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['88'][1].init(259, 10, 'index != o');
function visit9_88_1(result) {
  _$jscoverage['/menu/control.js'].branchData['88'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['84'][2].init(87, 26, 'c.get("visible") !== false');
function visit8_84_2(result) {
  _$jscoverage['/menu/control.js'].branchData['84'][2].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['84'][1].init(64, 50, '!c.get("disabled") && (c.get("visible") !== false)');
function visit7_84_1(result) {
  _$jscoverage['/menu/control.js'].branchData['84'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['71'][1].init(84, 45, 'highlightedItem = this.get(\'highlightedItem\')');
function visit6_71_1(result) {
  _$jscoverage['/menu/control.js'].branchData['71'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['61'][1].init(152, 40, 'rootMenu && rootMenu._popupAutoHideTimer');
function visit5_61_1(result) {
  _$jscoverage['/menu/control.js'].branchData['61'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['43'][1].init(84, 53, '!v && (highlightedItem = this.get(\'highlightedItem\'))');
function visit4_43_1(result) {
  _$jscoverage['/menu/control.js'].branchData['43'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['30'][2].init(228, 36, 'ev && (highlightedItem = ev.prevVal)');
function visit3_30_2(result) {
  _$jscoverage['/menu/control.js'].branchData['30'][2].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].branchData['30'][1].init(223, 41, 'v && ev && (highlightedItem = ev.prevVal)');
function visit2_30_1(result) {
  _$jscoverage['/menu/control.js'].branchData['30'][1].ranCondition(result);
  return result;
}_$jscoverage['/menu/control.js'].lineData[6]++;
KISSY.add("menu/control", function(S, Node, Container, DelegateChildrenExtension, MenuRender, undefined) {
  _$jscoverage['/menu/control.js'].functionData[0]++;
  _$jscoverage['/menu/control.js'].lineData[8]++;
  var KeyCode = Node.KeyCode;
  _$jscoverage['/menu/control.js'].lineData[16]++;
  return Container.extend([DelegateChildrenExtension], {
  isMenu: 1, 
  _onSetHighlightedItem: function(v, ev) {
  _$jscoverage['/menu/control.js'].functionData[1]++;
  _$jscoverage['/menu/control.js'].lineData[26]++;
  var highlightedItem;
  _$jscoverage['/menu/control.js'].lineData[30]++;
  if (visit2_30_1(v && visit3_30_2(ev && (highlightedItem = ev.prevVal)))) {
    _$jscoverage['/menu/control.js'].lineData[32]++;
    highlightedItem.set('highlighted', false, {
  data: {
  byPassSetHighlightedItem: 1}});
  }
}, 
  _onSetVisible: function(v, e) {
  _$jscoverage['/menu/control.js'].functionData[2]++;
  _$jscoverage['/menu/control.js'].lineData[41]++;
  this.callSuper(e);
  _$jscoverage['/menu/control.js'].lineData[42]++;
  var highlightedItem;
  _$jscoverage['/menu/control.js'].lineData[43]++;
  if (visit4_43_1(!v && (highlightedItem = this.get('highlightedItem')))) {
    _$jscoverage['/menu/control.js'].lineData[44]++;
    highlightedItem.set('highlighted', false);
  }
}, 
  bindUI: function() {
  _$jscoverage['/menu/control.js'].functionData[3]++;
  _$jscoverage['/menu/control.js'].lineData[49]++;
  var self = this;
  _$jscoverage['/menu/control.js'].lineData[50]++;
  self.on('afterHighlightedItemChange', afterHighlightedItemChange, self);
}, 
  getRootMenu: function() {
  _$jscoverage['/menu/control.js'].functionData[4]++;
  _$jscoverage['/menu/control.js'].lineData[54]++;
  return this;
}, 
  handleMouseEnterInternal: function(e) {
  _$jscoverage['/menu/control.js'].functionData[5]++;
  _$jscoverage['/menu/control.js'].lineData[58]++;
  this.callSuper(e);
  _$jscoverage['/menu/control.js'].lineData[59]++;
  var rootMenu = this.getRootMenu();
  _$jscoverage['/menu/control.js'].lineData[61]++;
  if (visit5_61_1(rootMenu && rootMenu._popupAutoHideTimer)) {
    _$jscoverage['/menu/control.js'].lineData[62]++;
    clearTimeout(rootMenu._popupAutoHideTimer);
    _$jscoverage['/menu/control.js'].lineData[63]++;
    rootMenu._popupAutoHideTimer = null;
  }
  _$jscoverage['/menu/control.js'].lineData[65]++;
  this.focus();
}, 
  handleBlurInternal: function(e) {
  _$jscoverage['/menu/control.js'].functionData[6]++;
  _$jscoverage['/menu/control.js'].lineData[69]++;
  this.callSuper(e);
  _$jscoverage['/menu/control.js'].lineData[70]++;
  var highlightedItem;
  _$jscoverage['/menu/control.js'].lineData[71]++;
  if (visit6_71_1(highlightedItem = this.get('highlightedItem'))) {
    _$jscoverage['/menu/control.js'].lineData[72]++;
    highlightedItem.set('highlighted', false);
  }
}, 
  _getNextEnabledHighlighted: function(index, dir) {
  _$jscoverage['/menu/control.js'].functionData[7]++;
  _$jscoverage['/menu/control.js'].lineData[79]++;
  var children = this.get("children"), len = children.length, o = index;
  _$jscoverage['/menu/control.js'].lineData[82]++;
  do {
    _$jscoverage['/menu/control.js'].lineData[83]++;
    var c = children[index];
    _$jscoverage['/menu/control.js'].lineData[84]++;
    if (visit7_84_1(!c.get("disabled") && (visit8_84_2(c.get("visible") !== false)))) {
      _$jscoverage['/menu/control.js'].lineData[85]++;
      return children[index];
    }
    _$jscoverage['/menu/control.js'].lineData[87]++;
    index = (index + dir + len) % len;
  } while (visit9_88_1(index != o));
  _$jscoverage['/menu/control.js'].lineData[89]++;
  return undefined;
}, 
  handleKeyDownInternal: function(e) {
  _$jscoverage['/menu/control.js'].functionData[8]++;
  _$jscoverage['/menu/control.js'].lineData[108]++;
  var self = this;
  _$jscoverage['/menu/control.js'].lineData[111]++;
  var highlightedItem = self.get("highlightedItem");
  _$jscoverage['/menu/control.js'].lineData[114]++;
  if (visit10_114_1(highlightedItem && highlightedItem.handleKeyDownInternal(e))) {
    _$jscoverage['/menu/control.js'].lineData[115]++;
    return true;
  }
  _$jscoverage['/menu/control.js'].lineData[118]++;
  var children = self.get("children"), len = children.length;
  _$jscoverage['/menu/control.js'].lineData[121]++;
  if (visit11_121_1(len === 0)) {
    _$jscoverage['/menu/control.js'].lineData[122]++;
    return undefined;
  }
  _$jscoverage['/menu/control.js'].lineData[125]++;
  var index, destIndex, nextHighlighted;
  _$jscoverage['/menu/control.js'].lineData[128]++;
  switch (e.keyCode) {
    case KeyCode.ESC:
      _$jscoverage['/menu/control.js'].lineData[132]++;
      if (visit12_132_1(highlightedItem = self.get('highlightedItem'))) {
        _$jscoverage['/menu/control.js'].lineData[133]++;
        highlightedItem.set('highlighted', false);
      }
      _$jscoverage['/menu/control.js'].lineData[135]++;
      break;
    case KeyCode.HOME:
      _$jscoverage['/menu/control.js'].lineData[139]++;
      nextHighlighted = self._getNextEnabledHighlighted(0, 1);
      _$jscoverage['/menu/control.js'].lineData[140]++;
      break;
    case KeyCode.END:
      _$jscoverage['/menu/control.js'].lineData[143]++;
      nextHighlighted = self._getNextEnabledHighlighted(len - 1, -1);
      _$jscoverage['/menu/control.js'].lineData[144]++;
      break;
    case KeyCode.UP:
      _$jscoverage['/menu/control.js'].lineData[147]++;
      if (visit13_147_1(!highlightedItem)) {
        _$jscoverage['/menu/control.js'].lineData[148]++;
        destIndex = len - 1;
      } else {
        _$jscoverage['/menu/control.js'].lineData[150]++;
        index = S.indexOf(highlightedItem, children);
        _$jscoverage['/menu/control.js'].lineData[151]++;
        destIndex = (index - 1 + len) % len;
      }
      _$jscoverage['/menu/control.js'].lineData[153]++;
      nextHighlighted = self._getNextEnabledHighlighted(destIndex, -1);
      _$jscoverage['/menu/control.js'].lineData[154]++;
      break;
    case KeyCode.DOWN:
      _$jscoverage['/menu/control.js'].lineData[157]++;
      if (visit14_157_1(!highlightedItem)) {
        _$jscoverage['/menu/control.js'].lineData[158]++;
        destIndex = 0;
      } else {
        _$jscoverage['/menu/control.js'].lineData[160]++;
        index = S.indexOf(highlightedItem, children);
        _$jscoverage['/menu/control.js'].lineData[161]++;
        destIndex = (index + 1 + len) % len;
      }
      _$jscoverage['/menu/control.js'].lineData[163]++;
      nextHighlighted = self._getNextEnabledHighlighted(destIndex, 1);
      _$jscoverage['/menu/control.js'].lineData[164]++;
      break;
  }
  _$jscoverage['/menu/control.js'].lineData[166]++;
  if (visit15_166_1(nextHighlighted)) {
    _$jscoverage['/menu/control.js'].lineData[167]++;
    nextHighlighted.set('highlighted', true, {
  data: {
  fromKeyboard: 1}});
    _$jscoverage['/menu/control.js'].lineData[172]++;
    return true;
  } else {
    _$jscoverage['/menu/control.js'].lineData[174]++;
    return undefined;
  }
}, 
  containsElement: function(element) {
  _$jscoverage['/menu/control.js'].functionData[9]++;
  _$jscoverage['/menu/control.js'].lineData[185]++;
  var self = this;
  _$jscoverage['/menu/control.js'].lineData[188]++;
  if (visit16_188_1(!self.get("visible") || !self.$el)) {
    _$jscoverage['/menu/control.js'].lineData[189]++;
    return false;
  }
  _$jscoverage['/menu/control.js'].lineData[192]++;
  if (visit17_192_1(self.view.containsElement(element))) {
    _$jscoverage['/menu/control.js'].lineData[193]++;
    return true;
  }
  _$jscoverage['/menu/control.js'].lineData[196]++;
  var children = self.get('children');
  _$jscoverage['/menu/control.js'].lineData[198]++;
  for (var i = 0, count = children.length; visit18_198_1(i < count); i++) {
    _$jscoverage['/menu/control.js'].lineData[199]++;
    var child = children[i];
    _$jscoverage['/menu/control.js'].lineData[200]++;
    if (visit19_200_1(child.containsElement && child.containsElement(element))) {
      _$jscoverage['/menu/control.js'].lineData[201]++;
      return true;
    }
  }
  _$jscoverage['/menu/control.js'].lineData[205]++;
  return false;
}}, {
  ATTRS: {
  highlightedItem: {
  value: null}, 
  xrender: {
  value: MenuRender}, 
  defaultChildCfg: {
  value: {
  xclass: 'menuitem'}}}, 
  xclass: 'menu'});
  _$jscoverage['/menu/control.js'].lineData[235]++;
  function afterHighlightedItemChange(e) {
    _$jscoverage['/menu/control.js'].functionData[10]++;
    _$jscoverage['/menu/control.js'].lineData[236]++;
    if (visit20_236_1(e.target.isMenu)) {
      _$jscoverage['/menu/control.js'].lineData[237]++;
      var el = this.el, menuItem = e.newVal;
      _$jscoverage['/menu/control.js'].lineData[239]++;
      el.setAttribute("aria-activedescendant", visit21_239_1(visit22_239_2(menuItem && menuItem.el.id) || ''));
    }
  }
}, {
  requires: ['node', 'component/container', 'component/extension/delegate-children', './menu-render']});
