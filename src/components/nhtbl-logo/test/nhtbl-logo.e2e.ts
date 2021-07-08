import { newE2EPage } from '@stencil/core/testing';

describe('nhtbl-logo', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<nhtbl-logo></nhtbl-logo>');

    const element = await page.find('nhtbl-logo');
    expect(element).toHaveClass('hydrated');
  });
});
