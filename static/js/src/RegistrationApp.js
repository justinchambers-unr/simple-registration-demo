class RegistrationApp {
    constructor() {
        const r = this;
        r.element = {};
        r.readyToRegister = false;
        r._goodZIP = r._goodZIP.bind(this);
        r._attachEvents = r._attachEvents.bind(r);
        r._build = r._build.bind(r);
        r._hasText = r._hasText.bind(r);
        r._verify = r._verify.bind(r);
        r._build();
    }
    _attachEvents() {
        const r = this;
        $("#submit-info").on("click", r._verify);
    }
    _build() {
        const r = this;
        r.element = document.createElement("aside");
        r.element.id = "registration-app-result";
        document.body.appendChild(r.element);
        r._attachEvents();
    }
    _hasText(field) {
        const r = this;
        console.log("Has text? " + !(field.value === ""));
        return !(field.value === "");
    }
    _goodZIP(field) {
        const r = this;
        console.log("Is number? " + !isNaN(field.value));
        console.log("Is in range? " + ((field.value < 100000) && (field.value > 9999)));
        console.log("Is integer? " + (field.value % 1 === 0));
        return (!isNaN(field.value) && field.value < 100000 && field.value > 9999 && (field.value % 1 === 0));
    }
    _verify() {
        const r = this,
              fs = $("fieldset")[0],
              list = document.createElement("ul"),
              status = document.createElement("p");
        //console.log(fs);
        r.element.innerHTML = "";
        r.readyToRegister = false;
        $.each(fs.children, (i, c) => {
            if(c.nodeName === "INPUT") {
                const item = document.createElement("li");
                item.innerText = c.name + ":" + c.value;
                list.appendChild(item);
                if(c.id !== "addr2") {
                    if(c.id === "zipcode") {
                        r.readyToRegister = r.readyToRegister && r._goodZIP(c) && r._hasText(c);
                    } else {
                        r.readyToRegister = r._hasText(c);
                    }
                }
                if(r.readyToRegister === false) {
                    r.element.innerHTML = "Registration info invalid.";
                    return false;
                }
            }
        });
        r.element.appendChild(list);
        status.innerText = "Ready to register? " + r.readyToRegister;
        r.element.appendChild(status);
    }
}
$(() => {
    "use strict";
    const app = new RegistrationApp();
    console.log("RegistrationApp.js is ready...");
});
