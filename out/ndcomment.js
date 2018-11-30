'use strict';
/*
 * extensions for the string-library
 */
String.prototype.isEqual = function (str) {
        return (str != null
                && typeof str === 'string'
                && this.toUpperCase() === str.toUpperCase());
}
String.prototype.firstWord = function () {
        let err = new Error('firstWord() => no matchdata !');
        let word = this.match(/^\S+/);
        if (word == null)
                throw err;
        return word[0].toString();
}
String.prototype.secondWord = function () {
        let err = new Error('secondWord() => no matchdata !');
        let word = this.match(/^\S+\s+(\S+)/);
        if (word == null)
                throw err;
        return word[1].toString();
}

/*
 * the DocBuilder-class object
 */
class DocBuilder {
        constructor(string) {
                this.string = JSON.parse(JSON.stringify(string));
                this.ctype = null;
                this._top = '\n/*\n';
                this._end = '\n */';
                this.typeString = [
                        null,
                        ' * Enum: ',
                        ' * Struct: ',
                        ' * Type: ',
                        ' * Define: ',
                        ' * Variable: ',
                        ' * Type: ',
                        ' * Macro: ',
                        ' * Function: '
                ];
        }
        isFunction() {
                return (/^.*?\s*?\w*?\(.*\)/).test(this.string);
        }
        getBaseName() {
                let err = new Error('getBaseName() => no matchdata !')
                let expr = new Object();
                switch (this.ctype) {
                        case 1:
                                expr = /^enum\s+([^{]+)/;
                                break;
                        case 2:
                                expr = /^struct\s+([^{]+)/;
                                break;
                        case 3:
                                expr = /^typedef\s+.+\s+([^;]+)/;
                                break;
                        case 4:
                                expr = /^#define\s+(\w+)/;
                                break;
                        case 5:
                                expr = /^.+\s[*]*(\w*)[^=;]*[;=]+/;
                                break;
                        case 6:
                                expr = /^typedef\s+.+\s+\([*]*(\w+)\)/;
                                break;
                        case 7:
                                expr = /^#define\s*(\w*)\(.*\)/;
                                break;
                        case 8:
                                expr = /^.*?\s*[*]*(\w*)\(.*\)\s*[;{]?/;
                                break;
                }
                let regExp = new RegExp(expr);
                let array = this.string.match(regExp);
                if (array == null)
                        throw err;
                return array[1].toString();
        }
        getHeader() {
                let header = this._top
                        + this.typeString[this.ctype]
                        + this.getBaseName()
                        + '\n * TODO.\n *\n';
                return header;
        }
        getSimpleComment() {
                return this.getHeader()
                        + ' */';
        }
        getFunctionReturns() {
                let err = new Error('getFunctionReturns() => no matchdata !')
                let data = new String();
                let array = new Array();
                array = this.string.match(/(.* [*]*)[^*(]*\(.*\)\s*[;{]*/);
                if (array == null)
                        throw err;
                data = array[1].toString();
                if (data.isEqual('void ')) {
                        return ' * Returns:\n'
                                + ' * void.'
                                + this._end;
                } else {
                        return ' * Returns:\n'
                                + ' * (' + data + ') - the returned value.\n'
                                + ' *'
                                + this._end;
                }

        }
        getFunctionComment() {
                let err = new Error('this.getFunctionComment() => no matchdata !');
                let data = new String();
                let array = new Array();
                array = this.string.match(/[^(]*\((.*)\)[;{]*/);
                if (array == null)
                        throw err;
                data = array[1].toString();
                if (data.isEqual('void')) {
                        return this.getHeader()
                                + ' * Parameters:\n'
                                + ' * None.\n'
                                + ' *\n'
                                + this.getFunctionReturns();
                }
                data = data.replace(/[*]/g, '');
                array = data.split(',');
                data = new Array(array.length);
                array.forEach((obj, index) => {
                        let param = obj.toString().match(/\s+(\w+)$/);
                        data[index] = ' * '
                                + param[1].toString()
                                + ' - TODO.';
                });
                return this.getHeader()
                        + ' * Parameters:\n'
                        + data.join('\n')
                        + '\n *\n'
                        + this.getFunctionReturns();
        }
        getMacroComment() {
                let err = new Error('getMacroParams() => no matchdata !');
                let data = new String();
                let array = new Array();
                array = this.string.match(/[^(]*\((.*)\).*/);
                if (array == null) {
                        throw err;
                }
                data = array[1].toString().replace(/[.]/g, '');
                array = data.split(',');
                data = new Array(array.length);
                array.forEach((obj, index) => {
                        data[index] = ' * '
                                + obj.toString().trim()
                                + ' - TODO.';
                });
                return this.getHeader()
                        + ' * Parameters:\n'
                        + data.join('\n')
                        + '\n *'
                        + this._end;
        }
        getEnumComment() {
                let err = new Error('getEnumComment() => no matchdata !');
                let data = new String();
                let array = new Array();
                data = this.string.replace(/[\t\r\n]*/g, '');
                array = data.match(/\{(.+)\}/);
                if (array == null)
                        throw err;
                data = array[1].toString().replace(/[=][^,]+/g, '');
                array = data.split(',');
                data = new Array(array.length);
                array.forEach((obj, index) => {
                        data[index] = ' * '
                                + obj.toString().trim()
                                + ' - TODO.';
                });
                return this.getHeader()
                        + data.join('\n')
                        + '\n *'
                        + this._end;
        }
        getStructComment() {
                let err = new Error('getStructComment() => no matchdata !');
                let data = new String();
                let array = new Array();
                data = this.string.replace(/[\n]*/g, '');
                data = data.match(/\{(.+)\}/);
                if (data == null)
                        throw err;
                data = data[1].toString().replace(/[*]/g, '');
                array = data.match(/\s+\w+[;]/g);
                data = new Array(array.length);
                array.forEach((obj, index) => {
                        data[index] = ' * '
                                + obj.toString().replace(/[;]/, '').trim()
                                + ' - TODO.';
                        index++;
                });
                return this.getHeader()
                        + data.join('\n')
                        + '\n *'
                        + this._end;
        }
        buildComment() {
                let first = this.string.firstWord();
                let second = this.string.secondWord();
                if (!this.isFunction()) {
                        if (first.isEqual('enum')) {
                                this.ctype = 1;
                                return this.getEnumComment();
                        } else if (first.isEqual('struct')) {
                                this.ctype = 2;
                                return this.getStructComment();
                        } else if (first.isEqual('typedef')) {
                                if (second.isEqual('struct')
                                        || second.isEqual('enum')) {
                                        this.string = this.string.replace(/^typedef\s+/, '');
                                        return this.buildComment();
                                }
                                this.ctype = 3;
                                return this.getSimpleComment();
                        } else if (first.isEqual('#define')) {
                                this.ctype = 4;
                                return this.getSimpleComment();
                        } else {
                                this.ctype = 5;
                                return this.getSimpleComment();
                        }
                } else {
                        if (first.isEqual('typedef')) {
                                this.ctype = 6;
                                return this.getSimpleComment();
                        }
                        if (first.isEqual('#define')) {
                                this.ctype = 7;
                                return this.getMacroComment();
                        } else {
                                this.ctype = 8;
                                return this.getFunctionComment();
                        }
                }
                return null;
        }
}

/* 
 * class-export 
 */
exports.DocBuilder = DocBuilder;