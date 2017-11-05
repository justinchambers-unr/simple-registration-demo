class RegistrationApp {
    constructor() {
        const r = this;
        r.element = {};
        r.states = [  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL",
                      "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE",
                      "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD",
                      "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"  ];
        r.readyToRegister = false;
        r._attachEvents = r._attachEvents.bind(r);
        r._build = r._build.bind(r);
        r._goodState = r._goodState.bind(r);
        r._goodZIP = r._goodZIP.bind(r);
        r._hasText = r._hasText.bind(r);
        r._isInt = r._isInt.bind(r);
        r._isIntInRange = r._isIntInRange.bind(r);
        r._submit = r._submit.bind(r);
        r._verify = r._verify.bind(r);
        r._build();
    }
    _attachEvents() {
        const r = this;
        $("#submit-info").on("click", r._submit);
    }
    _build() {
        const r = this;
        r.element = document.createElement("aside");
        r.element.id = "registration-app-result";
        document.body.appendChild(r.element);
        $("#country").prop("disabled", true);
        r._attachEvents();
    }
    _goodState(code) {
        const r = this;
        return r.states.find( state => { return state === code; } ) !== undefined;
    }
    _goodZIP(field) {
        const r = this;
        if(field.value.length === 5 || field.value.length === 10) {
            const firstPart = field.value.substring(0,5);
            let dash = "",
                lastPart = "";
            let goodZIP = r._isInt(firstPart) && r._isIntInRange(firstPart, 9999, 100000);
            if(goodZIP && field.value.length === 10) {
                dash = field.value[5];
                lastPart = field.value.substring(6);
                goodZIP = (dash === "-") && r._isInt(lastPart) && r._isIntInRange(lastPart, 999, 10000);
            }
            return goodZIP;
        } else {
            return false;
        }

    }
    _hasText(field) {
        const r = this;
        console.log("Has text? " + !(field.value === ""));
        return !(field.value === "");
    }
    _isInt(val) {
        const r = this;
        const num = !(isNaN(val));
        const integ = (val % 1 === 0);
        return !(isNaN(val)) && (val % 1 === 0);
    }
    _isIntInRange(val, strict_lower, strict_upper) {
        const r = this;
        return val > strict_lower && val < strict_upper;
    }
    _submit() {
        const r = this,
              fs = $("fieldset")[0];
        r._verify(fs);
        if(r.readyToRegister) {
            $("#country").prop("disabled", false);
            const msg = document.createElement("p");
            msg.innerText = "Getting server-side validation...";
            r.element.appendChild(msg);
            $.ajax({
                url: "/verifying",
                data: $(fs).serialize(),
                type: "POST",
                success: response => {r._onSuccess(response);},
                error: err => { console.log(err); }
            });
        }
    }
    _onSuccess(d) {
        $("fieldset")[0].style.display = "none";
        $("#country").prop("disabled", true);
        const msg = document.createElement("p");
        const r = this,
              data = JSON.parse(d),
              list = document.createElement("ul");
        msg.innerText = "Server-side validation complete. Status = " + data.status;
        r.element.appendChild(msg);
        for(const key in data) {
            if(data.hasOwnProperty(key)) {
                if(key !== "status") {
                    const item = document.createElement("li");
                    item.innerText = key + " : " + data[key];
                    list.appendChild(item);
                }
            }
        }
        r.element.appendChild(list);
    }
    _verify(fs) {
        const r = this,
              list = document.createElement("ul"),
              status = document.createElement("p");
        r.element.innerHTML = "";
        r.readyToRegister = false;
        $.each(fs.children, (i, c) => {
            if(c.nodeName === "INPUT") {
                const item = document.createElement("li");
                item.innerText = c.name + " : " + c.value;
                list.appendChild(item);
                switch(c.id) {
                    case "state":
                        r.readyToRegister = r._goodState(c.value);
                        break;
                    case "zipcode":
                        r.readyToRegister = r._goodZIP(c);
                        break;
                    case "addr2":
                        break;
                    default:
                        r.readyToRegister = r._hasText(c);
                        break;
                }
                if(r.readyToRegister === false) {
                    r.element.innerHTML = "<p>Client-side validation complete. Status = Invalid data.</p>";
                    return false;
                } else {
                    r.element.innerHTML = "<p>Client-side validation complete. Status = Valid data.</p>";
                }
            }
        });
        r.element.appendChild(list);
        status.innerText = "OK to send to server? " + r.readyToRegister;
        r.element.appendChild(status);
    }
}
$(() => {
    "use strict";
    const app = new RegistrationApp();
    // for testing...
    $("#fname").attr("value", "J");
    $("#lname").attr("value", "Cham");
    $("#addr1").attr("value", "123 4th St");
    $("#city").attr("value", "Reno");
    $("#state").attr("value", "NV");
    $("#zipcode").attr("value", "89509");
});
