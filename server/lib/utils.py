import json

def prepare_output(s) -> object | None:

  
    l, r = 0, len(s) - 1
    for i in range(len(s)):
        if s[i] == "{":
            l = i
            break

    for i in range(len(s) - 1, 0, -1):
       
        if s[i] == "}":
          
            r = i + 1
            break
    
    try:
        
        return json.loads(s[l:r])
    except Exception as e:
        return None

