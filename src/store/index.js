import { createStore } from 'redux';

// Initial state for the character sheet
const initialState = {
  character: {
    name: '',
    race: '',
    class: '',
    level: 1,
    abilities: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    // Add more character properties as needed
  }
};

// Simple reducer for character sheet actions
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_CHARACTER':
      return {
        ...state,
        character: {
          ...state.character,
          ...action.payload
        }
      };
    case 'UPDATE_ABILITY':
      return {
        ...state,
        character: {
          ...state.character,
          abilities: {
            ...state.character.abilities,
            [action.payload.ability]: action.payload.value
          }
        }
      };
    default:
      return state;
  }
};

// Create the Redux store
export const store = createStore(reducer);

export default store; 