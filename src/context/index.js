import {createContext} from 'react';

export const AppContext = createContext({
  componentState: 0,
  setComponentState: () => {},
  response: '',
  setResponse: () => {},
});
