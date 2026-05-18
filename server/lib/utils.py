import json

def prepare_output(s) -> object | None:

    b_set = set()
    l, r = 0, 1
    for i in range(len(s)):
        if s[i] == "{" and "{" not in b_set:
            b_set.add("{")
            l = i
            break

    for i in range(len(s) - 1, 0, -1):
        if s[i] == "}" and "}" not in b_set:
            b_set.add("}")
            r = i
            break
    
    try:
        return json.loads(s[l, r +1])
    except Exception as e:
        return None
