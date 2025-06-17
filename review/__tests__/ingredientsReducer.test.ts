import { fetchIngredients, ingredientsInitialState } from '../src/services/slices';
import reducer from '../src/services/slices/ingredients';

// Тестовые данные ингредиентов
const testIngredientsList = [
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
  }
];

describe('Тестирование редьюсера ингредиентов', () => {
  describe('Проверка работы экшена fetchIngredients', () => {
    it('Должен устанавливать статус загрузки при начале запроса', () => {
      const loadingState = reducer(
        ingredientsInitialState,
        fetchIngredients.pending('request123')
      );

      expect(loadingState.loading).toBe(true);
      expect(loadingState.error).toBeNull();
      expect(loadingState.data).toBeNull();
    });

    it('Должен корректно сохранять данные при успешном ответе', () => {
      const successState = reducer(
        ingredientsInitialState,
        fetchIngredients.fulfilled(testIngredientsList, 'request123')
      );

      expect(successState.loading).toBe(false);
      expect(successState.error).toBeNull();
      expect(successState.data).toHaveLength(1);
      expect(successState.data?.[0].name).toBe('Краторная булка N-200i');
    });

    it('Должен обрабатывать ошибку при неудачном запросе', () => {
      const errorText = 'Ошибка загрузки данных';
      const errorState = reducer(
        ingredientsInitialState,
        fetchIngredients.rejected(new Error(errorText), 'request123')
      );

      expect(errorState.loading).toBe(false);
      expect(errorState.data).toBeNull();
      expect(errorState.error?.message).toBe(errorText);
    });
  });
});