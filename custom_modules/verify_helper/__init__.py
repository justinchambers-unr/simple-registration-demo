import re

name_schema = re.compile("^[A-Z]([a-zA-Z][-]?){0,23}([a-z]?)$")
name2_schema = re.compile("^[A-Z][a-zA-Z .\-?]{0,48}[a-z?]$")
addr_schema = re.compile("^[A-Z0-9][a-zA-Z0-9 .]{0,49}$")
addr2_schema = re.compile("^([A-Z0-9][a-zA-Z0-9?\s.]?){0,49}$")
zip_schema = re.compile("^[0-9]{5}([-][0-9]{4})?$")
errors = []


def match_string_to_schema(regex, str):
    res = regex.match(str)
    print(res)
    if not res:
        errors.append(str)


def match_state(state_code):
    state_map = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL",
                 "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE",
                 "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD",
                 "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
    try:
        state_map.index(state_code)
    except IndexError:
        msg = state_code + " is not a valid state code."
        errors.append(msg)


def match_country(country_code):
    if country_code != "US":
        msg = country_code + " is not a valid country (US only)"
        errors.append(msg)


def run_verify_helper(data):
    match_string_to_schema(name_schema, data["fname"])
    match_string_to_schema(name_schema, data["lname"])
    match_string_to_schema(addr_schema, data["addr1"])
    match_string_to_schema(addr2_schema, data["addr2"])
    match_string_to_schema(name2_schema, data["city"])
    match_state(data["state"])
    match_string_to_schema(zip_schema, data["zipcode"])
    match_country(data["country"])
    return errors
