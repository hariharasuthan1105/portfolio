// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Vault from './Vault';
afterEach(cleanup);
describe('Intelligence Vault',()=>{
 it('unlocks all three keys and restarts cleanly',async()=>{
  const user=userEvent.setup();render(<Vault/>);
  expect(screen.getByText('0 / 3 KEYS COLLECTED')).toBeTruthy();
  for(let i=1;i<=3;i++)await user.click(screen.getByRole('button',{name:`Scan field 0${i}`}));
  expect(screen.getByText('1 / 3 KEYS COLLECTED')).toBeTruthy();
  await user.click(screen.getByRole('button',{name:'Run sample query'}));
  await waitFor(()=>expect(screen.getByText('Reroute through North Avenue.')).toBeTruthy(),{timeout:3000});
  for(const name of ['1 Question','2 Storage','3 Context','4 Response'])await user.click(screen.getByRole('button',{name}));
  expect(screen.getByText('VAULT UNLOCKED')).toBeTruthy();
  expect(screen.getByText('3 / 3 KEYS COLLECTED')).toBeTruthy();
  await user.click(screen.getByRole('button',{name:'Restart quest'}));
  expect(screen.getByText('0 / 3 KEYS COLLECTED')).toBeTruthy();
  expect(screen.queryByText('VAULT UNLOCKED')).toBeNull();
 });
 it('enforces node order and supports the alternate question',async()=>{
  const user=userEvent.setup();render(<Vault/>);
  expect((screen.getByRole('button',{name:'4 Response'}) as HTMLButtonElement).disabled).toBe(true);
  await user.selectOptions(screen.getByLabelText('Sample question'),'water');
  await user.click(screen.getByRole('button',{name:'Run sample query'}));
  await waitFor(()=>expect(screen.getByText('Inspect District C.')).toBeTruthy(),{timeout:3000});
 });
 it('allows keyboard scanning and cancels in-flight work on restart',async()=>{
  const user=userEvent.setup();render(<Vault/>);
  screen.getByRole('button',{name:'Scan field 01'}).focus();await user.keyboard('{Enter}');
  expect(screen.getByText('Invoice ID: KOC-042')).toBeTruthy();
  await user.click(screen.getByRole('button',{name:'Run sample query'}));
  await user.click(screen.getByRole('button',{name:'Restart quest'}));
  await new Promise(r=>setTimeout(r,1450));
  expect(screen.queryByText('Reroute through North Avenue.')).toBeNull();
  expect(screen.getByRole('button',{name:'Run sample query'})).toBeTruthy();
 });
});
