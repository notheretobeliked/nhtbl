import { newSpecPage } from '@stencil/core/testing';
import { NhtblLogo } from '../nhtbl-logo';

describe('nhtbl-logo', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [NhtblLogo],
      html: `<nhtbl-logo></nhtbl-logo>`,
    });
    expect(page.root).toEqualHtml(`
      <nhtbl-logo>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </nhtbl-logo>
    `);
  });
});
