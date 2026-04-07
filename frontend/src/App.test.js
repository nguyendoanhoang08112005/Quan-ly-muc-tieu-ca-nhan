import { render, screen } from '@testing-library/react';
import App from './App';

test('renders personal goals landing page', () => {
  render(<App />);
  const linkElement = screen.getByText(/Quan ly muc tieu ca nhan/i);
  expect(linkElement).toBeInTheDocument();
});
