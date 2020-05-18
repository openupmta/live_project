from datetime import date

from .controller import Controller
from app.models import Vehicle
from app.app import db, session


class ControllerVehicle(Controller):

    def check_exist(self, data):
        """
        Vehicle check exist theo cac fields sau:
        1. port_load_id
        2. port_discharge_id
        3. vin
        4. voyage
        """
        if not isinstance(data, dict):
            return None
        vehicle = self._parse_vehicle(data=data, vehicle=None)
        if vehicle is None:
            return None
        search = session.query(Vehicle).filter(Vehicle.port_load_id == vehicle.port_load_id,
                                               Vehicle.port_discharge_id == vehicle.port_discharge_id,
                                               Vehicle.VIN == vehicle.VIN,
                                               Vehicle.vessel_voyage == vehicle.vessel_voyage).order_by(
            Vehicle.vehicle_id.desc()).first()  # chua co dieu kien
        if search is None:
            return False, vehicle
        else:
            return True, search

    def insert(self, data):
        # exist, vehicle = self.check_exist(data=data)
        # if exist:
        #     return self.update(data=data, object_id=vehicle.port_id)
        # else:
        try:
            vehicle = self._parse_vehicle(data=data, vehicle=None)
            session.add(vehicle)
            session.commit()
            return vehicle
        except Exception as e:
            print(e.__str__())
            session.rollback()
            return None
        # finally:
        #     session.close()

    def update(self, data, object_id):
        vehicle = session.query(Vehicle).filter_by(vehicle_id=object_id).first()
        vehicle = self._parse_vehicle(data=data, vehicle=vehicle)
        try:
            session.commit()
            return vehicle
        except Exception as e:
            print(e.__str__())
            session.rollback()
            return None
        # finally:
        #     session.close()

    def select(self):
        vehicles = session.query(Vehicle).all()
        return vehicles

    def get_amount_vehicles_by_load_planning_id(self, load_planning_id):
        amount = session.query(Vehicle).filter_by(load_planning_id=load_planning_id).count()
        return amount

    def _parse_vehicle(self, data, vehicle=None):
        load_planning_id, VIN, model, status, port_load_id, port_load_original_name, port_load_name, port_load_in, port_load_out_ETS, port_load_out_ATS, port_discharge_id, port_discharge_original_name, port_discharge_name, port_discharge_in_ETA, port_discharge_in_ATA, vessel_id, vessel_name, vessel_voyage, hash_value, port_load_in_text, port_load_out_ETS_text, port_load_out_ATS_text, port_discharge_in_ETA_text, port_discharge_in_ATA_text = None, None, None, None, None, None, None, None, None, None, None, None, None, None, None, None, None, None, None, None, None, None, None, None

        if 'load_planning_id' in data:
            load_planning_id = data['load_planning_id']

        if 'VIN' in data:
            VIN = str(data['VIN']).strip()
        if 'model' in data:
            model = str(data['model']).strip()
        if 'status' in data:
            status = str(data['status']).strip()

        if 'port_load_id' in data:
            port_load_id = data['port_load_id']
        if 'port_load_original_name' in data:
            port_load_original_name = str(data['port_load_original_name']).strip()
        if 'port_load_name' in data:
            port_load_name = str(data['port_load_name']).strip()
        if 'port_load_in' in data:
            try:
                port_load_in = data['port_load_in']
            except Exception as e:
                print(e.__str__())
                pass
        if 'port_load_out_ETS' in data:
            try:
                port_load_out_ETS = data['port_load_out_ETS']
            except Exception as e:
                print(e.__str__())
                pass
        if 'port_load_out_ATS' in data:
            try:
                port_load_out_ATS = data['port_load_out_ATS']
            except Exception as e:
                print(e.__str__())
                pass

        if 'port_discharge_id' in data:
            port_discharge_id = data['port_discharge_id']
        if 'port_discharge_original_name' in data:
            port_discharge_original_name = str(data['port_discharge_original_name']).strip()
        if 'port_discharge_name' in data:
            port_discharge_name = str(data['port_discharge_name']).strip()
        if 'port_discharge_in_ETA' in data:
            try:
                port_discharge_in_ETA = data['port_discharge_in_ETA']
            except Exception as e:
                print(e.__str__())
                pass
        if 'port_discharge_in_ATA' in data:
            try:
                port_discharge_in_ATA = data['port_discharge_in_ATA']
            except Exception as e:
                print(e.__str__())
                pass

        if 'vessel_id' in data:
            vessel_id = data['vessel_id']
        if 'vessel_name' in data:
            vessel_name = str(data['vessel_name']).strip()
        if 'vessel_voyage' in data:
            vessel_voyage = str(data['vessel_voyage']).strip()

        # if 'date_created' in data:
        #     try:
        #         date_created = data['date_created']  # date.fromisoformat(data['date_created'])
        #     except Exception as e:
        #         print(e.__str__())
        if 'hash_value' in data:
            hash_value = str(data['hash_value']).strip()

        if 'port_load_in_text' in data:
            port_load_in_text = str(data['port_load_in_text']).strip()
        if 'port_load_out_ETS_text' in data:
            port_load_out_ETS_text = str(data['port_load_out_ETS_text']).strip()
        if 'port_load_out_ATS_text' in data:
            port_load_out_ATS_text = str(data['port_load_out_ATS_text']).strip()
        if 'port_discharge_in_ETA_text' in data:
            port_discharge_in_ETA_text = str(data['port_discharge_in_ETA_text']).strip()
        if 'port_discharge_in_ATA_text' in data:
            port_discharge_in_ATA_text = str(data['port_discharge_in_ATA_text']).strip()

        if vehicle is None:
            vehicle = Vehicle(load_planning_id=load_planning_id, VIN=VIN, model=model, status=status,
                              port_load_id=port_load_id, port_load_original_name=port_load_original_name,
                              port_load_name=port_load_name, port_load_in=port_load_in,
                              port_load_out_ETS=port_load_out_ETS,
                              port_load_out_ATS=port_load_out_ATS, port_discharge_id=port_discharge_id,
                              port_discharge_original_name=port_discharge_original_name,
                              port_discharge_name=port_discharge_name, port_discharge_in_ETA=port_discharge_in_ETA,
                              port_discharge_in_ATA=port_discharge_in_ATA, vessel_id=vessel_id, vessel_name=vessel_name,
                              vessel_voyage=vessel_voyage, hash_value=hash_value,
                              port_load_in_text=port_load_in_text, port_load_out_ETS_text=port_load_out_ETS_text,
                              port_load_out_ATS_text=port_load_out_ATS_text,
                              port_discharge_in_ETA_text=port_discharge_in_ETA_text,
                              port_discharge_in_ATA_text=port_discharge_in_ATA_text)
        else:
            vehicle.load_planning_id = load_planning_id
            vehicle.VIN = VIN
            vehicle.model = model
            vehicle.status = status

            vehicle.port_load_id = port_load_id
            vehicle.port_load_original_name = port_load_original_name
            vehicle.port_load_name = port_load_name
            vehicle.port_load_in = port_load_in
            vehicle.port_load_out_ETS = port_load_out_ETS
            vehicle.port_load_out_ATS = port_load_out_ATS

            vehicle.port_discharge_id = port_discharge_id
            vehicle.port_discharge_original_name = port_discharge_original_name
            vehicle.port_discharge_name = port_discharge_name
            vehicle.port_dischare_in_ETA = port_discharge_in_ETA
            vehicle.port_discharge_in_ATA = port_discharge_in_ATA

            vehicle.vessel_id = vessel_id
            vehicle.vessel_name = vessel_name
            vehicle.vessel_voyage = vessel_voyage

            # vehicle.date_created = date_created
            vehicle.hash_value = hash_value

            vehicle.port_load_in_text = port_load_in_text
            vehicle.port_load_out_ETS_text = port_load_out_ETS_text
            vehicle.port_load_out_ATS_text = port_load_out_ATS_text
            vehicle.port_discharge_in_ETA_text = port_discharge_in_ETA_text
            vehicle.port_discharge_in_ATA_text = port_discharge_in_ATA_text

        return vehicle
