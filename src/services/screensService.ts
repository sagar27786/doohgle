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
    const data = await screensApi.getMyScreens();
    return data;
  },

  async getScreenById(id: string) {
    const data = await screensApi.getScreenById(id);
    return data;
  },
};
