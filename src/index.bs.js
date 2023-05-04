// Generated by ReScript, PLEASE EDIT WITH CARE

import * as $$String from "rescript/lib/es6/string.js";
import * as Belt_List from "rescript/lib/es6/belt_List.js";
import * as Utilities from "./utilities.bs.js";
import * as Caml_exceptions from "rescript/lib/es6/caml_exceptions.js";
import * as Caml_js_exceptions from "rescript/lib/es6/caml_js_exceptions.js";

function bracketAsString(bracket) {
  if (bracket) {
    return "square";
  } else {
    return "round";
  }
}

function stringAsSource(s) {
  return {
          srcloc: {
            ln: 0,
            ch: 0
          },
          i: 0,
          content: s
        };
}

function advance(srcloc, $$char) {
  var ln = srcloc.ln;
  if ($$char === "\n") {
    return {
            ln: ln + 1 | 0,
            ch: 0
          };
  } else {
    return {
            ln: ln,
            ch: srcloc.ch + 1 | 0
          };
  }
}

function caseSource(source) {
  var content = source.content;
  var i = source.i;
  if (i >= content.length) {
    return ;
  }
  var ch = content[i];
  var srcloc = advance(source.srcloc, ch);
  return [
          ch,
          {
            srcloc: srcloc,
            i: i + 1 | 0,
            content: content
          }
        ];
}

var ParseError = /* @__PURE__ */Caml_exceptions.create("Index.ParseError");

function parseErrorAsString(err) {
  if (typeof err === "number") {
    if (err === /* WantListFoundEOF */0) {
      return "Reached the end of the file while processing a list.";
    } else {
      return "Reached the end of the file while processing a string.";
    }
  } else if (err.TAG === /* WantEscapableCharFound */0) {
    return "Found an unexpected escape sequence (\\" + err._0 + ").";
  } else {
    return "Found a closing " + (
            err._1 ? "square" : "round"
          ) + " bracket but this list starts with a " + (
            err._0 ? "square" : "round"
          ) + " bracket.";
  }
}

function parseSymbol(start, firstCh, src) {
  var _cs = {
    hd: firstCh,
    tl: /* [] */0
  };
  var _src = src;
  while(true) {
    var src$1 = _src;
    var cs = _cs;
    var end = (function(cs,src$1){
    return function end(param) {
      var e = {
        TAG: /* Atom */0,
        _0: {
          TAG: /* Sym */1,
          _0: $$String.concat("", Belt_List.reverse(cs))
        }
      };
      return [
              Utilities.annotate(e, start, src$1.srcloc),
              src$1
            ];
    }
    }(cs,src$1));
    var match = caseSource(src$1);
    if (match === undefined) {
      return end(undefined);
    }
    var chr = match[0];
    switch (chr) {
      case "(" :
      case ")" :
      case "[" :
      case "\"" :
      case "]" :
          return end(undefined);
      default:
        if (/\s+/ig.test(chr)) {
          return end(undefined);
        }
        _src = match[1];
        _cs = {
          hd: chr,
          tl: cs
        };
        continue ;
    }
  };
}

function parseString(start, src) {
  var loop = function (_cs, _src) {
    while(true) {
      var src = _src;
      var cs = _cs;
      var match = caseSource(src);
      if (match !== undefined) {
        var chr = match[0];
        if (chr === "\"") {
          var src$1 = match[1];
          var e = {
            TAG: /* Atom */0,
            _0: {
              TAG: /* Str */0,
              _0: $$String.concat("", Belt_List.reverse(cs))
            }
          };
          return [
                  Utilities.annotate(e, start, src$1.srcloc),
                  src$1
                ];
        }
        var src$2 = match[1];
        if (chr === "\\") {
          var match$1 = caseSource(src$2);
          if (match$1 !== undefined) {
            var src$3 = match$1[1];
            var chr$1 = match$1[0];
            switch (chr$1) {
              case "\"" :
                  return loop({
                              hd: "\"",
                              tl: cs
                            }, src$3);
              case "n" :
                  return loop({
                              hd: "\n",
                              tl: cs
                            }, src$3);
              case "r" :
                  return loop({
                              hd: "\r",
                              tl: cs
                            }, src$3);
              case "t" :
                  return loop({
                              hd: "\t",
                              tl: cs
                            }, src$3);
              default:
                if (chr$1 === "\\") {
                  return loop({
                              hd: "\\",
                              tl: cs
                            }, src$3);
                }
                throw {
                      RE_EXN_ID: ParseError,
                      _1: {
                        TAG: /* WantEscapableCharFound */0,
                        _0: chr$1
                      },
                      Error: new Error()
                    };
            }
          } else {
            throw {
                  RE_EXN_ID: ParseError,
                  _1: /* WantStringFoundEOF */1,
                  Error: new Error()
                };
          }
        }
        _src = src$2;
        _cs = {
          hd: chr,
          tl: cs
        };
        continue ;
      }
      throw {
            RE_EXN_ID: ParseError,
            _1: /* WantStringFoundEOF */1,
            Error: new Error()
          };
    };
  };
  return loop(/* [] */0, src);
}

var EOF = /* @__PURE__ */Caml_exceptions.create("Index.EOF");

var WantSExprFoundRP = /* @__PURE__ */Caml_exceptions.create("Index.WantSExprFoundRP");

function parseOne(_src) {
  while(true) {
    var src = _src;
    var start = src.srcloc;
    var match = caseSource(src);
    if (match !== undefined) {
      var chr = match[0];
      switch (chr) {
        case "(" :
            return startParseList(/* Round */0, start, match[1]);
        case ")" :
            throw {
                  RE_EXN_ID: WantSExprFoundRP,
                  _1: /* Round */0,
                  _2: match[1],
                  Error: new Error()
                };
        case "[" :
            return startParseList(/* Square */1, start, match[1]);
        case "\"" :
            return parseString(start, match[1]);
        case "]" :
            throw {
                  RE_EXN_ID: WantSExprFoundRP,
                  _1: /* Square */1,
                  _2: match[1],
                  Error: new Error()
                };
        default:
          var src$1 = match[1];
          if (!/\s+/ig.test(chr)) {
            return parseSymbol(start, chr, src$1);
          }
          _src = src$1;
          continue ;
      }
    } else {
      throw {
            RE_EXN_ID: EOF,
            Error: new Error()
          };
    }
  };
}

function startParseList(bracket1, start, src) {
  var _elms = /* [] */0;
  var _src = src;
  while(true) {
    var src$1 = _src;
    var elms = _elms;
    var val;
    try {
      val = parseOne(src$1);
    }
    catch (raw_exn){
      var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
      if (exn.RE_EXN_ID === EOF) {
        throw {
              RE_EXN_ID: ParseError,
              _1: /* WantListFoundEOF */0,
              Error: new Error()
            };
      }
      if (exn.RE_EXN_ID === WantSExprFoundRP) {
        var bracket2 = exn._1;
        if (bracket1 === bracket2) {
          var src$2 = exn._2;
          var e_1 = Belt_List.reverse(elms);
          var e = {
            TAG: /* List */1,
            _0: bracket1,
            _1: e_1
          };
          return [
                  Utilities.annotate(e, start, src$2.srcloc),
                  src$2
                ];
        }
        throw {
              RE_EXN_ID: ParseError,
              _1: {
                TAG: /* MismatchedBracket */1,
                _0: bracket1,
                _1: bracket2
              },
              Error: new Error()
            };
      }
      throw exn;
    }
    _src = val[1];
    _elms = {
      hd: val[0],
      tl: elms
    };
    continue ;
  };
}

function parseMany(src) {
  var _elms = /* [] */0;
  var _src = src;
  while(true) {
    var src$1 = _src;
    var elms = _elms;
    var val;
    try {
      val = parseOne(src$1);
    }
    catch (raw_exn){
      var exn = Caml_js_exceptions.internalToOCamlException(raw_exn);
      if (exn.RE_EXN_ID === EOF) {
        return Belt_List.reverse(elms);
      }
      throw exn;
    }
    _src = val[1];
    _elms = {
      hd: val[0],
      tl: elms
    };
    continue ;
  };
}

function stringOfSExpr(e) {
  var match = e.it;
  if (match.TAG === /* Atom */0) {
    var s = match._0;
    if (s.TAG === /* Str */0) {
      return "str:" + s._0;
    } else {
      return s._0;
    }
  }
  var match$1 = match._1;
  if (!match$1) {
    return "()";
  }
  var stringOfXs = $$String.concat("", Belt_List.map(match$1.tl, (function (x) {
              return " " + stringOfSExpr(x);
            })));
  return "(" + stringOfSExpr(match$1.hd) + stringOfXs + ")";
}

export {
  bracketAsString ,
  stringAsSource ,
  advance ,
  caseSource ,
  ParseError ,
  parseErrorAsString ,
  parseSymbol ,
  parseString ,
  EOF ,
  WantSExprFoundRP ,
  parseOne ,
  startParseList ,
  parseMany ,
  stringOfSExpr ,
}
/* No side effect */