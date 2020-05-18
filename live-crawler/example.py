import time
from selenium import webdriver
import pandas as pd

import datetime
import logging
from selenium.webdriver.chrome.options import Options
from tqdm import tqdm
from selenium import webdriver
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait


chrome_options = Options()
# chrome_options.add_argument("--headless")
# chrome_options.add_argument("--incognito")

# Optional argument, if not specified will search path.
driver = webdriver.Chrome('chromedriver.exe',
                                       chrome_options=chrome_options)
# url = "http://www.bursamalaysia.com/market/securities/equities/prices/#/?filter=BS02"
# url = 'https://www.google.com/'
import os
root_path = os.path.dirname(__file__)
# url = os.path.join(root_path,'WebSpeed Script.html')
url = os.path.join(root_path,'Schiffsplanung.html')
page = driver.get(url)
time.sleep(2)

df = pd.read_html(driver.page_source)[0]
print(df.head())