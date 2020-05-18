from .controller import Controller
from app.models import Port
from app.app import db, session


class ControllerPort(Controller):

    def check_exist(self, data):
        if not isinstance(data, dict):
            return None
        port = self._parse_port(data=data, port=None)
        if port is None:
            return None
        search = session.query(Port).filter(Port.name == port.name, Port.type == port.type).first()
        if search is None:
            return False, port
        else:
            return True, search

    def insert(self, data):
        # exist, port = self.check_exist(data=data)
        # if exist:
        #     return port #self.update(data=data, object_id=port.port_id)
        # else:
        try:
            port = self._parse_port(data=data, port=None)
            session.add(port)
            session.commit()
            return port
        except Exception as e:
            print(e.__str__())
            session.rollback()
            return None
        # finally:
        #     session.close()

    def update(self, data, object_id):
        port = session.query(Port).filter_by(port_id=object_id).first()
        port = self._parse_port(data=data, port=port)
        try:
            session.commit()
            return port
        except Exception as e:
            print(e.__str__())
            session.rollback()
            return None
        # finally:
        #     session.close()

    def select(self):
        ports = session.query(Port).all()
        return ports

    def get_by_id(self, port_id):
        port = session.query(Port).filter_by(port_id=port_id).first()
        return port

    def get_by_name_type(self, name, port_type):
        if name is None or str(name).__eq__('') or port_type is None or str(port_type).__eq__(''):
            return None
        data = {'name': name, 'type': port_type}
        res, port = self.check_exist(data=data)
        return res, port

    def _parse_port(self, data, port=None):
        name, type, description = None, None, None

        if 'name' in data:
            name = str(data['name']).strip()
        if 'port_type' in data:
            type = str(data['port_type']).strip()
        if 'description' in data:
            description = str(data['description']).strip()
        if port is None:
            port = Port(name=name, type=type, description=description)
        else:
            port.name = name
            port.type = type
            port.description = description
        return port
