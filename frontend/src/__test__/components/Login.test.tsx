import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoginComponent from '../../components/auth/LoginComponent';
import '@testing-library/jest-dom/vitest';

describe('Login', () => {
  it('Should render login', () => {
    const page = render(<LoginComponent />);
    const head = screen.findByText(/login/i);
    expect(head).toBeInTheDocument();
  });
});
