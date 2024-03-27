import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import DataCard from './'; 


describe('<DataCard />', () => {

  it('renders without crash', () => {
    const mockData = { id: 1 };
    render(<DataCard data={mockData} />);
  });

  it('displays the correct data id', () => {
    const mockData = { id: 123 };
    const { getByText } = render(<DataCard data={mockData} />);
    expect(getByText(mockData.id)).toBeDefined();
  });  

  it('matches snapshot', () => {
    const mockData = { id: 1 };
    const { container } = render(<DataCard data={mockData} />);
    expect(container).toMatchSnapshot();
  });

});
