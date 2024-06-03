import { httpGet } from '../api/apiHandler';

export const handleSearch = async (value: string, setCoins: Function, setLoading: Function) => {
  setLoading(true);
  try {
    const response = await httpGet(`/assets?search=${value}`);
    setCoins(response.data);
    setLoading(false);
  } catch (error) {
    console.error('Error searching coins:', error);
    setLoading(false);
  }
};