Live-Backend Documentation
-----------------------------------

# 1. Project Structure
This project consists of the following components:
- __app__

    This is the main component of the project, it consists of all main sub-modules of the project. These modules are used to handle data, manage connections from the client.
    - controller
        - controller.py
        - contrller_load_planning.py
        - controler_port.py
        - controler_region.py
        - controler_vehicle.py
        - controler_vessel.py
    - crawler
    - models.py
    - app.py
- __settings__
- __.gitignore__
- __chromedriver__
- __main.py__
- __manage_schedule.py__
- __README.md__
- __requirements.txt__

# 2. Deployment
## 2.1. Minimum Requirements (main libraries)
- selenium
- sqlalchemy

## 2.2. Deployment
- Install miniconda, download [here](https://docs.conda.io/en/latest/miniconda.html).

    E.g, For Linux distribution:
    
    Be Careful: install prefix must be: /home/${USER}

    ```bash
    wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
    bash Miniconda3-latest-Linux-x86_64.sh
    ```
   
- Create conda environment and activate it:
    ```bash
    conda activate
    conda install python=3.6
    ```
 
- Install required dependencies:
    ```bash
    sudo apt install unixodbc-dev -y
    sudo apt-get install libmysqlclient-dev -y
    sudo apt-get install chromium-browser - y
    sudo chmod 755 /opt/live-crawler/chromedriver
    pip install -r requirements.txt
    ```
- Change mysql configl:
    
    Goto settings/config.py and edit the mysql configuration
    
    Your database must be the same with live-backend

- Test crawler:
    ```bash
    python main.py
    ```

**Notes**: To run project in the background, you should use [**`tmux`**](https://gist.github.com/ladin157/d2f6bfa09df584ec13f3f6e2055952b7) to manage processes. 

# 3. Tips
- Install all dependencies in Linux distribution before installing the packages to avoiding errors during installation.
- If you get any trouble while installing a dependency, install it separately using conda.
    ```bash
    conda install <package_name>
    ``` 
- Each service is running under `tmux` process.
# 4. Run scheduler at minute 0 past every 12th hour.
- Run "crontab -e" and insert command bellow to end of the file
    ```bash
    0 */12 * * * cd /opt/live-crawler && /home/spham/miniconda3/bin/python main.py && /usr/bin/pkill -o chromium
    ```
