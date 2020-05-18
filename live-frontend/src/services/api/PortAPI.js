import createAPIServices from '../createAPIServices';

const api = createAPIServices();

export const getPort = (name, type) => {
  return api.makeAuthRequest({
    url: '/api/v1/port/search',
    method: 'GET',
    params: {
      name,
      type
    }
  });
};

export const getFilter = port_load_name => {
  return api.makeAuthRequest({
    url: '/api/v1/load_planning/port_load',
    method: 'GET',
    params: {
      port_load_name
    }
  });
};

export const searchLoadPlanning = params => {
  return api.makeAuthRequest({
    url: '/api/v1/load_planning/search',
    method: 'GET',
    params
  });
};

export const searchVehicle = params => {
  return api.makeAuthRequest({
    url: '/api/v1/vehicle/search',
    method: 'GET',
    params
  });
};

export const searchTimeline = params => {
  return api.makeAuthRequest({
    url: '/api/v1/load_planning/timeline',
    method: 'GET',
    params
  });
};

export const downloadCsv = (params, type) => {
  return api.makeAuthRequest({
    url: `/api/v1/${type}/download`,
    method: 'GET',
    responseType: 'blob',
    params
  });
};
