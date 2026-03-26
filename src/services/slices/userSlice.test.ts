import { configureStore } from '@reduxjs/toolkit';
import { getUser, userSlice } from './userSlice';

describe('Тест userSlice', () => {
  const testRejectData = {
    success: false,
    message: 'Test error message'
  };
  const testResolveData = {
    success: true,
    user: {
      name: 'TestUser',
      email: 'testemail@test.com'
    }
  };

  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
    global.fetch = originalFetch;
  });

  test('Тест fetch', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(testRejectData);
    const store = configureStore({
      reducer: userSlice.reducer
    });
    const dispatch = store.dispatch;
    const dispatchPromise = dispatch(getUser());
    let state = store.getState();
    expect(state.isAuthLoading).toBe(true);
    await dispatchPromise;
    state = store.getState();
    expect(state.user).toBe(null);
    expect(state.isAuthLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.errorText).toBe(testRejectData.message);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => testResolveData
    } as Response);
    await store.dispatch(getUser());
    state = store.getState();
    expect(state.user).toEqual(testResolveData.user);
  });
});
