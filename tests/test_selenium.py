import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options

# Create screenshots directory to store "video frames" of live testing
SCREENSHOT_DIR = os.path.join(os.path.dirname(__file__), "screenshots")
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

def take_frame(driver, step_name):
    """Save screenshot mimicking a live video test frame."""
    path = os.path.join(SCREENSHOT_DIR, f"{step_name}.png")
    driver.save_screenshot(path)
    print(f"Captured frame: {path}")

def run_realtime_web_test():
    print("Initializing Selenium Web Driver (Headless Chrome)...")
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1280,1024")
    
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        # Base URL of our React web application running locally
        base_url = "http://localhost:5173"
        print(f"Navigating to web app: {base_url}")
        driver.get(base_url)
        time.sleep(2)
        take_frame(driver, "001_landing_page")

        # 1. Register a new user
        print("Navigating to signup page...")
        driver.find_element(By.LINK_TEXT, "Sign Up").click()
        time.sleep(1)
        take_frame(driver, "002_signup_form")
        
        print("Filling registration form...")
        driver.find_element(By.ID, "register-name-input").send_keys("Selenium Test User")
        driver.find_element(By.ID, "register-email-input").send_keys("selenium_test@example.com")
        driver.find_element(By.ID, "register-password-input").send_keys("password123")
        take_frame(driver, "003_signup_filled")
        driver.find_element(By.XPATH, "//button[@type='submit']").click()
        time.sleep(2.5) # Wait for registration redirect
        
        # 2. Login
        print("Filling login details...")
        driver.find_element(By.ID, "login-email-input").send_keys("selenium_test@example.com")
        driver.find_element(By.ID, "login-password-input").send_keys("password123")
        take_frame(driver, "004_login_filled")
        driver.find_element(By.XPATH, "//button[@type='submit']").click()
        time.sleep(2)
        take_frame(driver, "005_logged_in_dashboard")

        # 3. Search and filter product catalog
        print("Searching for headphones...")
        driver.find_element(By.LINK_TEXT, "Browse Shop").click()
        time.sleep(1.5)
        take_frame(driver, "006_shop_catalog")
        
        search_box = driver.find_element(By.ID, "search-input-desktop")
        search_box.send_keys("AeroPods")
        search_box.send_keys(Keys.ENTER)
        time.sleep(1.5)
        take_frame(driver, "007_search_results_filtered")

        # 4. Product details page & Clickstream view tracking
        print("Viewing product details...")
        # Click on AeroPods Max item
        driver.find_element(By.XPATH, "//h3[contains(text(), 'AeroPods')]").click()
        time.sleep(2)
        take_frame(driver, "008_product_details_page")

        # 5. Add to Cart
        print("Adding product to cart...")
        driver.find_element(By.XPATH, "//button[contains(text(), 'Add To Cart')]").click()
        time.sleep(1)
        take_frame(driver, "009_added_to_cart_state")

        # 6. View Cart and checkout
        print("Navigating to cart and checking out...")
        driver.find_element(By.XPATH, "//a[contains(@href, '/cart')]").click()
        time.sleep(1.5)
        take_frame(driver, "010_cart_view")
        
        driver.find_element(By.XPATH, "//button[contains(text(), 'Proceed To Checkout')]").click()
        time.sleep(2)
        take_frame(driver, "011_order_checkout_confirmation")

        # 7. Admin Dashboard and Analytics view check
        # Logout and log in as seeded Admin user
        print("Logging out to check admin console...")
        driver.find_element(By.XPATH, "//button[contains(@title, 'Logout')]").click()
        time.sleep(1)
        driver.get(f"{base_url}/login")
        time.sleep(1)
        driver.find_element(By.ID, "login-email-input").send_keys("admin@smartshop.ai")
        driver.find_element(By.ID, "login-password-input").send_keys("admin123")
        driver.find_element(By.XPATH, "//button[@type='submit']").click()
        time.sleep(2)
        take_frame(driver, "012_admin_analytics_dashboard")

        print("Testing Completed Successfully! Live video frames saved in tests/screenshots/")

    except Exception as e:
        print(f"Selenium Test Failed: {str(e)}")
        take_frame(driver, "999_error_frame")
    finally:
        driver.quit()

if __name__ == "__main__":
    run_realtime_web_test()
