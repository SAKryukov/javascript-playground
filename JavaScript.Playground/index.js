/*

JavaScript Playground

Copyright (c) 2015, 2019-2021 by Sergey A Kryukov
http://www.SAKryukov.org
http://SAKryukov.org/freeware/calculator
http://www.codeproject.com/Members/SAKryukov

Original publication CodeProject:
http://www.codeproject.com/Articles/890109/JavaScript-Calculator    

*/

"use strict";

const evaluateWith = (text, writeLine, write, console, isStrict) => {
    return new Function("writeLine", "write", "console", safeInput(text, isStrict))
                        (writeLine,   write,   console);
};

const definitionSet = {
    keys: {
        evaluate: "F2",
        enter: "Enter", // with Ctrl: evaluate, without: auto-complete
        escape: "Escape",
        hideConsole: "Escape",
        download: "s", // with Ctrl; if console showing, save console data, default otherwise
    }, //keys
    colors: {
        consoleData: { background: "PaleGreen", foreground: "Black" },
        consoleError: { background: "Yellow", foreground: "DarkRed" },
    }, //colors
    console: {
        ellipsis: String.fromCharCode(0x2026),
        assertionFailed: "Assertion failed",
        assertionFailedWithMessage: "Assertion failed:",
        maxSummaryLength: 8,
        argumentDelimiter: " ",
        defaultTimeMark: "default",
        timerMarkType: "mark",
        timerDuration: (label, duration) => `${label}: ${duration} ms`,
        noTimer: label => `Timer "${label}" does not exist`,
        methodNotImplemented: name => `console.${name}() is not implemented`,
    },
    consoleStyles: {
        initialEditorWidth: "60%",
        assert: "color: navy; font-weight: bold; font-size: 110%",
        debug: "color: maroon",
        log: "color: black",
        dir: "color: black; font-family: monospace; font-size: 120%",
        error: "color: red; font-weight: bold; font-size: 120%",
        notImplementedError: "color: red; font-style: italic",
        warn: "color: darkMagenta; font-style: italic",
        info: "padding-left: 0.2em; padding-right: 0.2em; color: maroon; background-color: oldLace",
        timer: "font-weight: bold; font-size: 110%",
    },
    textFeatures: {
        defaultOutputFileName: "JavaScriptPlayground.output.txt",
        defaultScriptFileName: "JavaScriptPlayground.script.js",
        scriptFileNameFilter: ".js",
        newLine: "\n",
        indentPad: "\t",
        blankSpace: " ",
        fakeEmptyParagraph: "&thinsp;", // just to maintain vertical size of empty paragraph
        autocompleteIndicatorStyle:
            "top: 0.2em; right: 2.2em; padding: 0.4em 1em 0.4em 1em;" + 
            "color: snow; background-color: rgba(100, 100, 150, 0.8);" +
            "position: absolute; display: none;" +
            "border-radius: 0.6em; opacity: 0.6; font-size: 90%;"
	},
    smartFormatting: {
        features: { useSmartIndent: true, useTabs: false, tabSize: 4, useAutoBracket: true, useTidy: true, useCodeCompletion: true },
        formattingRules: {
            indent: [
                { bra: "[", ket: "]", endOfLineKet: true, matchLeftWord: false, matchRightWord: false },
                { bra: "{", ket: "}", endOfLineKet: true, matchLeftWord: false, matchRightWord: false }
            ],
            autoBracket: [
                { bra: "[", ket: "]", endOfLineOnly: true },
                { bra: "{", ket: "}", endOfLineOnly: true },
                { bra: "(", ket: ")", endOfLineOnly: true },
                { bra: "'", ket: "'", endOfLineOnly: true },
                { bra: "\"", ket: "\"", endOfLineOnly: true }
            ],
            tidy: [
                { before: ["--"], after: String.fromCharCode(1) }, //preserve --, protect from - -
                { before: ["++"], after: String.fromCharCode(2) }, //preserve ++, protect from + +
                { before: ["**"], after: String.fromCharCode(3) }, //preserve **, protect from * *
                { before: ["===", "!==", "==", "&&", "||", "+=", "-=", "*=", "/=", "|=", "//", "&=", "^=", "!=", "=>", "=", "+", "-", "*", "/", "|", "&", "^", "{"], after: " $1 " },
                { before: [",", ";", ":"], after: "$1 " },
                { before: ["}"], after: " $1" },
                { before: [String.fromCharCode(1)], after: "--" }, //restore
                { before: [String.fromCharCode(2)], after: "++" }, //restore
                { before: [String.fromCharCode(3)], after: "**" }, //restore
            ],
            tidyVerbatim: [ // inside these brackets, tidy is not applied, the content is used verbatim
                { bra: "'", ket: "'" },
                { bra: "\"", ket: "\"" }
            ],
            autoComplete: [
                { pattern: "wri*teLine (|);", breakPoint: "*", insertPoint: "|" }, //JavaScript.Playground/Calculator-specific
                { pattern: "do* {|} while ()", breakPoint: "*", insertPoint: "|" },
                { pattern: "whi*le (|)", breakPoint: "*", insertPoint: "|" },
                { pattern: "swi*tch (|) {}", breakPoint: "*", insertPoint: "|" },
                { pattern: "cas*e |: break;", breakPoint: "*", insertPoint: "|" },
                { pattern: "try* {|} catch(exception) {}", breakPoint: "*", insertPoint: "|" },
                { pattern: "thr*ow new |;", breakPoint: "*", insertPoint: "|" },
                { pattern: "if* (|)", breakPoint: "*", insertPoint: "|" },
                { pattern: "els*e |", breakPoint: "*", insertPoint: "|" },
                { pattern: "conso*le.|", breakPoint: "*", insertPoint: "|" },
                { pattern: "console.l*og(|);", breakPoint: "*", insertPoint: "|" },
                { pattern: "console.e*rror(|);", breakPoint: "*", insertPoint: "|" },
                { pattern: "console.w*arn(|);", breakPoint: "*", insertPoint: "|" },
                { pattern: "console.i*nfo(|);", breakPoint: "*", insertPoint: "|" },
                { pattern: "console.d*ebug(|);", breakPoint: "*", insertPoint: "|" },
                { pattern: "ret*urn |;", breakPoint: "*", insertPoint: "|" },
                { pattern: "fun*ction () {|}", breakPoint: "*", insertPoint: "|" },
                { pattern: "for* (let index |", breakPoint: "*", insertPoint: "|" },
                { pattern: "for (let index =* 0; index < |; ++index) { console.log(index); }", breakPoint: "*", insertPoint: "|" },
                { pattern: "for (let index i*n |) { console.log(index); }", breakPoint: "*", insertPoint: "|" },
                { pattern: "for (let index o*f |) { console.log(index); }", breakPoint: "*", insertPoint: "|" },
            ]
        } //formattingRules
    } //smartFormatting
}; //definitionSet

(function upgradeString(){
    if (!String.empty) {
        Object.defineProperty(String, "empty", {
            enumerable: false,
            configurable: false,
            writable: false,
            value: ""
        });
    } //if !String.empty
})();

const fileIO = {
    storeFile: (fileName, content) => {
        const link = document.createElement('a');
        link.href = `data:text/plain;charset=utf-8,${content}`; //sic!
        link.download = fileName;
        link.click();
    }, //storeFile
    loadTextFile: (fileHandler, acceptFileTypes) => { // fileHandler(fileName, text), acceptFileTypes: comma-separated, in the form: ".js,.json"
        const input = document.createElement("input");
        input.type = "file";
        input.accept = acceptFileTypes;
        input.value = null;
        if (fileHandler)
            input.onchange = event => {
                const file = event.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = readEvent => fileHandler(file.name, readEvent.target.result);
            }; //input.onchange
        input.click();
    }, //loadTextFile
}; //const fileIO

const setup = (
    strictModeSwitch, editor, splitter, consoleSide, console,
    downloadButton, closeButton, evaluateButton, loadButton, storeButton,
    evaluateResult, positionIndicator,
    product, copyright) => {

    product.innerHTML = `${metadata.title} ${metadata.version()}`;
    copyright.innerHTML = `Copyright &copy; ${metadata.copyright}`;

    const consoleInstance = (() => {
        const consoleInstance = {
            lastEditorWidth: null,
            dragging: undefined,
            showing: true,
            init: () => { editor.style.width = definitionSet.consoleStyles.initialEditorWidth; },
            reset: function() {
                this.hide();
                performance.clearMarks();
                performance.clearMeasures();
                console.innerHTML = null;
                this.colorIt(false);
                evaluateResult.value = String.empty;
            },
            hide: function() {
                if (!this.showing) return;
                consoleSide.style.display = "none";
                splitter.style.display = "none";
                editor.style.width = "100%";
                this.showing = false;    
            },
            show: function() {
                if (this.showing) return;
                consoleSide.style.display = null;
                splitter.style.display = null;
                editor.style.width = this.lastEditorWidth;    
                this.showing = true;    
            },
            writeOrWriteLine: function(argumentCollection, newLine, style) {
                const textCollection = Array.prototype.slice.call(argumentCollection);
                for (let index in textCollection)
                    textCollection[index] = `${textCollection[index]}`; // this is needed to render null and undefined
                this.show();
                const line = console.lastElementChild;
                const appendToLastParagraph = line && !this.lastWriteLine;
                if (appendToLastParagraph)
                    line.appendChild(document
                        .createTextNode(textCollection.join(definitionSet.console.argumentDelimiter)));
                else {
                    const line = document.createElement("p");
                    if (style)
                        line.style.cssText = style;
                    const paragraphContent = textCollection.join(definitionSet.console.argumentDelimiter).trim();
                    if (paragraphContent.length < 1)
                        line.innerHTML = definitionSet.textFeatures.fakeEmptyParagraph;
                    else
                        line.textContent = paragraphContent;
                    console.appendChild(line);    
                } //if
                this.lastWriteLine = newLine;
            },
            write: function(argumentCollection) { this.writeOrWriteLine(argumentCollection, false); },
            writeLine: function(argumentCollection, style) { this.writeOrWriteLine(argumentCollection, true, style); },
            colorIt: error => {
                if (error) {
                    consoleSide.style.backgroundColor = definitionSet.colors.consoleError.background;
                    consoleSide.style.color = definitionSet.colors.consoleError.foreground;
                } else {
                    consoleSide.style.backgroundColor = definitionSet.colors.consoleData.background;
                    consoleSide.style.color = definitionSet.colors.consoleData.foreground;
                } //if
            }, //colorIt
            primaryDir: (obj, owner) => {
                if ((obj instanceof Array))
                    return `${obj.constructor.name}(${obj.length})`;
                if (obj && obj.constructor == Function)
                    return obj.name && obj.name != owner ? `${obj.constructor.name.toLowerCase()} ${obj.name}()` : `${obj.constructor.name.toLowerCase()}()`;                
                if (obj instanceof Object)
                    return obj.constructor.name;
                if (obj != undefined && obj != null && obj.constructor == String)
                    return `"${obj}"`;
                return `${obj}`;
            }, //primaryDir
            dirSummary: function(obj) {
                if (obj == undefined || obj == null)
                    return this.primaryDir(obj);
                if (obj.constructor == Function)
                    return this.primaryDir(obj);
                if (!(obj instanceof Object))
                    return this.primaryDir(obj);
                if (obj instanceof Array) {
                    const max = obj.length > definitionSet.console.maxSummaryLength ? definitionSet.console.maxSummaryLength : obj.length;
                    let content = [];
                    for (let index = 0; index < max; ++index)
                        content.push(this.primaryDir(obj[index]));
                    if (obj.length > definitionSet.console.maxSummaryLength)
                        content.push(definitionSet.console.ellipsis);
                    content = content.join(", ");
                    return `${obj.constructor.name}(${obj.length}) [${content}]`;
                } //if Array
                //Object:
                let count = 0;
                let content = [];
                for (let index in obj)
                    if (++count > definitionSet.console.maxSummaryLength) {
                        content.push(definitionSet.console.ellipsis);
                        break;
                    } else
                        content.push(`${index}: ${this.primaryDir(obj[index], index)}`);
                content = content.join(", ");
                return `${obj.constructor.name} \{${content}\}`;
            }, //dirSummary
            indirectDir: function(name, obj, parentElement, style) {
                this.show();
                const details = document.createElement("details");
                const summary = document.createElement("summary");
                let functionBody = null;
                if (obj instanceof Function) {
                    const all = obj.toString();
                    // dirty work around Firefox (more exactly, SpiderMonkey) bug:
                    // if does not respect "s" flag (include \n in the "." set),
                    // so [^\x05] replaces . in the sense "any character (including \n)":
                    const match = new RegExp(/([^\x05]*?)(\{[^\x05]*?\})/).exec(all);
                    let summaryText = match[1].trim();
                    summaryText = name ? `${name}: ${summaryText}` : `${summaryText}`;
                    summary.textContent = summaryText;
                    functionBody = match[2].trim();
                } else
                    summary.textContent = name ? `${name}: ${this.dirSummary(obj)}` : `${this.dirSummary(obj)}`;
                if (style) summary.style.cssText = style;
                details.appendChild(summary);
                parentElement.appendChild(details);
                details.JavaScriptPlaygroundApi = this;
                if (obj instanceof Function) {
                    const paragraph = document.createElement("p");
                    if (style) paragraph.style.cssText = style;
                    paragraph.textContent = functionBody;
                    details.appendChild(paragraph);
                    return;
                } //if Function
                details.ontoggle = event => {
                    if (event.target.open) {
                        for (let index in obj) {
                            if (obj[index] instanceof Object)
                                event.target.JavaScriptPlaygroundApi.indirectDir(index, obj[index], event.target, style);
                            else {
                                const paragraph = document.createElement("p");
                                if (style) paragraph.style.cssText = style;
                                paragraph.textContent = `${index}: ${event.target.JavaScriptPlaygroundApi.dirSummary(obj[index])}`;
                                event.target.appendChild(paragraph);
                            }
                        } //loop
                    } else
                        while (event.target.children.length > 1)
                            event.target.removeChild(event.target.children[1]);
                } //details.ontoggle
            }, //indirectDir
            writeMixedArguments: function(container, style) {
                this.lastWriteLine = true; // only called from consoleAPI
                let current = [];
                for (let index in container)
                    if (container[index] instanceof Object) {
                        if (current.length > 0)
                            this.writeLine(current, style);
                        current = [];
                        this.indirectDir(null, container[index], console, style);
                    } else
                        current.push(container[index]);
                if (current.length > 0)
                    this.writeLine(current, style);        
            },
            adjustTimerLabel: label => {
                if (label === undefined) return definitionSet.console.defaultTimeMark;
                return `${label}`; // this way, null can also be a label
            },
            setCaret: (line, column) => {
                const lines = editor.value.split(definitionSet.textFeatures.newLine);
                let position = 0;
                for (let index = 0; index < line && index < lines.length; ++index)
                    position += lines[index].length + 1;
                editor.setSelectionRange(position + column - 1, position + column);
            }, //setCaret
            showException: function (exceptionInstance) {
                this.colorIt(true);
                this.writeLine([]);
                this.writeLine([`${exceptionInstance.name}:`]);
                this.writeLine([exceptionInstance.message]);
                const isKnown = function(object) {
                    if (object == null || object == undefined) return false;
                    if (object.constructor != Number) return false;
                    return !isNaN(object);
                }; //isKnown
                const knownPosition = isKnown(exceptionInstance.lineNumber) && isKnown(exceptionInstance.columnNumber);
                if (knownPosition)
                    this.writeLine([`Line: ${exceptionInstance.lineNumber - 2}, column: ${exceptionInstance.columnNumber + 1}`]); //sic! see extra lines in evaluateWith
                if (knownPosition)
                    this.setCaret(exceptionInstance.lineNumber - 2, exceptionInstance.columnNumber);
            }, //showException
            toString: function() {
                let result = String.empty;
                for (let index = 0; index < console.childElementCount; ++index) {
                    const textContent = console.children[index].constructor == HTMLParagraphElement ?
                        console.children[index].textContent
                        :
                        console.children[index].firstElementChild.textContent;
                    result += textContent.trim();
                    if (index < console.childElementCount - 1) result += definitionSet.textFeatures.newLine; 
                } //loop
                return result;
            }, //toString
        }; //consoleInstance
        splitter.onmousedown = ev => {
            if (ev.button != 0) return;
            const style = window.getComputedStyle(editor);
            const width = parseInt(style.getPropertyValue("width"));
            consoleInstance.dragging = { width: width, mousePositon: ev.screenX };
            consoleInstance.lastEditorWidth = consoleInstance.dragging.width;
        };
        window.onmouseup = ev => { consoleInstance.dragging = undefined; };
        window.onmousemove = ev => {
            if (ev.button != 0) return;
            if (!consoleInstance.dragging) return;
            const newWidth = `${consoleInstance.dragging.width + ev.screenX - consoleInstance.dragging.mousePositon}px`;
            editor.style.width = newWidth;
            consoleInstance.lastEditorWidth = newWidth;
            ev.preventDefault();
            ev.stopPropagation();
        }; //window.onmousemove
        window.onresize = focusEvent => {
            if (consoleInstance.showing)
                consoleInstance.init();
            else
                consoleInstance.lastEditorWidth = null;
        }; //window.onresize
        consoleInstance.init();
        consoleInstance.hide();
        closeButton.onclick = () => { consoleInstance.hide(); };
        return consoleInstance;
    })(); //consoleInstance

    loadButton.onclick = () => { fileIO.loadTextFile((_, result) => {
        editor.value = result;
        }, definitionSet.textFeatures.scriptFileNameFilter);
    }; //loadButton.onclick
    storeButton.onclick = () => {
        fileIO.storeFile(definitionSet.textFeatures.defaultScriptFileName, editor.value);
    }; //storeButton.onclick
    downloadButton.onclick = () => {
        fileIO.storeFile(definitionSet.textFeatures.defaultOutputFileName, consoleInstance.toString());
    }; //downloadButton.onclick

const consoleApi = {
        assert: (assertion, ...objectsToDisplay) => {
            if (assertion) return;
            let resultingArguments = (objectsToDisplay.length > 0) ?
                [definitionSet.console.assertionFailedWithMessage] : [definitionSet.console.assertionFailed];
            resultingArguments = resultingArguments.concat(objectsToDisplay);
            consoleInstance.writeMixedArguments(resultingArguments, definitionSet.consoleStyles.assert);    
        }, //assert
        clear: () => { console.innerHTML = String.empty; },
        count: () => { return console.childElementCount; },
        debug: (...objects) => { consoleInstance.writeMixedArguments(objects, definitionSet.consoleStyles.debug); },
        dir: (...objects) => { consoleInstance.writeMixedArguments(objects, definitionSet.consoleStyles.dir); },
        error: (...objects) => { consoleInstance.writeMixedArguments(objects, definitionSet.consoleStyles.error); },
        info: (...objects) => { consoleInstance.writeMixedArguments(objects, definitionSet.consoleStyles.info); },
        log: (...objects) => { consoleInstance.writeMixedArguments(objects, definitionSet.consoleStyles.log); },
        warn: (...objects) => { consoleInstance.writeMixedArguments(objects, definitionSet.consoleStyles.warn); },
        countReset: () => { consoleInstance.writeMixedArguments([definitionSet.console.methodNotImplemented("countReset")], definitionSet.consoleStyles.notImplementedError); },
        dirxml: () => { consoleInstance.writeMixedArguments([definitionSet.console.methodNotImplemented("dirxml")], definitionSet.consoleStyles.notImplementedError); },
        group: () => { consoleInstance.writeMixedArguments([definitionSet.console.methodNotImplemented("group")], definitionSet.consoleStyles.notImplementedError); },
        groupCollapsed: () => { consoleInstance.writeMixedArguments([definitionSet.console.methodNotImplemented("groupCollapsed")], definitionSet.consoleStyles.notImplementedError); },
        groupEnd: () => { consoleInstance.writeMixedArguments([definitionSet.console.methodNotImplemented("groupEnd")], definitionSet.consoleStyles.notImplementedError); },
        profile: () => { consoleInstance.writeMixedArguments([definitionSet.console.methodNotImplemented("profile")], definitionSet.consoleStyles.notImplementedError); },
        profileEnd: () => { consoleInstance.writeMixedArguments([definitionSet.console.methodNotImplemented("profileEnd")], definitionSet.consoleStyles.notImplementedError); },
        table: () => { consoleInstance.writeMixedArguments([definitionSet.console.methodNotImplemented("table")], definitionSet.consoleStyles.notImplementedError); },
        timeStamp: () => { consoleInstance.writeMixedArguments([definitionSet.console.methodNotImplemented("timeStamp")], definitionSet.consoleStyles.notImplementedError); },
        trace: () => { consoleInstance.writeMixedArguments([definitionSet.console.methodNotImplemented("trace")], definitionSet.consoleStyles.notImplementedError); },
        time: label => { performance.mark(consoleInstance.adjustTimerLabel(label)); },
        timeEnd: function(label) {
            label = consoleInstance.adjustTimerLabel(label);
            this.timeLog(label);
            performance.clearMarks(label);
            performance.clearMeasures(label);
        }, //timeEnd
        timeLog: function(label) {
            const now = performance.now(); //as early as possible
            label = consoleInstance.adjustTimerLabel(label);
            try {
                const oldMeasure = performance.getEntriesByName(label, definitionSet.console.timerMarkType);
                if (oldMeasure.length < 1) {
                    this.error(definitionSet.console.noTimer(label));
                    return;    
                } //if
                consoleInstance.writeMixedArguments([definitionSet.console.timerDuration(label, now - oldMeasure[0].startTime)],
                    definitionSet.consoleStyles.timer);
            } catch (ex) {
                this.error(ex.message);
            } //exception
        }, //timeLog
    } //consoleApi

    strictModeSwitch.onchange = () => { JavaScriptPlaygroundAPI.reload(editor.value, strictModeSwitch.checked); };

    const evaluate = () => {
        consoleInstance.reset();
        try {
            evaluateResult.value = evaluateWith(
                editor.value,
                (...objects) => consoleInstance.writeLine(objects),
                (...objects) => consoleInstance.write(objects),
                consoleApi,
                strictModeSwitch.checked);
        } catch (exception) {
            consoleInstance.showException(exception);
        } //exception
        return false;
    }; //evaluate

    document.onkeydown = (event) => {
        const key = event.key;
        switch (key) {
            case definitionSet.keys.evaluate: event.preventDefault(); return evaluate();
            case definitionSet.keys.enter: if (event.ctrlKey) { event.preventDefault(); return evaluate(); } break;
            case definitionSet.keys.hideConsole: event.preventDefault(); return consoleInstance.hide();
            case definitionSet.keys.download: if (event.ctrlKey) {
                if (!consoleInstance.showing) return;
                event.preventDefault();
                return fileIO.storeFile(definitionSet.textFeatures.defaultOutputFileName, consoleInstance.toString());
            } //if download
        } //switch
    } //document.onkeydown
    evaluateButton.onclick = () => { evaluate(); };

    (function setCursorPositionEvents() {
        const showCursorPosition = data => {
            const line = editor.value.substring(0, editor.selectionStart);
            if (data) line += data;
            const split = line.split(definitionSet.textFeatures.newLine);
            const y = split.length;
            const x = split[split.length - 1].length + 1;
            positionIndicator.value = `${y} : ${x}`;
            positionIndicator.style.width = positionIndicator.value.length + "em";
        }; //showCursorPosition
        editor.onfocus = () => { showCursorPosition(); };
        editor.onclick = () => { showCursorPosition(); };
        editor.onkeyup = () => { showCursorPosition(); };
        const chainEditorOnKeyDown = editor.onkeydown;
        editor.onkeydown = function (ev) {
            let result = undefined;
            if (chainEditorOnKeyDown)
                result = chainEditorOnKeyDown.call(this, ev);
            showCursorPosition();
            return result;
        }; //elements.editor.onkeydown
        showCursorPosition();
    })(); //setCursorPositionEvents

    const setSmartFormatting = (editor, options, autoCompleteMatchNotification) => {
        const constants = { keyEnter: definitionSet.keys.enter, keyEscape: definitionSet.keys.escape, tab: definitionSet.textFeatures.indentPad, blankSpace: definitionSet.textFeatures.blankSpace, empty: String.empty };
        let indentPad = (options.features.useTabs) ? constants.tab : new String(new Array(options.features.tabSize + 1).join(constants.blankSpace));
        let newLine = definitionSet.textFeatures.newLine;
        (function autoDetectNewLineAndSetupTabs() {
            const saveValue = editor.value;
            editor.value = newLine;
            newLine = editor.value; //auto-detected
            editor.value = saveValue;
            if (editor.style.tabSize !== undefined) editor.style.tabSize = options.features.tabSize + "px";
        })() //autoDetectNewLineAndSetupTabs
        const tidyRegex = (function createRegexTidyRules(rules) {
            let regex = [];
            for (let rule in rules) {
                let newRule = { before: constants.empty, after: rules[rule].after };
                for (let wordIndex = 0; wordIndex < rules[rule].before.length; ++wordIndex) {
                    let word = constants.empty;
                    for (let charIndex in rules[rule].before[wordIndex])
                        word += "\\" + rules[rule].before[wordIndex][charIndex];
                    if (newRule.before != constants.empty)
                        newRule.before += "|";
                    newRule.before += word;
                } //loop word
                newRule.before = "(" + newRule.before + ")";
                newRule.before = new RegExp(newRule.before, "g");
                regex.push(newRule);
            } //loop rule
            return regex;
        })(options.formattingRules.tidy); //createRegexTidyRules
        const tidyVerbatimRegex = (function createTidyVerbatimRegex(rules) {
            const escape = function(value) {
                let word = constants.empty;
                for (let charIndex in value)
                    word += "\\" + value[charIndex];
                return word;
            } //escape
            let regex = constants.empty;
            for (let rule in rules) {
                if (regex)
                    regex += "|";
                regex += escape(rules[rule].bra) + ".*?" + escape(rules[rule].ket);
            } //loop
            regex = "(" + regex + ")";
            return new RegExp(regex, "g");
        })(options.formattingRules.tidyVerbatim); //createTidyVerbatimRegex
        const getCursor = editor => editor.selectionStart;
        const setCursor = (editor, pos) => {
            editor.selectionStart = pos;
            editor.selectionEnd = pos;
        } //setCursor
        const endsWith = (src, key) => {
            if (src.constructor != String) return false;
            if (key.constructor != String) return false;
            const index = src.lastIndexOf(key)
            return index >= 0 && index == src.length - key.length;
        } //endsWith
        const startsWith = (src, key) => {
            if (src.constructor != String) return false;
            if (key.constructor != String) return false;
            return src.lastIndexOf(key) == 0;
        } //startsWith
        const findWords = (value, right) => {
            let words = value.split(/[\s\n\r]/);
            let clearWords = [];
            for (let index = 0; index < words.length; ++index)
                if (words[index] != constants.empty)
                    clearWords.push(words[index]);
            return (right) ? clearWords[0] : clearWords[clearWords.length - 1];
        } //findWords
        const parseCursorContext = editor => {
            const pos = getCursor(editor);
            const allText = editor.value;
            const leftChar = allText[pos - 1];
            const rightChar = allText[pos];
            if (!leftChar) return;
            let left = allText.substring(0, pos);
            let right = allText.substring(pos);
            const rightmost = right.indexOf(newLine);
            if (rightmost >= 0)
                right = right.substr(0, rightmost);
            let leftmost = left.lastIndexOf(newLine);
            if (leftmost >= 0)
                left = left.substr(leftmost + newLine.length, pos);
            const leftWord = findWords(left, false);
            const rightWord = findWords(right, true);
            return { cursor: pos, left: { char: leftChar, word: leftWord, line: left }, right: { char: rightChar, word: rightWord, line: right } };
        } //parseCursorContext
        const insert = aValue => {
            if (!aValue) return;
            let startPos = editor.selectionStart;
            let endPos = editor.selectionEnd;
            editor.value = editor.value.substring(0, startPos)
                + aValue
                + editor.value.substring(endPos, editor.value.length);
        } //insert
        const removeBack = function (cursorContext, count) {
            if (!count) return;
            let left = editor.value.substring(0, cursorContext.cursor);
            let right = editor.value.substring(cursorContext.cursor);
            left = left.slice(0, -count);
            editor.value = left + right;
        } //removeBack
        const countTabs = function (source) {
            let match = (options.features.useTabs) ? constants.tab : constants.blankSpace;
            let result = 0;
            for (let index = 0; index < source.length; ++index)
                if (source[index] == match)
                    ++result;
                else
                    break;
            return source.substr(0, result);
        } //countTabs	
        function tidy(value) {
            let preserveQuotationMatchBefore = value.match(tidyVerbatimRegex);
            for (let index in tidyRegex)
                value = value.replace(tidyRegex[index].before, tidyRegex[index].after);
            value = value.replace(/\s+/g, constants.blankSpace);
            if (preserveQuotationMatchBefore) {
                let preserveQuotationMatchAfter = value.match(tidyVerbatimRegex);
                if (preserveQuotationMatchAfter)
                    for (let index=0; index < preserveQuotationMatchAfter.length; ++index)
                        value = value.replace(preserveQuotationMatchAfter[index], preserveQuotationMatchBefore[index]);
            } //if
            return value.trim();
        } //tidy
        function handleCharacter(character, context) {
            if (!context) return;
            let trimmedRightLine = context.right.line.trim();
            for (let index = 0; index < options.formattingRules.autoBracket.length; ++index) {
                let rule = options.formattingRules.autoBracket[index];
                if (!(rule.bra && rule.ket)) continue;
                if (character != rule.bra) continue;
                if (rule.endOfLineOnly && trimmedRightLine != constants.empty) continue;
                insert(character + rule.ket);
                setCursor(this, context.cursor + 1);
                return true;
            } //loop
        } //handleCharacter
        function recognizeAutocomplete(context) {
            if (!context) return;
            if (context.right.line) return;
            for (let index = 0; index < options.formattingRules.autoComplete.length; ++index) {
                let rule = options.formattingRules.autoComplete[index];
                if (!rule.breakPoint) continue;
                if (!rule.insertPoint) continue;
                if (rule.breakPoint.length != 1) continue;
                if (rule.insertPoint.length != 1) continue;
                let reg = new RegExp("[" + rule.breakPoint + rule.insertPoint + "]", "g");
                let parts = rule.pattern.split(reg);
                if (parts.length != 3) continue;
                let all = parts.join(constants.empty);
                let min = parts[0].length;
                let match;
                for (let length = all.length - 1; length >= min; --length)
                    if (endsWith(context.left.line, all.slice(0, length))) {
                        match = length; break;
                    } //if
                if (!match) continue;
                return { all: all, toInsert: all.slice(length), cursorPosition: context.cursor + all.length - match - parts[2].length }
            } //loop
        } //recognizeAutocomplete
        const keyPressHandler = function (ev) {
            let character = String.fromCharCode(ev.charCode);
            let context = parseCursorContext(this);
            if (handleCharacter.call(this, character, context)) {
                ev.preventDefault();
                return false;
            } //if
        }; //keyPressHandler
        const keyUpClickHandler = function (ev) {
            if (ev.key == constants.keyEscape)
                return;
            let context = parseCursorContext(this);
            this.match = recognizeAutocomplete.call(this, context);
            if (!autoCompleteMatchNotification) return;
            let autoCompleteMatchNotificationArgument = (this.match) ? this.match.all : constants.empty;
            autoCompleteMatchNotification(autoCompleteMatchNotificationArgument);
        } //keyUpClickHandler
        const keyDownHandler = function (ev) {
            if (ev.shiftKey || ev.ctrlKey || ev.altKey || ev.metaKey) return;
            if (ev.key == constants.keyEscape) {
                this.match = null;
                if (autoCompleteMatchNotification)
                    autoCompleteMatchNotification(null);
                return;
            } //if keyEscape
            if (ev.key != constants.keyEnter) return;
            let context = parseCursorContext(this);
            if (!context) return;
            if (this.match && options.features.useCodeCompletion) {
                insert(this.match.toInsert.substr(context.left.line.length));
                setCursor(this, this.match.cursorPosition);
                ev.preventDefault();
                return false;
            } // if
            let pad = countTabs(context.left.line);
            let indent = false;
            if (options.features.useTidy) {
                let tidyLine = pad + tidy(context.left.line);
                let cursorShift = tidyLine.length - context.left.line.length;
                removeBack(context, context.left.line.length);
                setCursor(this, context.cursor - context.left.line.length)
                insert(tidyLine); setCursor(this, context.cursor + cursorShift);
                context = parseCursorContext(this);
            } //if useTidy
            if (options.features.useSmartIndent) {
                for (let index = 0; index < options.formattingRules.indent.length; ++index) {
                    let rule = options.formattingRules.indent[index];
                    let ket = rule.ket || constants.empty;
                    let leftMatches = (rule.matchLeftWord) ? context.left.word == rule.bra : endsWith(context.left.line, rule.bra);
                    if (leftMatches) {
                        let rightMatches = (rule.matchRightWord) ? context.right.word && context.right.word == ket : context.right.word && startsWith(context.right.line, ket);
                        let lineEndMatches = rule.endOfLineKet && !context.right.word;
                        if (rightMatches)
                            insert(newLine + pad + indentPad + newLine + pad);
                        else if (lineEndMatches)
                            insert(newLine + pad + indentPad);
                        if (rightMatches || lineEndMatches) {
                            setCursor(this, context.cursor + pad.length + indentPad.length + 1);
                            indent = true;
                            break;
                        } //if right/end-of-line matches
                    } //if left matches		
                } //loop
                if (!indent) {
                    insert(newLine + pad);
                    setCursor(this, context.cursor + pad.length + 1);
                } //if
            } else
                return; //if useSmartIndent
            ev.preventDefault();
            return false;
        }; //keyDownHandler
        const pasteHandler = function (ev) {
            if (!ev.clipboardData) return;
            let data = ev.clipboardData.getData('text/plain');
            if (!data) return;
            this.match = undefined;
            if (!autoCompleteMatchNotification) return;
            autoCompleteMatchNotification(constants.empty);
        } //pasteHandler	
        editor.removeEventListener("keydown", keyDownHandler);
        editor.removeEventListener("keypress", keyPressHandler);
        editor.removeEventListener("keyup", keyUpClickHandler);
        editor.removeEventListener("click", keyUpClickHandler);
        editor.removeEventListener("paste", pasteHandler);
        if (options.features.useSmartIndent || options.features.useTidy || options.features.useCodeCompletion)
            editor.addEventListener("keydown", keyDownHandler);
        if (options.features.useAutoBracket)
            editor.addEventListener("keypress", keyPressHandler);
        if (options.features.useCodeCompletion) {
            editor.addEventListener("keyup", keyUpClickHandler);
            editor.addEventListener("click", keyUpClickHandler);
            editor.addEventListener("paste", pasteHandler);
        } //if
    } //setSmartFormatting

    (function applySmartFormatting() {
        const indicator = document.createElement("div");
        indicator.style.cssText = definitionSet.textFeatures.autocompleteIndicatorStyle;
        editor.parentElement.appendChild(indicator);
        try {
            setSmartFormatting(editor, definitionSet.smartFormatting, function (value) {
                if (value) {
                    indicator.innerHTML = `Insert "${value}"? (Enter/Escape)`;
                    indicator.style.display = "block";
                } else
                    indicator.style.display = "none";
            });
        } catch (ex) { consoleInstance.showException(ex); }    
    })(); //applySmartFormatting
    
    document.body.onload = () => {
        JavaScriptPlaygroundAPI.onLoad((title, code, doNotEvaluate, strict) => {
            editor.value = code;
            if (strict)
                strictModeSwitch.checked = true;
            if (!doNotEvaluate)
                evaluate();
            if (title)
                document.title = `${document.title}: ${title}`;
        });
        editor.focus();
    }; //document.body.onload

    editor.focus();

}; //setup

//API:
const hex = (arg, upcase) => {
    let hexdigit = "0123456789abcdef";
    let result = String.empty;
    if (upcase) hexdigit = hexdigit.toUpperCase();
    for (let index = 0; index < (32 / 4); ++index) {
        indexInString = (arg >>> (index * 4)) & 0xF;
        result = hexdigit.charAt(indexInString) + result;
    } //loop
    return result;
} //hex
const bin = arg => {
    let result = String.empty;
    for (let index = 0; index < 32 ; ++index) {
        if ((arg & (1 << index)) != 0) result = "1" + result;
        else result = "0" + result;
    } //loop
    return result;
} //bin
const f2c = f => {
    return 5 / 9 * (f - 32);
} //f2c
const c2f = c => {
    return 9 / 5 * c + 32;
} //c2f
const safeInput = (text, isStrict) => {
    const safeGlobals =
        "const document = null, window = null, navigator = null, " +
        "globalThis = {console: console, write: write, writeLine: writeLine}";
    return isStrict ?
        `"use strict"; ${safeGlobals}; ${text}`
        :
        `${safeGlobals}; with (Math) \{${text}\n\}`;
}; //safeInput
