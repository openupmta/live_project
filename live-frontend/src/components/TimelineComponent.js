import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Moment from 'moment';

class TimelineComponent extends Component {
  state = {
    dataTimeline: [],
    className: ''
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const vh = window.innerHeight - 180;
    const clientHeight = nextProps.dataTimeline.length * 365;
    this.setState({
      dataTimeline: nextProps.dataTimeline,
      className: vh < clientHeight ? 'TimelineItem Overflow' : 'TimelineItem'
    });
  }

  checkUpdate = (field, index) => {
    const { dataTimeline } = this.props;
    if (index === 0) return 'initial';
    if (field === 'date_planned') {
      const status1 = dataTimeline[index][field] ? 'planned' : 'in transit';
      const status0 = dataTimeline[index - 1][field] ? 'planned' : 'in transit';
      if (status1 === status0) return 'initial';
      return '#77BFC0';
    }
    if (dataTimeline[index][field] === dataTimeline[index - 1][field])
      return 'initial';
    return '#77BFC0';
  };

  render() {
    const { dataTimeline, className } = this.state;
    return (
      <div className="Timeline">
        <div className="TimelineTitle">Timeline</div>
        <div className="TimelineTitle VesselName">
          {dataTimeline && dataTimeline[0]?.vessel_name}
        </div>
        <div className="TimelineContainer" id="timeline">
          {dataTimeline.map((item, index) => {
            return (
              <div key={index} className={className}>
                <div className="TimelineItemContent">
                  <p style={{ color: this.checkUpdate('vessel_name', index) }}>
                    <b>Vessel Name:</b> {item.vessel_name}
                  </p>
                  <p style={{ color: this.checkUpdate('voyage', index) }}>
                    <b>Voyage:</b> {item.voyage}
                  </p>
                  <p
                    style={{ color: this.checkUpdate('port_load_name', index) }}
                  >
                    <b>Port Loading:</b> {item.port_load_name}
                  </p>
                  <p
                    style={{
                      color: this.checkUpdate('port_discharge_name', index)
                    }}
                  >
                    <b>Port Discharge:</b> {item.port_discharge_name}
                  </p>
                  <p
                    style={{
                      color: this.checkUpdate('region_name', index)
                    }}
                  >
                    <b>Region:</b> {item.region_name}
                  </p>
                  <p
                    style={{
                      color: this.checkUpdate('ETA', index)
                    }}
                  >
                    <b>ETA:</b> {item.ETA}
                  </p>
                  <p
                    style={{
                      color: this.checkUpdate('ETS', index)
                    }}
                  >
                    <b>ETS:</b> {item.ETS}
                  </p>
                  <p
                    style={{
                      color: this.checkUpdate('date_planned', index)
                    }}
                  >
                    <b>Status:</b>{' '}
                    {item.date_planned ? 'planned' : 'in transit'}
                  </p>
                  <p
                    style={{
                      color: this.checkUpdate('volume', index)
                    }}
                  >
                    <b>Volume:</b> {item.volume}
                  </p>
                  <span className="Circle" />
                  <time>{Moment(item.date_created).format('DD MMM YYYY')}</time>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

TimelineComponent.propTypes = {
  dataTimeline: PropTypes.array.isRequired
};

export default TimelineComponent;
