import pandas as pd
import requests
from config import key
from jsonconvert import to_TEU_json


def get_data():

    # ------------ Import ------------ #
    # Dictionary for the headers
    portVar = pd.read_html('https://api.census.gov/data/timeseries/intltrade/imports/porths/variables.html')[0]
    portDict = dict(zip(portVar["Name"], portVar["Label"].str.replace('15-digit ', '')))

    # Port and Container Count
    portURL = 'https://api.census.gov/data/timeseries/intltrade/imports/porths?get='
    portURLreq = requests.get(f"{portURL}PORT,PORT_NAME,CNT_WGT_MO&time=from+2019+to+2021&key={key}")

    portData = portURLreq.json()
    portDF = pd.DataFrame(portData, columns=portData[0]).drop([0]).rename(columns=portDict)

    port = portDF[~portDF['150-character Port Name'].str.contains("TOTAL")].drop(columns=['4-character Port Code']).rename(columns={'150-character Port Name':'Port','ISO-8601 Date/Time value':'Date'})
    port['Date'] = pd.to_datetime(port['Date'])


    portCOL = port.columns.drop(['Port',"Date"])
    port[portCOL] = port[portCOL].apply(pd.to_numeric, errors='coerce')

    portCT = port.groupby(['Date','Port']).sum().rename(columns={'Containerized Vessel Shipping Weight':'Weight'})


    # Estimate TEU Count (Twenty Equivalent Count) = 1 Twenty Foot Container

    portCT = portCT[(portCT.Weight != 0)]
    cityportTEU = portCT.copy()
    cityportTEU['TEU'] = cityportTEU['Weight'].floordiv(24000)



    cityportTEU = cityportTEU.groupby(['Date','Port']).sum().sort_values('TEU')
    cityportTEU = cityportTEU[(cityportTEU.TEU != 0)].reset_index()


    filename = "./static/data/cityportTEU2"

    TEU_data = to_TEU_json(cityportTEU, filename)


    cargo_data = TEU_data

    return(cargo_data)
