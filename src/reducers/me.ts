import { LOAD_FROM_LOCALSTORAGE } from '../actions/me';

export const defaultState = {
  user_id: '',
};

export default function me(state = defaultState, action = {} as any) {
  switch (action.type) {
    case LOAD_FROM_LOCALSTORAGE:
      return {
        user_id: action.user_id,
      };
    default:
      return state;
  }
}
