import time
from dotenv import load_dotenv
import os
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

load_dotenv()
admin_user = os.getenv("USERNAME")
admin_pass = os.getenv("PASSWORD")
url = os.getenv("API_URL")
url_report = os.getenv("API_REPORT")

def run_bot():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')

    driver = webdriver.Chrome(options=options)

    try:
        driver.get(url)
        time.sleep(1)

        driver.find_element("name", "username").send_keys(admin_user)
        driver.find_element("name", "password").send_keys(admin_pass)
        driver.find_element("tag name", "form").submit()
        time.sleep(2)

        driver.get(url_report)
        print(f"[ADMIN BOT] Checked reports at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        time.sleep(3)

    finally:
        driver.quit()

if __name__ == "__main__":
    run_bot()