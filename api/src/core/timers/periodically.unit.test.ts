import { runPeriodically } from './periodically';

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  jest.spyOn(global, 'setInterval');
});

describe('timers ', () => {
  test('setInterval is called', () => {
    const toExecute = jest.fn();
    runPeriodically(async () => {
      return toExecute;
    }, 1);

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
  });
});
