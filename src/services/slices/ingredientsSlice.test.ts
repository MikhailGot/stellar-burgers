import { configureStore } from '@reduxjs/toolkit';
import { fetchIngredients, ingredientsSlice } from './ingredientsSlice';

describe('Тест ingredientsSlice', () => {
  const testRejectData = {
    success: false,
    message: 'Test error message'
  };
  const testResolveData = {
    success: true,
    data: [
      {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        __v: 0
      },
      {
        _id: '643d69a5c3f7b9001cfa0941',
        name: 'Биокотлета из марсианской Магнолии',
        type: 'main',
        proteins: 420,
        fat: 142,
        carbohydrates: 242,
        calories: 4242,
        price: 424,
        image: 'https://code.s3.yandex.net/react/code/meat-01.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        __v: 0
      }
    ]
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
      reducer: ingredientsSlice.reducer
    });
    const dispatch = store.dispatch;
    const dispatchPromise = dispatch(fetchIngredients());
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
    await store.dispatch(fetchIngredients());
    state = store.getState();
    expect(state.isLoading).toBe(false);
    expect(state.isLoaded).toBe(true);
    expect(state.ingredients.length).toBe(testResolveData.data.length);
  });
});
