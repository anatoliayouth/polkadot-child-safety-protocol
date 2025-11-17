import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChildIdentityOverview } from '../ChildIdentityOverview';
import { Child } from '@types/index';

describe('ChildIdentityOverview', () => {
  const mockChild: Child = {
    id: 'child-1',
    name: 'Alice Smith',
    did: 'did:kilt:4r1WkS3t8rbCb11n6SsS7JBs84nqxF84K1cLvPWPF6Jf',
    credentialStatus: 'active',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-12-01'),
  };

  it('renders child name as heading', () => {
    render(<ChildIdentityOverview child={mockChild} />);
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
  });

  it('displays DID correctly', () => {
    render(<ChildIdentityOverview child={mockChild} />);
    expect(screen.getByText(mockChild.did)).toBeInTheDocument();
  });

  it('displays credential status as active', () => {
    render(<ChildIdentityOverview child={mockChild} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('displays credential status as pending', () => {
    const pendingChild: Child = { ...mockChild, credentialStatus: 'pending' };
    render(<ChildIdentityOverview child={pendingChild} />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('displays credential status as revoked', () => {
    const revokedChild: Child = { ...mockChild, credentialStatus: 'revoked' };
    render(<ChildIdentityOverview child={revokedChild} />);
    expect(screen.getByText('Revoked')).toBeInTheDocument();
  });

  it('displays creation and update dates', () => {
    render(<ChildIdentityOverview child={mockChild} />);
    const dates = screen.getAllByRole('time');
    expect(dates).toHaveLength(2);
  });

  it('applies correct CSS class for active status', () => {
    const { container } = render(<ChildIdentityOverview child={mockChild} />);
    const statusElement = container.querySelector('.status--active');
    expect(statusElement).toBeInTheDocument();
  });

  it('displays "Not set" when DID is missing', () => {
    const childWithoutDid: Child = { ...mockChild, did: '' };
    render(<ChildIdentityOverview child={childWithoutDid} />);
    expect(screen.getByText('Not set')).toBeInTheDocument();
  });

  it('renders overview items in correct order', () => {
    const { container } = render(<ChildIdentityOverview child={mockChild} />);
    const items = container.querySelectorAll('.overview-item');
    expect(items).toHaveLength(4);
  });
});
