from .controller import Controller
from app.app import db, session
from app.models import Vessel


class ControllerVessel(Controller):

    def check_exist(self, data):
        if not isinstance(data, dict):
            return None
        vessel = self._parse_vessel(data=data, vessel=None)
        if vessel is None:
            return None
        search = session.query(Vessel).filter(Vessel.name == vessel.name).first()
        if search is None:
            return False, vessel
        else:
            return True, search

    def insert(self, data):
        # exist, vessel = self.check_exist(data=data)
        # if exist:
        #     return vessel # self.update(data=data, object_id=vessel.port_id)
        # else:
        try:
            vessel = self._parse_vessel(data=data, vessel=None)
            session.add(vessel)
            session.commit()
            return vessel
        except Exception as e:
            print(e.__str__())
            session.rollback()
            return None
        # finally:
        #     session.close()

    def update(self, data, object_id):
        vessel = session.query(Vessel).filter_by(vessel_id=object_id).first()
        vessel = self._parse_vessel(data=data, vessel=vessel)
        try:
            session.commit()
            return vessel
        except Exception as e:
            print(e.__str__())
            session.rollback()
            return None
        # finally:
        #     session.close()

    def select(self):
        vessels = session.query(Vessel).all()
        return vessels

    def _parse_vessel(self, data, vessel=None):
        name, acronym, description = None, None, None
        if 'name' in data:
            name = str(data['name']).strip()
        if 'acronym' in data:
            acronym = str(data['acronym']).strip()
        if 'description' in data:
            description = str(data['description']).strip()
        if vessel is None:
            vessel = Vessel(name=name, acronym=acronym, description=description)
        else:
            vessel.name = name
            vessel.acronym = acronym
            vessel.description = description
        return vessel
