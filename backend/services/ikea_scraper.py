"""
Enhanced IKEA Product Scraper Service using Selenium
Renders JavaScript to access dynamically loaded content
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import time
import re
import json
from typing import Dict, List, Optional
from functools import lru_cache
import logging
from urllib.parse import quote

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EnhancedIKEAScraperService:
    def __init__(self, headless: bool = True):
        """
        Initialize the scraper with Selenium WebDriver
        
        Args:
            headless: Run browser in headless mode (no GUI)
        """
        self.base_url = "https://www.ikea.com"
        self.headless = headless
        self.driver = None
        self._product_cache = {}
        self._search_cache = {}
        
    def _init_driver(self):
        """Initialize or reinitialize the Selenium driver"""
        if self.driver:
            try:
                self.driver.quit()
            except:
                pass
        
        chrome_options = Options()
        
        if self.headless:
            chrome_options.add_argument('--headless')
        
        # Additional options to avoid detection and improve performance
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        # Disable images for faster loading (optional)
        # prefs = {"profile.managed_default_content_settings.images": 2}
        # chrome_options.add_experimental_option("prefs", prefs)
        
        try:
            # Use webdriver-manager to automatically handle ChromeDriver
            # Fix for macOS ARM64 architecture - use the correct executable path
            import platform
            import os
            
            if platform.system() == "Darwin" and platform.machine() == "arm64":
                # For ARM64 Mac, manually construct the correct path
                driver_path = ChromeDriverManager().install()
                # The webdriver-manager returns the wrong file, find the actual chromedriver executable
                base_dir = os.path.dirname(driver_path)
                actual_driver = os.path.join(base_dir, "chromedriver")
                if os.path.exists(actual_driver):
                    driver_path = actual_driver
                else:
                    # Try alternative path structure
                    alt_path = os.path.join(base_dir, "chromedriver-mac-arm64", "chromedriver")
                    if os.path.exists(alt_path):
                        driver_path = alt_path
                service = Service(driver_path)
            else:
                service = Service(ChromeDriverManager().install())
            
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            logger.info("Chrome WebDriver initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Chrome WebDriver: {e}")
            logger.info("Make sure you have Chrome installed")
            raise
    
    def search_products_via_selenium(self, query: str, limit: int = 2) -> List[str]:
        """
        Search IKEA using Selenium and extract product IDs
        """
        cache_key = f"selenium_{query}_{limit}"
        if cache_key in self._search_cache:
            logger.info(f"Using cached search results for: {query}")
            return self._search_cache[cache_key]
        
        if not self.driver:
            self._init_driver()
        
        try:
            search_url = f"{self.base_url}/us/en/search/?q={quote(query)}"
            logger.info(f"Searching IKEA for: {query} at {search_url}")
            
            self.driver.get(search_url)
            
            # Wait for search results to load
            try:
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='plp-product-card'], .plp-fragment-wrapper, .search-grid__item, .product-fragment"))
                )
                logger.info("Search results loaded")
            except TimeoutException:
                logger.warning("Timeout waiting for search results")
            
            # Small delay to ensure all content is loaded
            time.sleep(2)
            
            # Extract product URLs/IDs using multiple selectors
            product_ids = set()
            
            # Try multiple CSS selectors that IKEA might use
            selectors = [
                "a[href*='/p/']",  # Generic product links
                "[data-testid='plp-product-card'] a",
                ".plp-fragment-wrapper a",
                ".search-grid__item a",
                ".product-fragment a",
                ".serp-grid__item a"
            ]
            
            for selector in selectors:
                try:
                    elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    for element in elements:
                        href = element.get_attribute('href')
                        if href and '/p/' in href:
                            # Extract product ID from URL
                            match = re.search(r'/p/([^/]+)/', href)
                            if match:
                                product_id = match.group(1)
                                product_ids.add(product_id)
                                if len(product_ids) >= limit:
                                    break
                except Exception as e:
                    logger.debug(f"Selector {selector} failed: {e}")
                
                if len(product_ids) >= limit:
                    break
            
            # Convert to list
            product_ids = list(product_ids)[:limit]
            
            if product_ids:
                self._search_cache[cache_key] = product_ids
                logger.info(f"Found {len(product_ids)} products for: {query}")
            else:
                logger.warning(f"No products found for: {query}")
                # Save page source for debugging
                with open(f'debug_search_{query.replace(" ", "_")}.html', 'w', encoding='utf-8') as f:
                    f.write(self.driver.page_source)
                logger.info(f"Saved page source to debug_search_{query.replace(' ', '_')}.html")
            
            return product_ids
            
        except Exception as e:
            logger.error(f"Error searching for '{query}': {e}")
            return []
    
    def fetch_product_selenium(self, product_id: str) -> Optional[Dict]:
        """
        Fetch product data using Selenium by visiting the product page
        """
        if product_id in self._product_cache:
            logger.info(f"Using cached product data for: {product_id}")
            return self._product_cache[product_id]
        
        if not self.driver:
            self._init_driver()
        
        try:
            product_url = f"{self.base_url}/us/en/p/{product_id}/"
            logger.info(f"Fetching product: {product_id}")
            
            self.driver.get(product_url)
            
            # Wait for product page to load
            try:
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, ".pip-header-section, [data-testid='pip-product-name'], h1"))
                )
            except TimeoutException:
                logger.warning(f"Timeout loading product page for {product_id}")
            
            time.sleep(2)  # Allow time for dynamic content
            
            # Extract product information
            product = {
                "product_id": product_id,
                "url": product_url,
                "name": self._extract_text([
                    "[data-testid='pip-product-name']",
                    ".pip-header-section h1",
                    "h1.pip-header-section__title",
                    "h1"
                ]),
                "price": self._extract_price([
                    "[data-testid='pip-product-price']",
                    ".pip-temp-price__integer",
                    ".pip-price__integer",
                    "span[class*='price']"
                ]),
                "description": self._extract_text([
                    "[data-testid='pip-product-description']",
                    ".pip-product-summary__description",
                    "div[class*='description']"
                ]),
                "image": self._extract_image([
                    "[data-testid='pip-product-image'] img",
                    ".pip-image__main img",
                    "img[class*='product']"
                ]),
                "colors": self._extract_colors(),
                "dimensions": self._extract_dimensions()
            }
            
            # Cache the product
            self._product_cache[product_id] = product
            
            logger.info(f"Successfully fetched product: {product['name']}")
            return product
            
        except Exception as e:
            logger.error(f"Error fetching product {product_id}: {e}")
            return None
    
    def _extract_text(self, selectors: List[str]) -> str:
        """Try multiple selectors to extract text"""
        for selector in selectors:
            try:
                element = self.driver.find_element(By.CSS_SELECTOR, selector)
                text = element.text.strip()
                if text:
                    return text
            except NoSuchElementException:
                continue
        return ""
    
    def _extract_price(self, selectors: List[str]) -> Optional[float]:
        """Extract and parse price"""
        for selector in selectors:
            try:
                element = self.driver.find_element(By.CSS_SELECTOR, selector)
                text = element.text.strip()
                # Extract numeric value
                match = re.search(r'[\$]?\s*(\d+[\.,]?\d*)', text)
                if match:
                    price_str = match.group(1).replace(',', '')
                    return float(price_str)
            except (NoSuchElementException, ValueError):
                continue
        return None
    
    def _extract_image(self, selectors: List[str]) -> str:
        """Extract image URL"""
        for selector in selectors:
            try:
                element = self.driver.find_element(By.CSS_SELECTOR, selector)
                src = element.get_attribute('src')
                if src and src.startswith('http'):
                    return src
            except NoSuchElementException:
                continue
        return ""
    
    def _extract_colors(self) -> List[str]:
        """Extract available colors"""
        colors = []
        selectors = [
            "[data-testid='pip-color-option']",
            ".pip-color-picker__option",
            "button[class*='color']"
        ]
        
        for selector in selectors:
            try:
                elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                for element in elements:
                    color = element.get_attribute('aria-label') or element.text
                    if color:
                        colors.append(color.strip())
            except:
                continue
        
        return colors
    
    def _extract_dimensions(self) -> List[str]:
        """Extract product dimensions"""
        dimensions = []
        selectors = [
            ".pip-product-dimensions__measurement",
            "[data-testid='measurements']",
            "div[class*='dimension']"
        ]
        
        for selector in selectors:
            try:
                elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                for element in elements:
                    dim = element.text.strip()
                    if dim:
                        dimensions.append(dim)
            except:
                continue
        
        return dimensions
    
    def fetch_multiple_products(self, product_ids: List[str]) -> List[Dict]:
        """Fetch multiple products with rate limiting"""
        products = []
        
        for i, product_id in enumerate(product_ids):
            product = self.fetch_product_selenium(product_id)
            if product:
                products.append(product)
            
            # Rate limiting
            if i < len(product_ids) - 1:
                time.sleep(0.5)  # Minimal rate limiting
        
        return products
    
    def search_and_fetch_products(self, search_terms: List[str], limit_per_term: int = 1) -> List[Dict]:
        """Search for products using multiple terms and fetch their data"""
        all_product_ids = set()
        
        # Search for each term
        for term in search_terms:
            product_ids = self.search_products_via_selenium(term, limit_per_term)
            all_product_ids.update(product_ids)
            time.sleep(0.5)  # Minimal rate limiting for fastest response
        
        # Convert to list and limit total results (minimal for fast response)
        product_ids = list(all_product_ids)[:5]
        
        if not product_ids:
            logger.warning("No product IDs found for search terms")
            return []
        
        # Fetch product data
        products = self.fetch_multiple_products(product_ids)
        
        logger.info(f"Successfully fetched {len(products)} products from {len(product_ids)} IDs")
        return products
    
    def generate_search_terms(self, gemini_data: Dict) -> List[str]:
        """Generate search terms from Gemini analysis data"""
        search_terms = []
        
        # Direct furniture terms
        furniture_identified = gemini_data.get("furniture_identified", [])
        for item in furniture_identified[:3]:  # Limit to top 3
            search_terms.append(item)
        
        # Style-based searches
        style = gemini_data.get("style", "").lower()
        if style:
            search_terms.append(f"{style} furniture")
        
        # Color-based searches
        color_scheme = gemini_data.get("color_scheme", [])
        for color in color_scheme[:2]:
            search_terms.append(f"{color} furniture")
        
        # Room-specific searches
        room_type = gemini_data.get("room_type", "")
        if room_type:
            search_terms.append(f"{room_type} furniture")
        
        # Remove duplicates and empty terms
        search_terms = list(set([term.strip() for term in search_terms if term.strip()]))
        
        logger.info(f"Generated {len(search_terms)} search terms: {search_terms}")
        return search_terms[:10]  # Limit to 10 terms max
    
    def close(self):
        """Close the browser and clean up"""
        if self.driver:
            try:
                self.driver.quit()
                logger.info("WebDriver closed")
            except Exception as e:
                logger.error(f"Error closing WebDriver: {e}")
    
    def __del__(self):
        """Cleanup on deletion"""
        self.close()
    
    def clear_cache(self):
        """Clear all caches"""
        self._product_cache.clear()
        self._search_cache.clear()
        logger.info("All caches cleared")
    
    def get_cache_stats(self) -> Dict:
        """Get cache statistics"""
        return {
            "product_cache_size": len(self._product_cache),
            "search_cache_size": len(self._search_cache)
        }

# Create a singleton instance
ikea_scraper_service = EnhancedIKEAScraperService()