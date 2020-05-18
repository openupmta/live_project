import React, { Component } from 'react';
import RingLoader from 'react-spinners/RingLoader';
import moment, * as Moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  getFilter,
  getPort,
  searchLoadPlanning,
  searchVehicle,
  searchTimeline,
  downloadCsv
} from '../services/api/PortAPI';
import { isNumber, isNull } from 'util';
import TimelineComponent from '../components/TimelineComponent';
import { logoutUser } from '../services/AuthServices';
import download from './assets/download.png';
import exit from './assets/exit.png';

class VesselPage extends Component {
  state = {
    portLoading: [],
    region: [],
    portDischarge: [],
    status: [],
    vessel: [],
    voyage: [],
    selectedPortLoading: '',
    selectedPortDischarge: '',
    selectedRegion: '',
    selectedStatus: '',
    selectedVessel: '',
    selectedVoyage: '',
    currentLoadPlanningId: '',
    dataTable: [],
    dataVehicle: [],
    dataTimeline: [],
    sortDirection: '',
    sortColumn: '',
    currentPage: 'vessel',
    loading: false,
    tableHeight: 0,
    filterHeight: 0,
    timelineParams: null,
    startDate: new Date('01/01/2020'),
    endDate: new Date()
  };

  componentDidMount() {
    this._resize();
    this._loadPort();
    window.addEventListener('resize', this._resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _resize = () => {
    this.setState({ tableHeight: window.innerHeight - 110 });
    const el1 = document.getElementById('filter1');
    const el2 = document.getElementById('filter2');
    if (el1 && el2) {
      this.setState({ filterHeight: el1.clientHeight + el2.clientHeight });
    }
  };

  onClickRoute = (page, item) => {
    this.setState({ currentPage: page });
    if (page === 'vehicle') this._loadVehicle(item.load_planning_id);
    else {
      this.setState({
        timelineParams: {
          hash_value: item.hash_value,
          vessel_name: item.vessel_name
        }
      });
      this._loadTimeline({
        hash_value: item.hash_value,
        vessel_name: item.vessel_name
      });
    }
  };

  onChangePortLoading = e => {
    this.setState({ selectedPortLoading: e.target.value });
    this._loadFilter(e.target.value);
  };

  onChangePortDischarge = e => {
    this.setState({ selectedPortDischarge: e.target.value !== 'All' ? e.target.value : '' }, () =>
      this.onSearch()
    );
  };

  onChangeRegion = e => {
    this.setState({ selectedRegion: e.target.value !== 'All' ? e.target.value : '' }, () =>
      this.onSearch()
    );
  };

  onChangeStatus = e => {
    this.setState({ selectedStatus: e.target.value !== 'All' ? e.target.value : '' }, () =>
      this.onSearch()
    );
  };

  onChangeVessel = e => {
    this.setState({ selectedVessel: e.target.value !== 'All' ? e.target.value : '' }, () =>
      this.onSearch()
    );
  };

  onChangeVoyage = e => {
    this.setState({ selectedVoyage: e.target.value !== 'All' ? e.target.value : '' }, () =>
      this.onSearch()
    );
  };

  onClickDownload = async () => {
    try {
      const {
        selectedPortLoading,
        selectedPortDischarge,
        selectedRegion,
        selectedStatus,
        selectedVessel,
        selectedVoyage,
        currentLoadPlanningId,
        currentPage,
        timelineParams,
        startDate,
        endDate
      } = this.state;

      let params, data;
      if (currentLoadPlanningId === '') {
        if (currentPage === 'vessel') {
          params = {
            port_load_name: selectedPortLoading,
            region_name: selectedRegion,
            port_discharge_name: selectedPortDischarge,
            status: selectedStatus,
            vessel_name: selectedVessel,
            voyage: selectedVoyage,
            from_date: moment(startDate).format('YYYY-MM-DD'),
            to_date: moment(endDate).format('YYYY-MM-DD')
          };
          data = await downloadCsv(params, 'load_planning');
        } else {
          params = timelineParams;
          data = await downloadCsv(params, 'load_planning');
        }
      } else {
        params = {
          load_planning_id: currentLoadPlanningId
        };
        data = await downloadCsv(params, 'vehicle');
      }

      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'download.xls');
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      console.log(e);
    }
  };

  onClickLogout = () => {
    logoutUser();
  };

  onSearch = async () => {
    const {
      selectedPortLoading,
      selectedPortDischarge,
      selectedRegion,
      selectedStatus,
      selectedVessel,
      selectedVoyage,
      startDate,
      endDate
    } = this.state;
    const params = {
      port_load_name: selectedPortLoading,
      region_name: selectedRegion,
      port_discharge_name: selectedPortDischarge,
      status: selectedStatus,
      vessel_name: selectedVessel,
      voyage: selectedVoyage,
      from_date: moment(startDate).format('YYYY-MM-DD'),
      to_date: moment(endDate).format('YYYY-MM-DD')
    };
    try {
      this.setState({ loading: true, dataTable: [] });
      const { data } = await searchLoadPlanning(params);
      this.setState({ dataTable: data, loading: false, sortDirection: 'asc' }, () => {
        this.onSort('date_created');
      });
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  };

  onClickLogo = () => {
    const { currentPage } = this.state;
    if (currentPage === 'vessel') {
      this.setState(
        ({ portLoading }) => ({
          selectedPortLoading: portLoading[0].name,
          selectedPortDischarge: '',
          selectedRegion: '',
          selectedStatus: '',
          selectedVessel: '',
          selectedVoyage: '',
          startDate: new Date('01/01/2020'),
          endDate: new Date()
        }),
        () => this.onSearch()
      );
    } else {
      this.setState({
        currentPage: 'vessel',
        dataVehicle: [],
        dataTimeline: [],
        currentLoadPlanningId: ''
      });
    }
  };

  onSort = column => {
    const { dataTable, sortDirection } = this.state;

    if (sortDirection === 'asc') {
      dataTable.sort((a, b) => {
        if (isNumber(a[column])) return b[column] - a[column];
        return this._normalizeString(b[column]).localeCompare(this._normalizeString(a[column]));
      });
    } else {
      dataTable.sort((a, b) => {
        if (isNumber(a[column])) return a[column] - b[column];
        return this._normalizeString(a[column]).localeCompare(this._normalizeString(b[column]));
      });
    }

    this.setState(({ sortDirection }) => ({
      dataTable,
      sortDirection: sortDirection === 'asc' ? 'des' : 'asc',
      sortColumn: column
    }));
  };

  _normalizeString = text => {
    if (isNull(text)) return '';
    return text;
  };

  _loadPort = async () => {
    try {
      this.setState({ loading: true });
      const { data } = await getPort(null, 'load');
      this.setState({ portLoading: data });
      if (data.length > 0) {
        this.setState({ selectedPortLoading: data[0].name });
        this._loadFilter(data[0].name);
      }
    } catch (e) {
      console.log(e);
    }
  };

  _loadFilter = async portName => {
    try {
      const { data } = await getFilter(portName);
      this.setState(
        {
          portDischarge: ['', ...data.port_discharge],
          region: ['', ...data.region],
          status: ['', ...data.status],
          vessel: ['', ...data.vessel],
          voyage: ['', ...data.voyage],
          selectedPortDischarge: '',
          selectedRegion: '',
          selectedStatus: '',
          selectedVessel: '',
          selectedVoyage: ''
        },
        () => this.onSearch()
      );
    } catch (e) {
      console.log(e);
    }
  };

  _loadVehicle = async loadPlanningId => {
    const params = {
      load_planning_id: loadPlanningId
    };
    try {
      this.setState({ loading: true, currentLoadPlanningId: loadPlanningId });
      const { data } = await searchVehicle(params);
      this.setState({ dataVehicle: data, loading: false });
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  };

  _loadTimeline = async params => {
    try {
      const { data } = await searchTimeline(params);
      this.setState({ dataTimeline: data, loading: false });
    } catch (e) {
      console.log(e);
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      portLoading,
      portDischarge,
      status,
      region,
      vessel,
      voyage,
      dataTable,
      dataVehicle,
      dataTimeline,
      selectedVessel,
      selectedVoyage,
      selectedPortDischarge,
      selectedRegion,
      selectedStatus,
      selectedPortLoading,
      sortDirection,
      sortColumn,
      currentPage,
      loading,
      tableHeight,
      filterHeight,
      startDate,
      endDate
    } = this.state;

    return (
      <div className='VesselPage'>
        <div className='VesselPageHeader'>
          <div className='Logo' onClick={this.onClickLogo} title='Home'>
            BMW Export
          </div>
          <div className='d-flex'>
            <div className='ButtonContainer'>
              <img
                src={download}
                onClick={this.onClickDownload}
                alt='download icon'
                title='Download'
              />
            </div>
            <div className='ButtonContainer'>
              <img src={exit} onClick={this.onClickLogout} alt='exit icon' title='Logout' />
            </div>
          </div>
        </div>
        {currentPage === 'vessel' && (
          <div className='VesselFilter' id='filter1'>
            <div className='FilterContainer' style={{ width: '260px' }}>
              <div className='FilterLabel'>Port of Loading</div>
              <select
                className='form-control'
                value={selectedPortLoading}
                onChange={this.onChangePortLoading}
              >
                {portLoading &&
                  portLoading.map(port => {
                    return <option key={port.port_id}>{port.name}</option>;
                  })}
              </select>
            </div>
            <div className='FilterContainer' style={{ width: '145px' }}>
              <div className='FilterLabel'>Region</div>
              <select
                className='form-control'
                value={selectedRegion}
                onChange={this.onChangeRegion}
              >
                {region.map(item => {
                  return <option key={item}>{item ? item : 'All'}</option>;
                })}
              </select>
            </div>
            <div className='FilterContainer' style={{ width: '390px' }}>
              <div className='FilterLabel'>Port of Discharge</div>
              <select
                className='form-control'
                value={selectedPortDischarge}
                onChange={this.onChangePortDischarge}
              >
                {portDischarge.map(port => {
                  return <option key={port}>{port ? port : 'All'}</option>;
                })}
              </select>
            </div>
            <div className='FilterContainer' style={{ width: '263px' }}>
              <div className='FilterLabel'>Vessel</div>
              <select
                className='form-control'
                value={selectedVessel}
                onChange={this.onChangeVessel}
              >
                {vessel.map(item => {
                  return <option key={item}>{item ? item : 'All'}</option>;
                })}
              </select>
            </div>
          </div>
        )}
        {currentPage === 'vessel' && (
          <div className='VesselFilter' id='filter2'>
            <div className='FilterContainer' style={{ width: '162px' }}>
              <div className='FilterLabel'>Status</div>
              <select
                className='form-control'
                value={selectedStatus}
                onChange={this.onChangeStatus}
              >
                {status.map(item => {
                  return <option key={item}>{item ? item : 'All'}</option>;
                })}
              </select>
            </div>
            <div className='FilterContainer' style={{ width: '197px' }}>
              <div className='FilterLabel'>Voyage</div>
              <select
                className='form-control'
                value={selectedVoyage}
                onChange={this.onChangeVoyage}
              >
                {voyage.map(item => {
                  return <option key={item}>{item ? item : 'All'}</option>;
                })}
              </select>
            </div>
            <div className='FilterContainer'>
              <div className='FilterLabel'>From Date</div>
              <DatePicker
                dateFormat='dd/MM/yyyy'
                selected={startDate}
                maxDate={endDate}
                className='form-control'
                popperPlacement='top-end'
                onChange={date => this.setState({ startDate: date }, () => this.onSearch())}
              />
            </div>
            <div className='FilterContainer'>
              <div className='FilterLabel'>To Date</div>
              <DatePicker
                dateFormat='dd/MM/yyyy'
                selected={endDate}
                minDate={startDate}
                className='form-control'
                popperPlacement='top-end'
                onChange={date => this.setState({ endDate: date }, () => this.onSearch())}
              />
            </div>
          </div>
        )}
        {currentPage === 'vessel' && !loading && (
          <div className='TableContainer' style={{ height: `${tableHeight - filterHeight}px` }}>
            <table className='table table-striped fixed-table'>
              <thead>
                <tr>
                  <th
                    className={sortColumn === 'port_load_name' ? sortDirection : ''}
                    onClick={() => this.onSort('port_load_name')}
                  >
                    Port of loading
                  </th>
                  <th
                    className={sortColumn === 'port_discharge_name' ? sortDirection : ''}
                    onClick={() => this.onSort('port_discharge_name')}
                  >
                    Port of discharge
                  </th>
                  <th
                    className={sortColumn === 'vessel_name' ? sortDirection : ''}
                    onClick={() => this.onSort('vessel_name')}
                  >
                    Vessel name
                  </th>
                  <th
                    className={sortColumn === 'region_name' ? sortDirection : ''}
                    onClick={() => this.onSort('region_name')}
                  >
                    Region name
                  </th>
                  <th
                    className={sortColumn === 'ETS' ? sortDirection : ''}
                    onClick={() => this.onSort('ETS')}
                  >
                    ETS
                  </th>
                  <th
                    className={sortColumn === 'date_planned' ? sortDirection : ''}
                    onClick={() => this.onSort('date_planned')}
                  >
                    Date Planned
                  </th>
                  <th
                    className={sortColumn === 'date_transit' ? sortDirection : ''}
                    onClick={() => this.onSort('date_transit')}
                  >
                    Date Transit
                  </th>
                  <th
                    className={sortColumn === 'voyage' ? sortDirection : ''}
                    onClick={() => this.onSort('voyage')}
                  >
                    Voyage
                  </th>
                  <th
                    className={sortColumn === 'load_type' ? sortDirection : ''}
                    onClick={() => this.onSort('load_type')}
                  >
                    Load Type
                  </th>
                  <th
                    className={sortColumn === 'ETA' ? sortDirection : ''}
                    onClick={() => this.onSort('ETA')}
                  >
                    ETA
                  </th>
                  <th
                    className={sortColumn === 'volume' ? sortDirection : ''}
                    onClick={() => this.onSort('volume')}
                  >
                    Volume
                  </th>
                  <th
                    className={sortColumn === 'date_created' ? sortDirection : ''}
                    onClick={() => this.onSort('date_created')}
                  >
                    Date Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataTable.map(item => {
                  return (
                    <tr key={`lp_${item.load_planning_id}`}>
                      <td>{item.port_load_name}</td>
                      <td>{item.port_discharge_name}</td>
                      <td
                        style={{
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                        onClick={() => this.onClickRoute('timeline', item)}
                      >
                        {item.vessel_name}
                      </td>
                      <td>{item.region_name}</td>
                      <td>{item.ETS}</td>
                      <td>{item.date_planned}</td>
                      <td>{item.date_transit}</td>
                      <td
                        style={{
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                        onClick={() => this.onClickRoute('timeline', item)}
                      >
                        {item.voyage}
                      </td>
                      <td>{item.load_type}</td>
                      <td>{item.ETA}</td>
                      <td
                        style={{
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                        onClick={() => this.onClickRoute('vehicle', item)}
                      >
                        {item.volume}
                      </td>
                      <td>{Moment(item.date_created).format('YYYY-MM-DD')}</td>
                    </tr>
                  );
                })}
                {dataTable.length === 0 && !loading && (
                  <tr style={{ backgroundColor: 'inherit' }}>
                    <td colSpan='12'>No load planning</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {currentPage === 'vehicle' && !loading && (
          <div className='TableVehicleContainer' style={{ height: `${tableHeight}px` }}>
            <table className='table table-striped fixed-table'>
              <thead>
                <tr>
                  <th>VIN</th>
                  <th>Model</th>
                  <th>Status</th>
                  <th>Port Load</th>
                  <th>Port Discharge</th>
                  <th>Vessel Name</th>
                  <th>Vessel Voyage</th>
                </tr>
              </thead>
              <tbody>
                {dataVehicle.map(item => {
                  return (
                    <tr key={item.VIN}>
                      <td>{item.VIN}</td>
                      <td>{item.model}</td>
                      <td>{item.status}</td>
                      <td>{item.port_load_name}</td>
                      <td>{item.port_discharge_name}</td>
                      <td>{item.vessel_name}</td>
                      <td>{item.vessel_voyage}</td>
                    </tr>
                  );
                })}
                {dataVehicle.length === 0 && !loading && (
                  <tr style={{ backgroundColor: 'inherit' }}>
                    <td colSpan='7'>No vehicle</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {currentPage === 'timeline' && <TimelineComponent dataTimeline={dataTimeline} />}
        {loading && (
          <div className='Loading'>
            <RingLoader color={'#77bfc0'} />
          </div>
        )}
      </div>
    );
  }
}

export default VesselPage;
