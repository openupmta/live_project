from app.app import Base, db
import datetime


class Port(Base):
    __tablename__ = "port"
    port_id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    name = db.Column(db.String, unique=True)
    type = db.Column(db.String)
    description = db.Column(db.String)
    date_created = db.Column(db.DateTime, default=datetime.datetime.now())

    # __table_args__ = (
    #     db.UniqueConstraint(port_id, name, type),
    # )


class Region(Base):
    __tablename__ = 'region'
    region_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String)
    acronym = db.Column(db.String)
    description = db.Column(db.String)
    date_created = db.Column(db.DateTime, default=datetime.datetime.now())


class Vessel(Base):
    __tablename__ = 'vessel'

    vessel_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String)
    acronym = db.Column(db.String)
    description = db.Column(db.String)
    date_created = db.Column(db.DateTime, default=datetime.datetime.now())


class LoadPlanning(Base):
    __tablename__ = "load_planning"

    load_planning_id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    port_load_id = db.Column(db.Integer)  # co dinh
    port_load_name = db.Column(db.String)

    port_discharge_id = db.Column(db.Integer)  # co dinh
    port_discharge_name = db.Column(db.String)

    vessel_id = db.Column(db.Integer)  # co the thay doi
    vessel_name = db.Column(db.String)  # co the thay doi

    region_id = db.Column(db.Integer)  # co dinh
    region_name = db.Column(db.String)

    ETS_text = db.Column(db.String)
    ETS = db.Column(db.Date)  # co the thay doi

    date_planned_text = db.Column(db.String)
    date_planned = db.Column(db.Date)  # co dinh?
    date_transit_text = db.Column(db.String)
    date_transit = db.Column(db.Date)  # co dinh?

    voyage = db.Column(db.String)  # thay doi
    load_type = db.Column(db.String)  # co dinh

    ETA_text = db.Column(db.String)
    ETA = db.Column(db.Date)  # co the thay doi (ETA-ETS) cố định
    volume = db.Column(db.Integer)  # co the thay doi

    date_created = db.Column(db.DateTime, default=datetime.datetime.now())
    hash_value = db.Column(db.String)

    # predecessor_id = db.Column(db.Integer) # ID của bản ghi tại lần thay đổi trước gần nhất
    # date_created = db.Column(db.DateTime) # tạo cái mới khi thay đổi


class LoadPlanningDischarge(Base):
    __tablename__ = 'load_planning_discharge'

    load_planning_discharge_id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    load_planning_id = db.Column(db.Integer, nullable=False)

    region_id = db.Column(db.Integer, nullable=False)
    region_name = db.Column(db.String)

    port_discharge_id = db.Column(db.Integer, nullable=False)

    ETA = db.Column(db.Date)
    volume = db.Column(db.Float)


class Vehicle(Base):
    """
    This class describes all information about vehicle.
    """
    __tablename__ = 'vehicle'
    vehicle_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    load_planning_id = db.Column(db.Integer)  # the load planning id

    VIN = db.Column(db.String)
    model = db.Column(db.String)
    status = db.Column(db.String)

    port_load_id = db.Column(db.Integer)
    port_load_original_name = db.Column(db.String)
    port_load_name = db.Column(db.String)
    port_load_in = db.Column(db.Date)
    port_load_out_ETS = db.Column(db.Date)
    port_load_out_ATS = db.Column(db.Date)

    port_discharge_id = db.Column(db.Integer)
    port_discharge_original_name = db.Column(db.String)
    port_discharge_name = db.Column(db.String)
    port_discharge_in_ETA = db.Column(db.Date)
    port_discharge_in_ATA = db.Column(db.Date)

    vessel_id = db.Column(db.Integer)
    vessel_name = db.Column(db.String)
    vessel_voyage = db.Column(db.String)

    date_created = db.Column(db.DateTime, default=datetime.datetime.now())
    hash_value = db.Column(db.String)

    port_load_in_text = db.Column(db.String)
    port_load_out_ETS_text = db.Column(db.String)
    port_load_out_ATS_text = db.Column(db.String)
    port_discharge_in_ETA_text = db.Column(db.String)
    port_discharge_in_ATA_text = db.Column(db.String)

# def testing():
#     port = Port(name="Bremerhaven", description="Port loading", port_type='loading')
#     session = Session()
#     session.add(port)
#     session.commit()
#     session.close()
