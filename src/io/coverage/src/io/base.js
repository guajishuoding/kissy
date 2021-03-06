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
if (! _$jscoverage['/io/base.js']) {
  _$jscoverage['/io/base.js'] = {};
  _$jscoverage['/io/base.js'].lineData = [];
  _$jscoverage['/io/base.js'].lineData[6] = 0;
  _$jscoverage['/io/base.js'].lineData[7] = 0;
  _$jscoverage['/io/base.js'].lineData[11] = 0;
  _$jscoverage['/io/base.js'].lineData[53] = 0;
  _$jscoverage['/io/base.js'].lineData[55] = 0;
  _$jscoverage['/io/base.js'].lineData[58] = 0;
  _$jscoverage['/io/base.js'].lineData[59] = 0;
  _$jscoverage['/io/base.js'].lineData[60] = 0;
  _$jscoverage['/io/base.js'].lineData[63] = 0;
  _$jscoverage['/io/base.js'].lineData[65] = 0;
  _$jscoverage['/io/base.js'].lineData[69] = 0;
  _$jscoverage['/io/base.js'].lineData[72] = 0;
  _$jscoverage['/io/base.js'].lineData[74] = 0;
  _$jscoverage['/io/base.js'].lineData[75] = 0;
  _$jscoverage['/io/base.js'].lineData[78] = 0;
  _$jscoverage['/io/base.js'].lineData[79] = 0;
  _$jscoverage['/io/base.js'].lineData[81] = 0;
  _$jscoverage['/io/base.js'].lineData[83] = 0;
  _$jscoverage['/io/base.js'].lineData[87] = 0;
  _$jscoverage['/io/base.js'].lineData[89] = 0;
  _$jscoverage['/io/base.js'].lineData[90] = 0;
  _$jscoverage['/io/base.js'].lineData[93] = 0;
  _$jscoverage['/io/base.js'].lineData[94] = 0;
  _$jscoverage['/io/base.js'].lineData[95] = 0;
  _$jscoverage['/io/base.js'].lineData[97] = 0;
  _$jscoverage['/io/base.js'].lineData[98] = 0;
  _$jscoverage['/io/base.js'].lineData[101] = 0;
  _$jscoverage['/io/base.js'].lineData[276] = 0;
  _$jscoverage['/io/base.js'].lineData[278] = 0;
  _$jscoverage['/io/base.js'].lineData[280] = 0;
  _$jscoverage['/io/base.js'].lineData[281] = 0;
  _$jscoverage['/io/base.js'].lineData[284] = 0;
  _$jscoverage['/io/base.js'].lineData[286] = 0;
  _$jscoverage['/io/base.js'].lineData[288] = 0;
  _$jscoverage['/io/base.js'].lineData[341] = 0;
  _$jscoverage['/io/base.js'].lineData[352] = 0;
  _$jscoverage['/io/base.js'].lineData[358] = 0;
  _$jscoverage['/io/base.js'].lineData[359] = 0;
  _$jscoverage['/io/base.js'].lineData[361] = 0;
  _$jscoverage['/io/base.js'].lineData[363] = 0;
  _$jscoverage['/io/base.js'].lineData[364] = 0;
  _$jscoverage['/io/base.js'].lineData[367] = 0;
  _$jscoverage['/io/base.js'].lineData[375] = 0;
  _$jscoverage['/io/base.js'].lineData[383] = 0;
  _$jscoverage['/io/base.js'].lineData[384] = 0;
  _$jscoverage['/io/base.js'].lineData[390] = 0;
  _$jscoverage['/io/base.js'].lineData[391] = 0;
  _$jscoverage['/io/base.js'].lineData[394] = 0;
  _$jscoverage['/io/base.js'].lineData[405] = 0;
  _$jscoverage['/io/base.js'].lineData[412] = 0;
  _$jscoverage['/io/base.js'].lineData[413] = 0;
  _$jscoverage['/io/base.js'].lineData[414] = 0;
  _$jscoverage['/io/base.js'].lineData[418] = 0;
  _$jscoverage['/io/base.js'].lineData[420] = 0;
  _$jscoverage['/io/base.js'].lineData[421] = 0;
  _$jscoverage['/io/base.js'].lineData[424] = 0;
  _$jscoverage['/io/base.js'].lineData[425] = 0;
  _$jscoverage['/io/base.js'].lineData[426] = 0;
  _$jscoverage['/io/base.js'].lineData[429] = 0;
  _$jscoverage['/io/base.js'].lineData[433] = 0;
  _$jscoverage['/io/base.js'].lineData[436] = 0;
  _$jscoverage['/io/base.js'].lineData[438] = 0;
  _$jscoverage['/io/base.js'].lineData[454] = 0;
  _$jscoverage['/io/base.js'].lineData[464] = 0;
  _$jscoverage['/io/base.js'].lineData[472] = 0;
  _$jscoverage['/io/base.js'].lineData[481] = 0;
  _$jscoverage['/io/base.js'].lineData[485] = 0;
}
if (! _$jscoverage['/io/base.js'].functionData) {
  _$jscoverage['/io/base.js'].functionData = [];
  _$jscoverage['/io/base.js'].functionData[0] = 0;
  _$jscoverage['/io/base.js'].functionData[1] = 0;
  _$jscoverage['/io/base.js'].functionData[2] = 0;
  _$jscoverage['/io/base.js'].functionData[3] = 0;
  _$jscoverage['/io/base.js'].functionData[4] = 0;
  _$jscoverage['/io/base.js'].functionData[5] = 0;
  _$jscoverage['/io/base.js'].functionData[6] = 0;
  _$jscoverage['/io/base.js'].functionData[7] = 0;
  _$jscoverage['/io/base.js'].functionData[8] = 0;
}
if (! _$jscoverage['/io/base.js'].branchData) {
  _$jscoverage['/io/base.js'].branchData = {};
  _$jscoverage['/io/base.js'].branchData['16'] = [];
  _$jscoverage['/io/base.js'].branchData['16'][1] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['20'] = [];
  _$jscoverage['/io/base.js'].branchData['20'][1] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['63'] = [];
  _$jscoverage['/io/base.js'].branchData['63'][1] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['74'] = [];
  _$jscoverage['/io/base.js'].branchData['74'][1] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['81'] = [];
  _$jscoverage['/io/base.js'].branchData['81'][1] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['81'][2] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['81'][3] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['87'] = [];
  _$jscoverage['/io/base.js'].branchData['87'][1] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['89'] = [];
  _$jscoverage['/io/base.js'].branchData['89'][1] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['93'] = [];
  _$jscoverage['/io/base.js'].branchData['93'][1] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['94'] = [];
  _$jscoverage['/io/base.js'].branchData['94'][1] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['97'] = [];
  _$jscoverage['/io/base.js'].branchData['97'][1] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['280'] = [];
  _$jscoverage['/io/base.js'].branchData['280'][1] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['297'] = [];
  _$jscoverage['/io/base.js'].branchData['297'][1] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['358'] = [];
  _$jscoverage['/io/base.js'].branchData['358'][1] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['363'] = [];
  _$jscoverage['/io/base.js'].branchData['363'][1] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['377'] = [];
  _$jscoverage['/io/base.js'].branchData['377'][1] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['378'] = [];
  _$jscoverage['/io/base.js'].branchData['378'][1] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['390'] = [];
  _$jscoverage['/io/base.js'].branchData['390'][1] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['390'][2] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['412'] = [];
  _$jscoverage['/io/base.js'].branchData['412'][1] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['412'][2] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['424'] = [];
  _$jscoverage['/io/base.js'].branchData['424'][1] = new BranchData();
  _$jscoverage['/io/base.js'].branchData['425'] = [];
  _$jscoverage['/io/base.js'].branchData['425'][1] = new BranchData();
}
_$jscoverage['/io/base.js'].branchData['425'][1].init(31, 12, 'e.stack || e');
function visit24_425_1(result) {
  _$jscoverage['/io/base.js'].branchData['425'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['424'][1].init(75, 14, 'self.state < 2');
function visit23_424_1(result) {
  _$jscoverage['/io/base.js'].branchData['424'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['412'][2].init(3640, 11, 'timeout > 0');
function visit22_412_2(result) {
  _$jscoverage['/io/base.js'].branchData['412'][2].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['412'][1].init(3629, 22, 'c.async && timeout > 0');
function visit21_412_1(result) {
  _$jscoverage['/io/base.js'].branchData['412'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['390'][2].init(3122, 45, 'c.beforeSend.call(context, self, c) === false');
function visit20_390_2(result) {
  _$jscoverage['/io/base.js'].branchData['390'][2].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['390'][1].init(3104, 64, 'c.beforeSend && (c.beforeSend.call(context, self, c) === false)');
function visit19_390_1(result) {
  _$jscoverage['/io/base.js'].branchData['390'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['378'][1].init(71, 16, 'dataType === \'*\'');
function visit18_378_1(result) {
  _$jscoverage['/io/base.js'].branchData['378'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['377'][1].init(58, 29, 'dataType && accepts[dataType]');
function visit17_377_1(result) {
  _$jscoverage['/io/base.js'].branchData['377'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['363'][1].init(2240, 13, 'c.contentType');
function visit16_363_1(result) {
  _$jscoverage['/io/base.js'].branchData['363'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['358'][1].init(2087, 44, 'transports[c.dataType[0]] || transports[\'*\']');
function visit15_358_1(result) {
  _$jscoverage['/io/base.js'].branchData['358'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['297'][1].init(260, 7, 'c || {}');
function visit14_297_1(result) {
  _$jscoverage['/io/base.js'].branchData['297'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['280'][1].init(44, 21, '!(self instanceof IO)');
function visit13_280_1(result) {
  _$jscoverage['/io/base.js'].branchData['280'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['97'][1].init(111, 17, 'c.cache === false');
function visit12_97_1(result) {
  _$jscoverage['/io/base.js'].branchData['97'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['94'][1].init(18, 6, 'c.data');
function visit11_94_1(result) {
  _$jscoverage['/io/base.js'].branchData['94'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['93'][1].init(1109, 13, '!c.hasContent');
function visit10_93_1(result) {
  _$jscoverage['/io/base.js'].branchData['93'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['89'][1].init(987, 62, '!(\'cache\' in c) && S.inArray(dataType[0], [\'script\', \'jsonp\'])');
function visit9_89_1(result) {
  _$jscoverage['/io/base.js'].branchData['89'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['87'][1].init(940, 15, 'dataType || \'*\'');
function visit8_87_1(result) {
  _$jscoverage['/io/base.js'].branchData['87'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['81'][3].init(708, 23, 'typeof data != \'string\'');
function visit7_81_3(result) {
  _$jscoverage['/io/base.js'].branchData['81'][3].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['81'][2].init(690, 41, '(data = c.data) && typeof data != \'string\'');
function visit6_81_2(result) {
  _$jscoverage['/io/base.js'].branchData['81'][2].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['81'][1].init(672, 59, 'c.processData && (data = c.data) && typeof data != \'string\'');
function visit5_81_1(result) {
  _$jscoverage['/io/base.js'].branchData['81'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['74'][1].init(455, 21, '!(\'crossDomain\' in c)');
function visit4_74_1(result) {
  _$jscoverage['/io/base.js'].branchData['74'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['63'][1].init(208, 12, 'context || c');
function visit3_63_1(result) {
  _$jscoverage['/io/base.js'].branchData['63'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['20'][1].init(470, 71, 'simulatedLocation && rlocalProtocol.test(simulatedLocation.getScheme())');
function visit2_20_1(result) {
  _$jscoverage['/io/base.js'].branchData['20'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].branchData['16'][1].init(327, 18, 'win.location || {}');
function visit1_16_1(result) {
  _$jscoverage['/io/base.js'].branchData['16'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/base.js'].lineData[6]++;
KISSY.add('io/base', function(S, CustomEvent, undefined) {
  _$jscoverage['/io/base.js'].functionData[0]++;
  _$jscoverage['/io/base.js'].lineData[7]++;
  var rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|widget)$/, rspace = /\s+/, logger = S.getLogger('s/io'), mirror = function(s) {
  _$jscoverage['/io/base.js'].functionData[1]++;
  _$jscoverage['/io/base.js'].lineData[11]++;
  return s;
}, Promise = S.Promise, rnoContent = /^(?:GET|HEAD)$/, win = S.Env.host, location = visit1_16_1(win.location || {}), simulatedLocation = new S.Uri(location.href), isLocal = visit2_20_1(simulatedLocation && rlocalProtocol.test(simulatedLocation.getScheme())), transports = {}, defaultConfig = {
  type: 'GET', 
  contentType: 'application/x-www-form-urlencoded; charset=UTF-8', 
  async: true, 
  serializeArray: true, 
  processData: true, 
  accepts: {
  xml: 'application/xml, text/xml', 
  html: 'text/html', 
  text: 'text/plain', 
  json: 'application/json, text/javascript', 
  '*': '*/*'}, 
  converters: {
  text: {
  json: S.parseJson, 
  html: mirror, 
  text: mirror, 
  xml: S.parseXML}}, 
  headers: {
  'X-Requested-With': 'XMLHttpRequest'}, 
  contents: {
  xml: /xml/, 
  html: /html/, 
  json: /json/}};
  _$jscoverage['/io/base.js'].lineData[53]++;
  defaultConfig.converters.html = defaultConfig.converters.text;
  _$jscoverage['/io/base.js'].lineData[55]++;
  function setUpConfig(c) {
    _$jscoverage['/io/base.js'].functionData[2]++;
    _$jscoverage['/io/base.js'].lineData[58]++;
    var context = c.context;
    _$jscoverage['/io/base.js'].lineData[59]++;
    delete c.context;
    _$jscoverage['/io/base.js'].lineData[60]++;
    c = S.mix(S.clone(defaultConfig), c, {
  deep: true});
    _$jscoverage['/io/base.js'].lineData[63]++;
    c.context = visit3_63_1(context || c);
    _$jscoverage['/io/base.js'].lineData[65]++;
    var data, uri, type = c.type, dataType = c.dataType;
    _$jscoverage['/io/base.js'].lineData[69]++;
    uri = c.uri = simulatedLocation.resolve(c.url);
    _$jscoverage['/io/base.js'].lineData[72]++;
    c.uri.setQuery('');
    _$jscoverage['/io/base.js'].lineData[74]++;
    if (visit4_74_1(!('crossDomain' in c))) {
      _$jscoverage['/io/base.js'].lineData[75]++;
      c.crossDomain = !c.uri.isSameOriginAs(simulatedLocation);
    }
    _$jscoverage['/io/base.js'].lineData[78]++;
    type = c.type = type.toUpperCase();
    _$jscoverage['/io/base.js'].lineData[79]++;
    c.hasContent = !rnoContent.test(type);
    _$jscoverage['/io/base.js'].lineData[81]++;
    if (visit5_81_1(c.processData && visit6_81_2((data = c.data) && visit7_81_3(typeof data != 'string')))) {
      _$jscoverage['/io/base.js'].lineData[83]++;
      c.data = S.param(data, undefined, undefined, c.serializeArray);
    }
    _$jscoverage['/io/base.js'].lineData[87]++;
    dataType = c.dataType = S.trim(visit8_87_1(dataType || '*')).split(rspace);
    _$jscoverage['/io/base.js'].lineData[89]++;
    if (visit9_89_1(!('cache' in c) && S.inArray(dataType[0], ['script', 'jsonp']))) {
      _$jscoverage['/io/base.js'].lineData[90]++;
      c.cache = false;
    }
    _$jscoverage['/io/base.js'].lineData[93]++;
    if (visit10_93_1(!c.hasContent)) {
      _$jscoverage['/io/base.js'].lineData[94]++;
      if (visit11_94_1(c.data)) {
        _$jscoverage['/io/base.js'].lineData[95]++;
        uri.query.add(S.unparam(c.data));
      }
      _$jscoverage['/io/base.js'].lineData[97]++;
      if (visit12_97_1(c.cache === false)) {
        _$jscoverage['/io/base.js'].lineData[98]++;
        uri.query.set('_ksTS', (S.now() + '_' + S.guid()));
      }
    }
    _$jscoverage['/io/base.js'].lineData[101]++;
    return c;
  }
  _$jscoverage['/io/base.js'].lineData[276]++;
  function IO(c) {
    _$jscoverage['/io/base.js'].functionData[3]++;
    _$jscoverage['/io/base.js'].lineData[278]++;
    var self = this;
    _$jscoverage['/io/base.js'].lineData[280]++;
    if (visit13_280_1(!(self instanceof IO))) {
      _$jscoverage['/io/base.js'].lineData[281]++;
      return new IO(c);
    }
    _$jscoverage['/io/base.js'].lineData[284]++;
    Promise.call(self);
    _$jscoverage['/io/base.js'].lineData[286]++;
    c = setUpConfig(c);
    _$jscoverage['/io/base.js'].lineData[288]++;
    S.mix(self, {
  responseData: null, 
  config: visit14_297_1(c || {}), 
  timeoutTimer: null, 
  responseText: null, 
  responseXML: null, 
  responseHeadersString: '', 
  responseHeaders: null, 
  requestHeaders: {}, 
  readyState: 0, 
  state: 0, 
  statusText: null, 
  status: 0, 
  transport: null, 
  _defer: new S.Defer(this)});
    _$jscoverage['/io/base.js'].lineData[341]++;
    var transportConstructor, transport;
    _$jscoverage['/io/base.js'].lineData[352]++;
    IO.fire('start', {
  ajaxConfig: c, 
  io: self});
    _$jscoverage['/io/base.js'].lineData[358]++;
    transportConstructor = visit15_358_1(transports[c.dataType[0]] || transports['*']);
    _$jscoverage['/io/base.js'].lineData[359]++;
    transport = new transportConstructor(self);
    _$jscoverage['/io/base.js'].lineData[361]++;
    self.transport = transport;
    _$jscoverage['/io/base.js'].lineData[363]++;
    if (visit16_363_1(c.contentType)) {
      _$jscoverage['/io/base.js'].lineData[364]++;
      self.setRequestHeader('Content-Type', c.contentType);
    }
    _$jscoverage['/io/base.js'].lineData[367]++;
    var dataType = c.dataType[0], i, timeout = c.timeout, context = c.context, headers = c.headers, accepts = c.accepts;
    _$jscoverage['/io/base.js'].lineData[375]++;
    self.setRequestHeader('Accept', visit17_377_1(dataType && accepts[dataType]) ? accepts[dataType] + (visit18_378_1(dataType === '*') ? '' : ', */*; q=0.01') : accepts['*']);
    _$jscoverage['/io/base.js'].lineData[383]++;
    for (i in headers) {
      _$jscoverage['/io/base.js'].lineData[384]++;
      self.setRequestHeader(i, headers[i]);
    }
    _$jscoverage['/io/base.js'].lineData[390]++;
    if (visit19_390_1(c.beforeSend && (visit20_390_2(c.beforeSend.call(context, self, c) === false)))) {
      _$jscoverage['/io/base.js'].lineData[391]++;
      return self;
    }
    _$jscoverage['/io/base.js'].lineData[394]++;
    self.readyState = 1;
    _$jscoverage['/io/base.js'].lineData[405]++;
    IO.fire('send', {
  ajaxConfig: c, 
  io: self});
    _$jscoverage['/io/base.js'].lineData[412]++;
    if (visit21_412_1(c.async && visit22_412_2(timeout > 0))) {
      _$jscoverage['/io/base.js'].lineData[413]++;
      self.timeoutTimer = setTimeout(function() {
  _$jscoverage['/io/base.js'].functionData[4]++;
  _$jscoverage['/io/base.js'].lineData[414]++;
  self.abort('timeout');
}, timeout * 1000);
    }
    _$jscoverage['/io/base.js'].lineData[418]++;
    try {
      _$jscoverage['/io/base.js'].lineData[420]++;
      self.state = 1;
      _$jscoverage['/io/base.js'].lineData[421]++;
      transport.send();
    }    catch (e) {
  _$jscoverage['/io/base.js'].lineData[424]++;
  if (visit23_424_1(self.state < 2)) {
    _$jscoverage['/io/base.js'].lineData[425]++;
    logger.error(visit24_425_1(e.stack || e));
    _$jscoverage['/io/base.js'].lineData[426]++;
    self._ioReady(-1, e.message);
  } else {
    _$jscoverage['/io/base.js'].lineData[429]++;
    S.error(e);
  }
}
    _$jscoverage['/io/base.js'].lineData[433]++;
    return self;
  }
  _$jscoverage['/io/base.js'].lineData[436]++;
  S.mix(IO, CustomEvent.targetObject);
  _$jscoverage['/io/base.js'].lineData[438]++;
  S.mix(IO, {
  isLocal: isLocal, 
  setupConfig: function(setting) {
  _$jscoverage['/io/base.js'].functionData[5]++;
  _$jscoverage['/io/base.js'].lineData[454]++;
  S.mix(defaultConfig, setting, {
  deep: true});
}, 
  'setupTransport': function(name, fn) {
  _$jscoverage['/io/base.js'].functionData[6]++;
  _$jscoverage['/io/base.js'].lineData[464]++;
  transports[name] = fn;
}, 
  'getTransport': function(name) {
  _$jscoverage['/io/base.js'].functionData[7]++;
  _$jscoverage['/io/base.js'].lineData[472]++;
  return transports[name];
}, 
  getConfig: function() {
  _$jscoverage['/io/base.js'].functionData[8]++;
  _$jscoverage['/io/base.js'].lineData[481]++;
  return defaultConfig;
}});
  _$jscoverage['/io/base.js'].lineData[485]++;
  return IO;
}, {
  requires: ['event/custom']});
