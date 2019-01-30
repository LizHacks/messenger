import { TEST_AUTH_ACTION } from '../actions/auth';

export const defaultState = { something: 0 };

export default function auth(state = defaultState, action = {} as any) {
  switch (action.type) {
    case TEST_AUTH_ACTION:
      return {
        ...state,
        loading: false,
        something: state.something + action.something,
      };

    default:
      return state;
  }
}
