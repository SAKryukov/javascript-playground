/*

JavaScript Playground

Copyright (c) 2015, 2019-2021 by Sergey A Kryukov
http://www.SAKryukov.org
http://SAKryukov.org/freeware/calculator
http://www.codeproject.com/Members/SAKryukov

Original publication:
https://www.codeproject.com/Articles/5291705/JavaScript-Playground 

*/

const metadata = (() => {
    return {
        copyright: "2015, 2019-2021 by S A Kryukov",
        fullVersion: "4.2.0",
        title: document.title,
        version: function(memberCount) {
           if (!memberCount) return this.fullVersion;
           const separator = ".";
           return this.fullVersion.split(separator).slice(0, memberCount).join(separator);
        },
    };
})();

function showSample(title, doNotEvaluate, strict) {
   const goodJavaScriptEngine = (() => {
      try {
          const advanced = !!Function("class a{ #b; }");
          return advanced;
      } catch {
          return false;
      }
   })();
   if (!goodJavaScriptEngine) {
      window.onload = () => {
         const element = document.createElement("p");
         element.style.cssText = "font-family: sans-serif; margin: 1em; color: black; font-size: 110%";
         element.innerHTML = `With this browser, JavaScript Playground can be used as a JavaScript calculator only.<br/><br/>
         To use playgroundAPI, and redirect HTML with your JavaScipt code to JavaScript Playground,
         the browsers based on Blink+V8 engines are recommended.<br/>
         It includes Chromium, Chrome, Opera, Vivaldi,
         Microsoft Edge v.&thinsp;80.0.361.111 or later, and more.`
         document.body.appendChild(element);
      };
      return;
   } //if
   const scripts = document.getElementsByTagName("script");
   let path = scripts[0].src;
   path = path.split('?')[0];
   path = path.split('/').slice(0, -1).join('/')+'/index.html';
   const code = (() => {
      for (let index = 0; index < scripts.length; ++index) {
         const script = scripts[index];
         const text = script.text;
         if (text)
            return text.trim();
      } //loop
      return null;
   })();
   if (!title)
      title = (value => {
         return value.replace(/.*\/(.+)\..*/g, "$1");
      })(window.location.toString());
   JavaScriptPlaygroundAPI.userCall(path, code, title, doNotEvaluate, strict);
} //showSample

const JavaScriptPlaygroundAPI = {
   APIDataKey: "S. A. Kryukov JavaScript Playground API",
   storage: sessionStorage,
   userCall: function (path, code, title, doNotEvaluate, strict) {
      this.storage.setItem(this.APIDataKey, JSON.stringify({ code: code, doNotEvaluate: doNotEvaluate, strict: strict, title: title }));
      document.location = path;
   },
   // host's internal:
   onLoad: function (handler) {
      const item = this.storage.getItem(this.APIDataKey);
      this.storage.removeItem(this.APIDataKey);
      if (!item) return;
      const script = JSON.parse(item);
      if (!script) return;
      if (handler)
         handler(script.title, script.code, script.doNotEvaluate, script.strict);
   },
}; //JavaScriptPlaygroundAPI
