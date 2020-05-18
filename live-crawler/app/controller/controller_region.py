from .controller import Controller
from app.models import Region
from app.app import db, session


class ControllerRegion(Controller):

    def check_exist(self, data):
        if not isinstance(data, dict):
            return None
        region = self._parse_region(data=data, region=None)
        if region is None:
            return None
        search = session.query(Region).filter(Region.name == region.name, Region.acronym == region.acronym).first()
        if search is None:
            return False, region
        else:
            return True, search

    def insert(self, data):
        # exist, region = self.check_exist(data=data)
        # if exist:
        #     return region #self.update(data=data, object_id=region.port_id)
        # else:
        try:
            region = self._parse_region(data=data, region=None)
            session.add(region)
            session.commit()
            return region
        except Exception as e:
            print(e.__str__())
            session.rollback()
            return None
        # finally:
        #     session.close()

    def update(self, data, object_id):
        region = session.query(Region).filter_by(region_id=object_id).first()
        region = self._parse_region(data=data, region=region)
        try:
            session.commit()
            return region
        except Exception as e:
            print(e.__str__())
            session.rollback()
            return None
        # finally:
        #     session.close()

    def select(self):
        regions = session.query(Region).all()
        return regions

    def get_by_id(self, region_id):
        region = session.query(Region).filter_by(region_id=region_id).first()
        return region

    def _parse_region(self, data, region=None):
        name, acronym, description = None, None, None
        if 'name' in data:
            name = str(data['name']).strip()
        if 'acronym' in data:
            acronym = str(data['acronym']).strip()
        if 'description' in data:
            description = str(data['description']).strip()

        if region is None:
            region = Region(name=name, acronym=acronym, description=description)
        else:
            region.name = name
            region.acronym = acronym
            region.description = description
        return region
