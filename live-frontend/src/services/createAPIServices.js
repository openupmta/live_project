import Axios from 'axios';
import { getAccessToken, logoutUser } from './AuthServices';

const _makeRequest = createRequest => async args => {
  const _headers = args.headers ? args.headers : {};

  const defaultHeaders = {
    'X-App-Version': '1.1.0',
    'cache-control': 'no-cache',
    pragma: 'no-cache',
    'X-Language': 'en'
  };

  args = {
    ...args,
    headers: {
      ...defaultHeaders,
      ..._headers
    }
  };

  try {
    const { data } = await createRequest(args);

    return data;
  } catch (e) {
    throw e;
  }
};

const _makeAuthRequest = createRequest => async args => {
  const requestHeaders = args.headers ? args.headers : {};
  //const accessToken = await getAccessToken();

  let headers = {
    Authorization: `0e885a3c4c520f8a9159e1dbad7de745`
  };

  args = {
    ...args,
    headers: {
      ...headers,
      ...requestHeaders
    }
  };
  try {
    return await _makeRequest(createRequest)(args);
  } catch (e) {
    const { response } = e;

    if (!response || !response.data) {
      throw e;
    }

    if (response.status >= 400 && response.status <= 403) {
      logoutUser();
    }
  }
};

export default (options = {}) => {
  const baseUrlValidated = options.baseUrl || '';
  const instance = Axios.create({
    baseURL: baseUrlValidated
    //timeout: 30000,
  });

  return {
    makeRequest: _makeRequest(instance),
    makeAuthRequest: _makeAuthRequest(instance)
  };
};
