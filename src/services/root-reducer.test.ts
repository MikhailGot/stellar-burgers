import { rootReducer } from './store';

describe('Тест rootReducer', () => {
  test('Tecт инициализация undefined', () => {
    const initialState = {
      user: {
        user: null,
        isAuthLoading: false,
        isAuthChecked: false,
        errorText: ''
      },
      ingredients: {
        ingredients: [],
        isLoading: false,
        isLoaded: false,
        errorMessage: ''
      },
      burgerConstructor: {
        bun: null,
        ingredients: [],
        orderRequest: false,
        orderModalData: null
      },
      feed: {
        orders: [],
        feed: { total: 0, totalToday: 0 },
        isLoading: false,
        isLoaded: false,
        errorMessage: ''
      },
      orders: {
        orders: [],
        orderByNumber: undefined,
        isLoading: false,
        isLoaded: false,
        errorMessage: ''
      }
    };
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });
});
