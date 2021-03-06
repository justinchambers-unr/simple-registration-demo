class RegistrationApp {
    constructor() {
        const r = this;
        r.element = {};
        r.errors = 0;
        r.states = [  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL",
                      "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE",
                      "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD",
                      "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"  ];
        r.goodData = false;
        r.name_schema = /^[A-Z][a-zA-Z .-]{0,23}[a-z?]$/;
        r.name2_schema = /^[A-Z][a-zA-Z .-]{0,48}[a-z]$/;
        r.addr_schema = /^[A-Z0-9][a-zA-Z0-9 .-]{4,48}[a-zA-Z0-9 .]$/;
        r.addr2_schema = /^[A-Z0-9]?[a-zA-Z0-9 .]{0,48}[a-z0-9]?$/;
        r.zip_schema = /^[0-9]{5}([-][0-9]{4})?$/;
        r.label_map = {
            "fname" : "First Name",
            "lname" : "Last Name",
            "addr1" : "Address 1",
            "addr2" : "Address 2",
            "city" : "City",
            "state" : "State",
            "zipcode" : "Zip",
            "country" : "Country"
        };
        r._attachEvents = r._attachEvents.bind(r);
        r._build = r._build.bind(r);
        r._goodState = r._goodState.bind(r);
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
        $("#registration-aside-container").append(r.element);
        $("#country").prop("disabled", true);
        r._attachEvents();
    }
    _goodState(code) {
        const r = this;
        return r.states.find( state => { return state === code; } ) !== undefined;
    }
    _onSuccess(d) {
        const r = this,
              cntry = $("#country"),
              status = document.createElement("p"),
              hint = document.createElement("p"),
              frm = $("#registration-form").children()[0],
              data = JSON.parse(d),
              list = document.createElement("ul");
        $(":input").prop("value", "");
        $("fieldset")[0].style.display = "none";
        cntry.prop("value", "US");
        cntry.prop("disabled", true);
        $(frm).text($(frm).text() + " - Confirmation");
        status.innerText = "Server-side validation complete. Status = " + data.status;
        hint.innerText = "Refresh this page to enter another record.";
        r.element.appendChild(status);
        for(const key in data) {
            if(data.hasOwnProperty(key)) {
                if(key !== "status") {
                    const item = document.createElement("li");
                    item.innerText = r.label_map[key] + " : " + data[key];
                    list.appendChild(item);
                }
            }
        }
        r.element.appendChild(list);
        r.element.appendChild(hint);
    }
    _submit() {
        const r = this,
              fs = $("fieldset")[0];
        r._verify(fs);
        if(r.errors === 0) {
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
    _verify(fs) {
        const r = this;
        r.element.innerHTML = "";
        r.errors = 0;
        $.each(fs.children, (i, c) => {
            if(c.nodeName === "INPUT") {
                c.style.backgroundColor = "#ffffff";
                switch(c.id) {
                    case "city":
                        r.goodData = r.name2_schema.test(c.value);
                        break;
                    case "state":
                        r.goodData = r._goodState(c.value);
                        break;
                    case "zipcode":
                        r.goodData = r.zip_schema.test(c.value);
                        break;
                    case "addr1":
                        r.goodData = r.addr_schema.test(c.value);
                        break;
                    case "addr2":
                        r.goodData = r.addr2_schema.test(c.value);
                        break;
                    case "country":
                        r.goodData = () => { return c.value === "US"; };
                        break;
                    default:
                        r.goodData = r.name_schema.test(c.value);
                        break;
                }
                if(!r.goodData) {
                    r.errors++;
                    const msg = " - invalid data";
                    c.style.backgroundColor = "#f2dede";
                    c.value += msg;
                } else {
                    c.style.backgroundColor = "#dff0d8";
                }
            }
        });
        if(r.errors > 0) {
            r.element.innerHTML = "<p>Client-side validation complete. Status = Invalid data.</p>";
            return false;
        }
    }
}
$(() => {
    "use strict";
    const app = new RegistrationApp();
    // data for testing...
    /*
    $("#fname").attr("value", "Don");
    $("#lname").attr("value", "Quixote");
    $("#addr1").attr("value", "One Castle Ln");
    $("#city").attr("value", "San Francisco");
    $("#state").attr("value", "CA");
    $("#zipcode").attr("value", "94016-0000");
    */
});