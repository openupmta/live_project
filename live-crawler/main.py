import os
from imp import load_compiled
crawler = load_compiled('a', 'app/crawler/crawler.bin')  # this code use for obfuscate crawler file code


current_path = os.getcwd() # os.path.dirname(__file__)
chromedriver = os.path.join(current_path, 'chromedriver')

if __name__ == '__main__':
    print(chromedriver)
    crawler.start(chromedriver=chromedriver)
