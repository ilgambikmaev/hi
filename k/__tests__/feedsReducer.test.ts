import { fetchFeeds, feedsInitialState } from '../src/services/slices';
import reducer from '../src/services/slices/feeds';

// Моковые данные для тестирования
const mockFeedsResponse = {
  orders: [],
  total: 1,
  totalToday: 1
};

describe('Тесты для редьюсера feedsReducer', () => {
  describe('Тестирование асинхронного экшена fetchFeeds', () => {
    it('Должен корректно обрабатывать состояние начала загрузки', () => {
      const newState = reducer(
        feedsInitialState, 
        fetchFeeds.pending('requestId')
      );

      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('Должен правильно обрабатывать успешный ответ сервера', () => {
      const resultState = reducer(
        feedsInitialState,
        fetchFeeds.fulfilled(mockFeedsResponse, 'requestId')
      );

      expect(resultState.isLoading).toBe(false);
      expect(resultState.error).toBeNull();
      expect(resultState.data).toStrictEqual(mockFeedsResponse);
    });

    it('Должен корректно обрабатывать ошибку запроса', () => {
      const errorMessage = 'Network error occurred';
      const errorState = reducer(
        feedsInitialState,
        fetchFeeds.rejected(new Error(errorMessage), 'requestId')
      );

      expect(errorState.isLoading).toBe(false);
      expect(errorState.error?.message).toBe(errorMessage);
      expect(errorState.data).toBeNull();
    });
  });
});