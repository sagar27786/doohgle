import * as screensApi from '../api/screens';

export const screensService = {
  async createScreen(payload: screensApi.ScreenPayload) {
    const { ok, data } = await screensApi.createScreen(payload);
    if (!ok) {
      throw new Error(data.message || 'Failed to create screen.');
    }
    return data;
  },

  async getMyScreens() {
    const { ok, data } = await screensApi.getMyScreens();
    if (!ok) {
      throw new Error(data.message || 'Failed to fetch screens.');
    }
    return data;
  },
};
