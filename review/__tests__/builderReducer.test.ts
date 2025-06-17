import {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
  constructorInitialState
} from '../src/services/slices';

import reducer from '../src/services/slices/builder';

// Тестовые данные для булки
const mockBun = {
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
};

// Тестовые данные для ингредиентов
const mockIngredientA = {
  _id: '643d69a5c3f7b9001cfa093e',
  id: '1234567890',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  __v: 0
};

const mockIngredientB = {
  _id: '643d69a5c3f7b9001cfa093e',
  id: '0987654321',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  __v: 0
};

describe('Проверка работы редьюсера конструктора бургеров', () => {
  describe('Тестирование функционала булок', () => {
    it('Должен корректно добавлять булку через setBun', () => {
      const newState = reducer(constructorInitialState, setBun(mockBun));

      expect(newState.bun).toMatchObject(mockBun);
      expect(newState.ingredients.length).toBe(0);
    });

    it('Должен добавлять булку через addIngredient', () => {
      const resultState = reducer(
        constructorInitialState,
        addIngredient(mockBun)
      );

      const bunWithoutId = { ...resultState.bun };
      delete bunWithoutId['id'];

      expect(bunWithoutId).toStrictEqual(mockBun);
      expect(resultState.ingredients.length).toBe(0);
    });
  });

  describe('Тестирование работы с начинкой', () => {
    it('Должен добавлять новый ингредиент в конструктор', () => {
      const updatedState = reducer(
        constructorInitialState,
        addIngredient(mockIngredientA)
      );

      expect(updatedState.ingredients.length).toBe(1);

      const ingredientCopy = { ...updatedState.ingredients[0] };
      delete ingredientCopy['id'];

      const expectedIngredient = { ...mockIngredientA };
      delete expectedIngredient['id'];

      expect(ingredientCopy).toEqual(expectedIngredient);
      expect(updatedState.bun).toBeNull();
    });

    it('Должен удалять существующий ингредиент', () => {
      const initialStateWithIngredients = {
        bun: null,
        ingredients: [mockIngredientA, mockIngredientB]
      };

      const stateAfterRemoval = reducer(
        initialStateWithIngredients,
        removeIngredient(mockIngredientA.id)
      );

      expect(stateAfterRemoval.ingredients.length).toBe(1);
      expect(stateAfterRemoval.ingredients[0]).toStrictEqual(mockIngredientB);
      expect(stateAfterRemoval.bun).toBeNull();
    });

    describe('Тестирование изменения порядка ингредиентов', () => {
      it('Должен перемещать ингредиент вниз по списку', () => {
        const stateWithTwoIngredients = {
          bun: null,
          ingredients: [mockIngredientA, mockIngredientB]
        };

        const stateAfterMovingDown = reducer(
          stateWithTwoIngredients,
          moveIngredient({ index: 0, upwards: false })
        );

        expect(stateAfterMovingDown.ingredients[0]).toEqual(mockIngredientB);
        expect(stateAfterMovingDown.ingredients[1]).toEqual(mockIngredientA);
        expect(stateAfterMovingDown.bun).toBeNull();
      });

      it('Должен перемещать ингредиент вверх по списку', () => {
        const initialState = {
          bun: null,
          ingredients: [mockIngredientA, mockIngredientB]
        };

        const finalState = reducer(
          initialState,
          moveIngredient({ index: 1, upwards: true })
        );

        expect(finalState.ingredients[0]).toStrictEqual(mockIngredientB);
        expect(finalState.ingredients[1]).toStrictEqual(mockIngredientA);
        expect(finalState.bun).toBeNull();
      });
    });
  });

  it('Должен полностью очищать конструктор', () => {
    const initialState = {
      bun: mockBun,
      ingredients: [mockIngredientA, mockIngredientB]
    };

    const clearedState = reducer(initialState, resetConstructor());

    expect(clearedState.ingredients.length).toBe(0);
    expect(clearedState.bun).toBeNull();
  });
});