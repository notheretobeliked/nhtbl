<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Header from '../../components/Header.svelte';

  // Mock menu items
  const mockMenuItems = [
    {
      id: 1,
      title: 'Home',
      uri: '/',
      url: 'http://localhost:5173/',
      target: null,
      cssClasses: []
    },
    {
      id: 2,
      title: 'Portfolio',
      uri: '/portfolio',
      url: 'http://localhost:5173/portfolio',
      target: null,
      cssClasses: []
    },
    {
      id: 3,
      title: 'Services',
      uri: '/services',
      url: 'http://localhost:5173/services',
      target: null,
      cssClasses: []
    },
    {
      id: 4,
      title: 'About',
      uri: '/about',
      url: 'http://localhost:5173/about',
      target: null,
      cssClasses: []
    },
    {
      id: 5,
      title: 'Connect',
      uri: '/connect',
      url: 'http://localhost:5173/connect',
      target: null,
      cssClasses: []
    }
  ];

  const { Story } = defineMeta({
    title: 'Components/Header',
    component: Header,
    tags: ['autodocs'],
    parameters: {
      layout: 'fullscreen'
    },
    argTypes: {
      menuItems: {
        control: 'object'
      }
    },
    args: {
      menuItems: mockMenuItems
    }
  });
</script>

<Story name="Default" args={{}} let:args>
  <div class="min-h-screen">
    <Header {...args} />
    <div class="pt-24 px-8">
      <h1 class="text-4xl font-bold mb-8">Page Content</h1>
      <p class="mb-4">
        This demonstrates the header in its default state. The header is fixed at the top of the page.
      </p>
      <p class="mb-4">
        Try scrolling down to see how the header changes when scrolled (though this may not work fully in Storybook).
      </p>
      {#each Array(20) as _, i}
        <p class="mb-4">
          Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
      {/each}
    </div>
  </div>
</Story>

<Story name="Simple Navigation" args={{
  menuItems: [
    {
      id: 1,
      title: 'Home',
      uri: '/',
      url: 'http://localhost:5173/',
      target: null,
      cssClasses: []
    },
    {
      id: 2,
      title: 'About',
      uri: '/about',
      url: 'http://localhost:5173/about',
      target: null,
      cssClasses: []
    },
    {
      id: 3,
      title: 'Contact',
      uri: '/contact',
      url: 'http://localhost:5173/contact',
      target: null,
      cssClasses: []
    }
  ]
}} let:args>
  <div class="min-h-screen">
    <Header {...args} />
    <div class="pt-24 px-8">
      <h1 class="text-4xl font-bold mb-8">Simple Navigation</h1>
      <p>This shows the header with fewer navigation items.</p>
    </div>
  </div>
</Story>

<Story name="Many Navigation Items" args={{
  menuItems: [
    ...mockMenuItems,
    {
      id: 6,
      title: 'Blog',
      uri: '/blog',
      url: 'http://localhost:5173/blog',
      target: null,
      cssClasses: []
    },
    {
      id: 7,
      title: 'Resources',
      uri: '/resources',
      url: 'http://localhost:5173/resources',
      target: null,
      cssClasses: []
    },
    {
      id: 8,
      title: 'FAQ',
      uri: '/faq',
      url: 'http://localhost:5173/faq',
      target: null,
      cssClasses: []
    },
    {
      id: 9,
      title: 'Support',
      uri: '/support',
      url: 'http://localhost:5173/support',
      target: null,
      cssClasses: []
    }
  ]
}} let:args>
  <div class="min-h-screen">
    <Header {...args} />
    <div class="pt-24 px-8">
      <h1 class="text-4xl font-bold mb-8">Extended Navigation</h1>
      <p>This shows the header with many navigation items to test responsive behavior.</p>
    </div>
  </div>
</Story>

<Story name="External Links" args={{
  menuItems: [
    {
      id: 1,
      title: 'Home',
      uri: '/',
      url: 'http://localhost:5173/',
      target: null,
      cssClasses: []
    },
    {
      id: 2,
      title: 'Portfolio',
      uri: '/portfolio',
      url: 'http://localhost:5173/portfolio',
      target: null,
      cssClasses: []
    },
    {
      id: 3,
      title: 'Twitter',
      uri: 'https://twitter.com',
      url: 'https://twitter.com',
      target: '_blank',
      cssClasses: []
    },
    {
      id: 4,
      title: 'GitHub',
      uri: 'https://github.com',
      url: 'https://github.com',
      target: '_blank',
      cssClasses: []
    }
  ]
}} let:args>
  <div class="min-h-screen">
    <Header {...args} />
    <div class="pt-24 px-8">
      <h1 class="text-4xl font-bold mb-8">Mixed Internal & External Links</h1>
      <p>This demonstrates the header with both internal navigation and external links.</p>
    </div>
  </div>
</Story>

<Story name="No Menu Items" args={{
  menuItems: []
}} let:args>
  <div class="min-h-screen">
    <Header {...args} />
    <div class="pt-24 px-8">
      <h1 class="text-4xl font-bold mb-8">No Navigation</h1>
      <p>This shows the header with no menu items (logo only).</p>
    </div>
  </div>
</Story>

<Story name="Long Menu Item Names" args={{
  menuItems: [
    {
      id: 1,
      title: 'Home',
      uri: '/',
      url: 'http://localhost:5173/',
      target: null,
      cssClasses: []
    },
    {
      id: 2,
      title: 'Very Long Portfolio Section Name',
      uri: '/portfolio',
      url: 'http://localhost:5173/portfolio',
      target: null,
      cssClasses: []
    },
    {
      id: 3,
      title: 'Our Comprehensive Services',
      uri: '/services',
      url: 'http://localhost:5173/services',
      target: null,
      cssClasses: []
    },
    {
      id: 4,
      title: 'About Our Company',
      uri: '/about',
      url: 'http://localhost:5173/about',
      target: null,
      cssClasses: []
    }
  ]
}} let:args>
  <div class="min-h-screen">
    <Header {...args} />
    <div class="pt-24 px-8">
      <h1 class="text-4xl font-bold mb-8">Long Menu Names</h1>
      <p>This tests the header with longer menu item names to see how they wrap or truncate.</p>
    </div>
  </div>
</Story>