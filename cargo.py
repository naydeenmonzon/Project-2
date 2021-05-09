import os
import pandas as pd
from pandas.plotting import table
import requests
import json
from config import key, bkey
import numpy as np
import matplotlib.pyplot as plt
from matplotlib import cbook, ticker, units
import datetime
import functools
import re


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

    portCOL = port.columns.drop(['Port',"Date"])
    port[portCOL] = port[portCOL].apply(pd.to_numeric, errors='coerce')

    # Consolidate Port by State
    portST = port.copy()
    portST['Port State'] = port['Port'].str[-2:]

    portST = portST.groupby(['Date','Port State']).sum().reset_index().rename(columns={'Containerized Vessel Shipping Weight':'Weight'})

    cleanPort = portST[(portST.Weight != 0)]

    # Estimate TEU Count (Twenty Equivalent Count) = 1 Twenty Foot Container

    portTEU = cleanPort.copy()
    portTEU['TEU'] = portTEU['Weight'].floordiv(24000)


    # Heatmap - Total Container Count by State & Date
    portTEUdf = portTEU.pivot(index="Date", columns="Port State", values="TEU")
    portTEUdf.to_csv("./static/data/port.csv")

    portTable = portTEUdf.to_html().replace('\n', '')

    cargo_data = {
        'port_table': portTable
    }

    return(cargo_data)
