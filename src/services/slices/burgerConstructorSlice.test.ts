import { TIngredient } from '@utils-types';
import {
  addIngredient,
  burgerConstructorSlice,
  BurgerConstructorState,
  deleteIngredient,
  moveIngredient
} from './burgerConstructorSlice';

describe('Тест редьюсера burgerConstructor', () => {
  const testIngredient1: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  };

  const testIngredient2: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
  };
  const initialState: BurgerConstructorState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null
  };

  test('Тест добавления и удаления ингредиентов', () => {
    const afterAddState = burgerConstructorSlice.reducer(
      initialState,
      addIngredient(testIngredient1)
    );
    expect(afterAddState.ingredients.length).toBe(1);
    const { ingredients } = burgerConstructorSlice.reducer(
      afterAddState,
      deleteIngredient(0)
    );
    expect(ingredients.length).toBe(0);
  });
  test('Тест перемещения ингредиентов', () => {
    let state = burgerConstructorSlice.reducer(
      initialState,
      addIngredient(testIngredient1)
    );
    state = burgerConstructorSlice.reducer(
      state,
      addIngredient(testIngredient2)
    );
    const { ingredients } = burgerConstructorSlice.reducer(
      state,
      moveIngredient({ index: 0, direction: 'down' })
    );
    expect(ingredients.length).toBe(2);
    expect(ingredients[0]._id).toEqual(testIngredient2._id);
    expect(ingredients[1]._id).toEqual(testIngredient1._id);
  });
});
