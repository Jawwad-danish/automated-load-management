import US_STATES from './us-states.json';
import CA_STATES from './ca-states.json';
export class StateUtils {
  static getShortName(state?: string): string {
    if (!state) {
      return '';
    }
    if (state.length === 2) {
      return state;
    }

    const combinedStates = { ...US_STATES, ...CA_STATES };

    return (
      Object.entries(combinedStates).find(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_key, value]) =>
          value.toLocaleLowerCase() === state.toLocaleLowerCase(),
      )?.[0] || state
    );
  }
}
