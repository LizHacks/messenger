export const LOAD_FROM_LOCALSTORAGE = 'LOAD_FROM_LOCALSTORAGE';

const get_token = () => {
  return (JSON.parse(window
          .localStorage
          .getItem('ember_simple_auth-session')
    || '') as any).authenticated.profile.user_id;
};

export function load_from_localstorage() {
  return {
    type: LOAD_FROM_LOCALSTORAGE,
    user_id: get_token(),
  };
}
