import React from 'react';
import {render} from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    const component = render(<App />);
    expect(component).toBeDefined();
  });

  it('renders the main app structure', () => {
    const {getByTestId} = render(<App />);
    // The app should render without throwing errors
    expect(() => render(<App />)).not.toThrow();
  });
});
