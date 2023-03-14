import axios from 'axios';

export const fetchLocationDetails = (query: string) => {
  return axios.get('http://api.positionstack.com/v1/forward', {
    params: {
      access_key: process.env.POSITION_STACK_API_KEY,
      query: query,
    },
  });
};
