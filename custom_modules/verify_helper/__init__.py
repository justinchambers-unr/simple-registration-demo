def good_state(state_code):
    state_map = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL",
                 "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE",
                 "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD",
                 "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
    try:
        state_map.index(state_code)
    except IndexError:
        state_code = state_code + " is not a valid state code."
        return 1
    return 0


def good_zip(zip_code):
    msg = zip_code + " is not a valid zip code."
    if len(zip_code) == 5 or len(zip_code) == 10:
        first_part = 0
        try:
            first_part = int(zip_code[0:5])
        except ValueError:
            zip_code = msg
            return 1
        if 9999 < first_part < 100000:
            if len(zip_code) == 10:
                dash = zip_code[5]
                last_part = 0
                if dash != "-":
                    zip_code = msg
                    return 1
                try:
                    last_part = int(zip_code[6:10])
                except ValueError:
                    zip_code = msg
                    return 1
                if 999 < last_part < 10000:
                    return 0
                else:
                    zip_code = msg
                    return 1
            else:
                return 0
        else:
            zip_code = msg
            return 1
    else:
        zip_code = msg
        return 1


def good_country(country_code):
    if country_code == "US":
        return 0
    country_code = country_code + " is not a valid country code."
    return 1


def has_text(field_value):
    if field_value != "":
        return 0
    field_value = field_value + "This field is required."
    return 1


def run_verify_helper(data):
    errors = 0
    verification_map = {
        "fname": has_text(data["fname"]),
        "lname": has_text(data["lname"]),
        "addr1": has_text(data["addr1"]),
        "addr2": lambda: 0,
        "city": has_text(data["city"]),
        "state": good_state(data["state"]),
        "zipcode": good_zip(data["zipcode"]),
        "country": good_country(data["country"])
    }
    for key in data:
        errors += verification_map[key]
        print(data[key])
        if errors > 0:
            return "Invalid Registration Data"
        else:
            return "OK"
