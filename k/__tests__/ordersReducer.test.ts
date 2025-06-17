import {
  fetchOrder,
  fetchOrders,
  createOrder,
  resetOrderModalData,
  ordersInitialState
} from '../src/services/slices';

import reducer from '../src/services/slices/orders';

// Тестовые данные заказов
const mockOrderData = {
  ingredients: [
    '643d69a5c3f7b9001cfa093d',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa093d'
  ],
  _id: '6622337897ede0001d0666b5',
  status: 'done',
  name: 'EXAMPLE_NAME',
  createdAt: '2024-04-19T09:03:52.748Z',
  updatedAt: '2024-04-19T09:03:58.057Z',
  number: 38321
};

const mockOrdersList = [mockOrderData];

describe('Тестирование редьюсера заказов', () => {
  it('Должен очищать данные модального окна без изменения других состояний', () => {
    const initialStateWithData = {
      ...ordersInitialState,
      isOrderLoading: true,
      isOrdersLoading: true,
      orderModalData: mockOrderData
    };

    const stateAfterReset = reducer(initialStateWithData, resetOrderModalData());

    expect(stateAfterReset.orderModalData).toBeNull();
    expect(stateAfterReset.data).toHaveLength(0);
    expect(stateAfterReset.error).toBeNull();
    expect(stateAfterReset.orderRequest).toBe(false);
    expect(stateAfterReset.isOrdersLoading).toBe(true);
    expect(stateAfterReset.isOrderLoading).toBe(true);
  });

  describe('Тестирование экшена fetchOrders', () => {
    it('Должен устанавливать флаг загрузки при начале запроса', () => {
      const loadingState = reducer(
        ordersInitialState,
        fetchOrders.pending('requestId')
      );

      expect(loadingState.isOrdersLoading).toBe(true);
      expect(loadingState.error).toBeNull();
    });

    it('Должен сохранять список заказов при успешном ответе', () => {
      const successState = reducer(
        ordersInitialState,
        fetchOrders.fulfilled(mockOrdersList, 'requestId')
      );

      expect(successState.isOrdersLoading).toBe(false);
      expect(successState.error).toBeNull();
      expect(successState.data).toStrictEqual(mockOrdersList);
    });

    it('Должен обрабатывать ошибку при неудачном запросе', () => {
      const errorMessage = 'Ошибка получения заказов';
      const errorState = reducer(
        ordersInitialState,
        fetchOrders.rejected(new Error(errorMessage), 'requestId')
      );

      expect(errorState.isOrdersLoading).toBe(false);
      expect(errorState.error?.message).toBe(errorMessage);
    });
  });

  describe('Тестирование экшена fetchOrder', () => {
    it('Должен устанавливать флаг загрузки при запросе заказа', () => {
      const loadingState = reducer(
        ordersInitialState,
        fetchOrder.pending('requestId', mockOrderData.number)
      );

      expect(loadingState.isOrderLoading).toBe(true);
    });

    it('Должен сохранять данные заказа для модального окна', () => {
      const successState = reducer(
        ordersInitialState,
        fetchOrder.fulfilled(mockOrderData, 'requestId', mockOrderData.number)
      );

      expect(successState.isOrderLoading).toBe(false);
      expect(successState.orderModalData).toMatchObject(mockOrderData);
    });

    it('Должен сбрасывать флаг загрузки при ошибке', () => {
      const errorState = reducer(
        ordersInitialState,
        fetchOrder.rejected(new Error('Not found'), 'requestId', 999)
      );

      expect(errorState.isOrderLoading).toBe(false);
    });
  });

  describe('Тестирование экшена createOrder', () => {
    it('Должен устанавливать флаг запроса при создании заказа', () => {
      const pendingState = reducer(
        ordersInitialState,
        createOrder.pending('requestId', mockOrderData.ingredients)
      );

      expect(pendingState.orderRequest).toBe(true);
    });

    it('Должен сохранять созданный заказ в модальное окно', () => {
      const successResponse = { 
        order: mockOrderData, 
        name: 'EXAMPLE' 
      };
      
      const successState = reducer(
        ordersInitialState,
        createOrder.fulfilled(successResponse, 'requestId', mockOrderData.ingredients)
      );

      expect(successState.orderRequest).toBe(false);
      expect(successState.orderModalData).toEqual(mockOrderData);
    });

    it('Должен сбрасывать флаг запроса при ошибке создания', () => {
      const errorState = reducer(
        ordersInitialState,
        createOrder.rejected(new Error('Creation failed'), 'requestId', [])
      );

      expect(errorState.orderRequest).toBe(false);
    });
  });
});