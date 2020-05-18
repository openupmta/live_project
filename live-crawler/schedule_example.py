import gc
import os
import time

import schedule


def job():
    print("=============================================")
    print("Scheduling work at 03:00 everyday (German Time).")
    try:
        print("Start new work...\n")
        # start_main()
        # bulk_update.run()
        print("Finish working!")
        gc.collect()
    except Exception as e:
        print("Error " + e.__str__())
    print("=============================================")


def scheduling_work():
    print("=============================================")
    print("Wait to 02:00 (server time) to start new update...")
    # schedule.every().day.at("02:00").do(job)
    schedule.every(1).minute.do(job)
    # schedule.every(5).seconds.do(job_func=func)
    while True:
        # run_at_specific_time()
        # print("Wait to 21:54 to start new update...")
        schedule.run_pending()
        time.sleep(1)
    print("=============================================")


if __name__ == '__main__':
    os.environ.setdefault('Database_Setting_Module', 'settings.parameters')
    # scheduling_work()
    try:
        print("Start working...\n")
        scheduling_work()
        # bulk_update.run()
        print("Finish working!")
        gc.collect()
    except Exception as e:
        print("Error " + e.__str__())
