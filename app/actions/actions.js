import constants from '../constants/constants';

checkForAPIError = response => {
  if (response.status >= 400) {
    throw response;
  } else {
    return response;
  }
};

getFormattedError = async error => {
  let formattedError = '';
  if ('status' in error) {
    formattedError = error.status + '\n\n';
    formattedError += await error.text();
  } else {
    formattedError = JSON.stringify(error);
  }
  return formattedError;
};

export const loadConfiguration = () => {
  return async (dispatch, getState) => {
    try {
      let response = checkForAPIError(
        await fetch(constants.API + '/configuration'),
      );
      response = await response.json();
      dispatch({
        type: 'SET',
        data: {
          motors: response.motors,
          ingredients: response.ingredients,
          tubes: response.tubes,
        },
      });
      return response;
    } catch (error) {
      dispatch({type: 'SET', data: {error: await getFormattedError(error)}});
    }
  };
};

export const saveRecipe = recipe => {
  return async (dispatch, getState) => {
    try {
      checkForAPIError(
        await fetch(
          constants.API + '/recipes?user_name=' + constants.USERNAME,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipe),
          },
        ),
      );
      let response = checkForAPIError(
        await fetch(constants.API + '/recipes?user_name=' + constants.USERNAME),
      );
      response = await response.json();
      dispatch({type: 'SET', data: {recipes: response}});
    } catch (error) {
      dispatch({type: 'SET', data: {error: await getFormattedError(error)}});
    }
  };
};

export const sendRecipe = (tag, recipe, priming) => {
  return async (dispatch, getState) => {
    try {
      tagString = '';
      for (var i = 3; i < tag.length; i++) {
        tagString += String.fromCharCode(tag[i]);
      }
      if (tagString == 'drink_mixr') {
        let body = {
          user_name: constants.USERNAME,
          priming,
          order: recipe,
        };
        checkForAPIError(
          await fetch(constants.API + '/order', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }),
        );
        let response = checkForAPIError(
          await fetch(constants.API + '/configuration'),
        );
        response = await response.json();
        dispatch({
          type: 'SET',
          data: {
            motors: response.motors,
            ingredients: response.ingredients,
            tubes: response.tubes,
          },
        });
      }
    } catch (error) {
      dispatch({type: 'SET', data: {error: await getFormattedError(error)}});
    }
  };
};

export const deleteRecipe = recipeName => {
  return async (dispatch, getState) => {
    try {
      let response = checkForAPIError(
        await fetch(
          constants.API +
            `/recipes?user_name=${
              constants.USERNAME
            }&recipe_name=${recipeName}`,
          {
            method: 'DELETE',
          },
        ),
      );
      response = checkForAPIError(
        await fetch(constants.API + '/recipes?user_name=' + constants.USERNAME),
      );
      response = await response.json();
      dispatch({type: 'SET', data: {recipes: response}});
    } catch (error) {
      dispatch({type: 'SET', data: {error: await getFormattedError(error)}});
    }
  };
};

export const getRecipes = () => {
  return async (dispatch, getState) => {
    try {
      var response = checkForAPIError(
        await fetch(constants.API + '/recipes?user_name=' + constants.USERNAME),
      );
      response = await response.json();
      dispatch({type: 'SET', data: {recipes: response}});
      return response;
    } catch (error) {
      dispatch({type: 'SET', data: {error: await getFormattedError(error)}});
    }
  };
};

export const saveSettings = (ingredients, motors, tubes) => {
  return async (dispatch, getState) => {
    try {
      checkForAPIError(
        await fetch(constants.API + '/ingredients', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ingredients),
        }),
      );
      checkForAPIError(
        await fetch(constants.API + '/motors', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(motors),
        }),
      );
      checkForAPIError(
        await fetch(constants.API + '/tubes', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tubes),
        }),
      );
    } catch (error) {
      dispatch({type: 'SET', data: {error: await getFormattedError(error)}});
    }
  };
};
