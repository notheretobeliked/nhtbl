import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'nhtbl-logo',
  styleUrl: 'nhtbl-logo.css',
  shadow: true,
})
export class NhtblLogo {

  render() {
    return (
      <Host>
        <svg id="logo" width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="54" cy="54" r="54" fill="#DCFF06"/>
        <path d="M22 63C33 79.1667 61.8 101.8 89 63" stroke="black" stroke-width="3"/>
        <ellipse cx="42.5" cy="39" rx="4.5" ry="13" fill="black"/>
        <ellipse cx="64.5" cy="39" rx="4.5" ry="13" fill="black"/>
        </svg>
      </Host>
    );
  }

}
