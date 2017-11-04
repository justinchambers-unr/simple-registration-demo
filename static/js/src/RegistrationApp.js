class RegistrationApp {
    constructor() {
        const r = this;
        r.element = {};
        r._build = r._build.bind(r);
        r._verify = r._verify.bind(r);
        r._build();
    }
    _build() {
        const r = this;
        r.element = document.createElement("aside");
        r.element.id = "registration-app-result";
        document.body.appendChild(r.element);
        document.getElementById("submit-info").addEventListener("click", r._verify);
    }
    _verify() {
        const r = this,
              fs = $("fieldset")[0],
              list = document.createElement("ul");
        //console.log(fs);
        r.element.innerHTML = "";
        $.each(fs.children, (i, c) => {
            if(c.nodeName == "INPUT") {
                const item = document.createElement("li");
                item.innerText = c.value;
                list.appendChild(item);
            }
        });
        r.element.appendChild(list);
    }
}
$(() => {
    "use strict";
    const app = new RegistrationApp();
    console.log("RegistrationApp.js is ready...");
});