import json


    
def to_TEU_json(df, filename):
    """Convert dataframe into nested JSON as in flare files used for D3.js"""
    TEUdict = dict()
    d = {"name": "Total Weight & TEU Count", "children": []}
    
    for index, row in df.iterrows():
        Date = row[0].strftime("%Y %B")
        parent = row[1]
        Weight = row[2]
        TEU = row[3]


        # Make a list of keys
        key_list = []
        for item in d['children']:
            key_list.append(item['name'])

        #if 'parent' is NOT a key in flare.JSON, append it
        if not parent in key_list:
            d['children'].append({"name": parent, "children":[{
                "name": Date,"children":[{
                    "name": "Weight", "value": Weight},
                    {"name": "TEU Count", "value": TEU}]}]})
        # if parent IS a key in flare.json, add a new child to it
        else:
            d['children'][key_list.index(parent)]['children'].append({
                "name": Date,"children":[{
                    "name": "Weight", "value": Weight},
                    {"name": "TEU Count", "value": TEU}]})
    
    TEUdict = d
    # print(json.dumps(TEUdict, indent=4))
    # export the final result to a json file
    with open(filename +'.json', 'w') as outfile:
        json.dump(TEUdict, outfile, indent=4)
    return (TEUdict)
    
    