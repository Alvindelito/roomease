// DEV NOTE: Don't need this yet, but if i need to
// persist state then use this.

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    console.log('loadState', serializedState);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state: object) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    return 'something went wrong saving state to local storage';
  }
};
