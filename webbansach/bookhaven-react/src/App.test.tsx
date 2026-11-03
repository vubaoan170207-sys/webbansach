import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from './App';

describe('App', () => {
  it('renders the BookHaven storefront shell', () => {
    render(<App />);

    expect(screen.getByRole('link', { name: /BookHaven/i })).toBeInTheDocument();
  });
});
