@numbering {
    enable: false
}

{title}JavaScript Playground

[*Sergey A Kryukov*](https://www.SAKryukov.org){.author}

A cross-platform replacement for all those office presentation applications in a single file

**

<!-- copy to CodeProject from here ------------------------------------------->

<ul class="download">
	<li><a href="Web-presentation.zip">Download source code file and demo &mdash; 11.2 MB</a></li>
	<li><a href="https://SAKryukov.github.io/web-presentation/demo">Live demo</a></li>
</ul>

(This demo uses one AV1 video, which is compatible with almost all browsers, but not Microsoft Edge)

![presentation.h](main.jpg)

## Contents{no-toc}

@toc

## Sentiments

JavaScript Playground is a fork of my very old tool, "JavaScript Calculator". I've used it well before we got node.js and modern in-browser development tools, so I used it a bit for the development, but mostly as a calculator. My main drive was to get rid of any kinds of software calculators mimicking any historical devices, and any kinds of home-baked script parsers. It had to be based on a easy to use but well-defined and standard language.

JavaScript Calculator became JavaScript Playground when I started to publish articles with JavaScript code samples and components. I decided that I can turn it into the compact self-containing tool used to demonstrate JavaScript code.

Later I added several useful things, such as file I/O and fully-fledged console used to browse objects with complex structure.

## Core

```{lang=JavaScript}
const evaluateWith = (text, writeLine, write, console, isStrict) => {
    return new Function(
        "writeLine", "write", "console", safeInput(text, isStrict))
        (writeLine,   write,   console);

// ...

const console = // ...
const writeLine = // ...
const write = // ...

// ...

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
};

const safeInput = (text, isStrict) => {
    const safeGlobals =
        "const document = null, window = null, navigator = null, " +
        "globalThis = {console: console, write: write, writeLine: writeLine}";
    return isStrict ?
        `"use strict"; ${safeGlobals}\n${text}`
        :
        `${safeGlobals} with (Math) \{\n${text}\n\}`;
};
```

## Playground API

```{lang=JavaScript}{#code-keyboard}
switch (event.code) {
    case "Space":
    case "ArrowDown": move(false); break;
    case "Backspace":
    case "ArrowUp": move(true); break;
    case "ArrowRight": move(presentation.rtl); break;
    case "ArrowLeft": move(!presentation.rtl); break;
    //...
}
```

