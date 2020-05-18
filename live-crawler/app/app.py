import pandas
from functools import reduce
import json
import sqlalchemy as db
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from settings.config import SqlConnectionParameter

mysql_params = SqlConnectionParameter.mysql_parameters

connection_string = "mysql+mysqldb://{}:{}@{}:{}/{}".format(mysql_params['user'], mysql_params['password'],
                                                            mysql_params['host'], mysql_params['port'],
                                                            mysql_params['database'])
engine = db.create_engine(connection_string, pool_pre_ping=True)

Session = sessionmaker(bind=engine)
session = Session()

Base = declarative_base()
