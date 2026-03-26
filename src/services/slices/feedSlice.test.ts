import { configureStore } from '@reduxjs/toolkit';
import { feedSlice, fetchFeeds } from './feedsSlice';

describe('Тест feedSlice', () => {
  const testRejectData = {
    success: false,
    message: 'Test error message'
  };
  const testResolveData = {
    success: true,
    orders: [
      {
        _id: '69c4dc50a64177001b330a98',
        ingredients: [
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa093e',
          '643d69a5c3f7b9001cfa0940',
          '643d69a5c3f7b9001cfa093e',
          '643d69a5c3f7b9001cfa0940',
          '643d69a5c3f7b9001cfa0940',
          '643d69a5c3f7b9001cfa093d'
        ],
        status: 'done',
        name: 'Метеоритный флюоресцентный люминесцентный бургер',
        createdAt: '2026-03-26T07:12:16.812Z',
        updatedAt: '2026-03-26T07:12:17.123Z',
        number: 103318
      },
      {
        _id: '69c4dc4fa64177001b330a97',
        ingredients: [
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa093e',
          '643d69a5c3f7b9001cfa0940',
          '643d69a5c3f7b9001cfa093e',
          '643d69a5c3f7b9001cfa0940',
          '643d69a5c3f7b9001cfa0940',
          '643d69a5c3f7b9001cfa093d'
        ],
        status: 'done',
        name: 'Метеоритный флюоресцентный люминесцентный бургер',
        createdAt: '2026-03-26T07:12:15.703Z',
        updatedAt: '2026-03-26T07:12:15.953Z',
        number: 103317
      }
    ],
    total: 27312,
    totalToday: 35
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
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => testRejectData
    } as Response);
    const store = configureStore({
      reducer: feedSlice.reducer
    });
    const dispatch = store.dispatch;
    const dispatchPromise = dispatch(fetchFeeds());
    let state = store.getState();
    expect(state.isLoading).toBe(true);
    await dispatchPromise;
    state = store.getState();
    expect(state.isLoading).toBe(false);
    expect(state.isLoaded).toBe(true);
    expect(state.errorMessage).toBe(testRejectData.message);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => testResolveData
    } as Response);
    await store.dispatch(fetchFeeds());
    state = store.getState();
    expect(state.isLoading).toBe(false);
    expect(state.isLoaded).toBe(true);
    expect(state.orders.length).toBe(testResolveData.orders.length);
    expect(state.feed.total).toBe(testResolveData.total);
    expect(state.feed.totalToday).toBe(testResolveData.totalToday);
  });
});
