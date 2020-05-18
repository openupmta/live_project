import abc
from abc import ABC


class Controller(ABC):
    @abc.abstractmethod
    def check_exist(self, data):
        pass

    @abc.abstractmethod
    def insert(self, data):
        pass

    @abc.abstractmethod
    def update(self, data, object_id):
        pass

    @abc.abstractmethod
    def select(self):
        pass
