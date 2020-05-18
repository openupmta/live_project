from datetime import date
import datetime

from .controller import Controller
from ..app import session
from ..models import LoadPlanning


class ControllerLoadPlanning(Controller):
    def handle(self, data):
        """
        Nhiem vu cua ham handle:
        1. Kiem tra ton tai cua ban ghi
        2. Tra ve trang thai insert hay cap nhat ban ghi moi
         3. Tra ve trang thai co update vehicles hay khong.
        """
        vessel_name = data['vessel_name']
        if str(vessel_name).strip().upper().__eq__('VOLUMENPROGNOSE'):
            pass

    def check_exist(self, data, hash_check=False):
        """
        Check theo 2 thanh phan:
        1. Neu la VOLUMENPROGNOSE (chua co ten tau chinh thuc)
            1.1. port_load_id --> da duoc tinh trong hash_value
            1.2. port_discharge_id --> da duoc tinh trong hash_value
            1.3. hash_value
            1.4. vessel_name = VOLUMENPROGNOSE
            1.5. region_id
        2. Neu co ten tau chinh thuc
            2.1. port_load_id --> da duoc tinh trong hash_value
            2.2. port_discharge_id --> da duoc tinh trong hash_value
            2.3. hash_value
            2.4. vessel_id
            2.5. region_id
        """
        if not isinstance(data, dict):
            return None
        load_planning = self._parse_load_planning(data=data, load_planning=None)
        if load_planning is None:
            return None
        if hash_check:
            search = session.query(LoadPlanning).filter(LoadPlanning.hash_value == load_planning.hash_value,
                                                        LoadPlanning.vessel_name == 'VOLUMENPROGNOSE',
                                                        LoadPlanning.region_id == load_planning.region_id,
                                                        LoadPlanning.load_type == load_planning.load_type).order_by(
                LoadPlanning.load_planning_id.desc()).first()
        else:
            search = session.query(LoadPlanning).filter(LoadPlanning.hash_value == load_planning.hash_value,
                                                        LoadPlanning.vessel_id == load_planning.vessel_id,
                                                        LoadPlanning.region_id == load_planning.region_id,
                                                        LoadPlanning.load_type == load_planning.load_type).order_by(
                LoadPlanning.load_planning_id.desc()).first()  # filter de sau
        if search is None:
            return False, load_planning
        else:
            return True, search


    def insert(self, data):
        # exist, load_planning = self.check_exist(data=data)
        #         # if exist:
        #         #     return load_planning  # self.update(data=data, object_id=load_planning.load_planning_id)
        #         # else:
        try:
            load_planning = self._parse_load_planning(data=data, load_planning=None)
            session.add(load_planning)
            session.commit()
            return load_planning
        except Exception as e:
            print(e.__str__())
            session.rollback()
            return None
        # finally:
        #     session.close()

    def update(self, data, object_id):
        load_planning = session.query(LoadPlanning).filter_by(load_planning_id=object_id).first()
        load_planning = self._parse_load_planning(data=data, load_planning=load_planning)
        try:
            session.commit()
            return load_planning
        except Exception as e:
            print(e.__str__())
            session.rollback()
            return None
        # finally:
        #     session.close()

    def select(self):
        load_plannings = session.query(LoadPlanning).all()
        return load_plannings

    def _parse_load_planning(self, data, load_planning=None):
        port_load_id, port_load_name, port_discharge_id, port_discharge_name, vessel_id, vessel_name, region_id, region_name, ETS_text, ETS, date_planned_text, date_planned, date_transit_text, date_transit, voyage, load_type, ETA_text, ETA, volume, hash_value = None, None, None, None, None, None, None, None, None, None, None, None, None, None, None, None, None, None, None, None

        if 'port_load_id' in data:
            port_load_id = data['port_load_id']
        if 'port_load_name' in data:
            port_load_name = str(data['port_load_name']).strip()

        if 'port_discharge_id' in data:
            port_discharge_id = data['port_discharge_id']
        if 'port_discharge_name' in data:
            port_discharge_name = str(data['port_discharge_name']).strip()

        if 'vessel_id' in data:
            vessel_id = data['vessel_id']
        if 'vessel_name' in data:
            vessel_name = str(data['vessel_name']).strip()

        if 'region_id' in data:
            region_id = data['region_id']
        if 'region_name' in data:
            region_name = str(data['region_name']).strip()

        if 'ETS_text' in data:
            ETS_text = str(data['ETS_text']).strip()

        if 'ETS' in data:
            try:
                ETS = data['ETS']
            except Exception as e:
                print(e.__str__())

        if 'date_planned_text' in data:
            date_planned_text = str(data['date_planned_text']).strip()
        if 'date_planned' in data:
            try:
                date_planned = data['date_planned']
            except Exception as e:
                print(e.__str__())

        if 'date_transit_text' in data:
            date_transit_text = str(data['date_transit_text']).strip()
        if 'date_transit' in data:
            try:
                date_transit = data['date_transit']
            except Exception as e:
                print(e.__str__())

        if 'voyage' in data:
            voyage = str(data['voyage']).strip()

        if 'load_type' in data:
            load_type = str(data['load_type']).strip()

        if 'ETA_text' in data:
            ETA_text = str(data['ETA_text']).strip()
        if 'ETA' in data:
            try:
                ETA = data['ETA']
            except Exception as e:
                print(e.__str__())

        if 'volume' in data:
            volume = int(data['volume'])

        # if 'date_created' in data:
        #     try:
        #         date_created = data['date_created']  # date.fromisoformat(data['date_created'])
        #     except Exception as e:
        #         print(e.__str__())

        if 'hash_value' in data:
            hash_value = str(data['hash_value']).strip()

        if load_planning is None:
            load_planning = LoadPlanning(port_load_id=port_load_id, port_load_name=port_load_name,
                                         port_discharge_id=port_discharge_id, port_discharge_name=port_discharge_name,
                                         vessel_id=vessel_id, vessel_name=vessel_name, region_id=region_id,
                                         region_name=region_name, ETS_text=ETS_text, ETS=ETS,
                                         date_planned_text=date_planned_text, date_planned=date_planned,
                                         date_transit_text=date_transit_text,
                                         date_transit=date_transit, voyage=voyage, load_type=load_type,
                                         ETA_text=ETA_text, ETA=ETA,
                                         volume=volume, hash_value=hash_value)
        else:
            load_planning.port_load_id = port_load_id
            load_planning.port_load_name = port_load_name
            load_planning.port_discharge_id = port_discharge_id
            load_planning.port_discharge_name = port_discharge_name

            load_planning.vessel_id = vessel_id
            load_planning.vessel_name = vessel_name
            load_planning.region_id = region_id
            load_planning.region_name = region_name

            load_planning.ETS_text = ETS_text
            load_planning.ETS = ETS
            load_planning.date_planned_text = date_planned_text
            load_planning.date_planned = date_planned
            load_planning.date_transit_text = date_transit_text
            load_planning.date_transit = date_transit
            load_planning.voyage = voyage

            load_planning.load_type = load_type
            load_planning.ETA_text = ETA_text
            load_planning.ETA = ETA
            load_planning.volume = volume

            # load_planning.date_created = date_created
            load_planning.hash_value = hash_value
        return load_planning
