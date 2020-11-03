export default function reducer(
  state = {
    ingredients: {},
    motors: {},
    tubes: {},
    recipes: [],
    error: null,
  },
  action,
) {
  switch (action.type) {
    case 'SET':
      return {...state, ...action.data};
  }
  return state;
}
