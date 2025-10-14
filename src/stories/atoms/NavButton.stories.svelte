<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NavButton from '../../components/atoms/NavButton.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/NavButton',
    component: NavButton,
    tags: ['autodocs'],
    argTypes: {
      href: {
        control: 'text'
      },
      active: {
        control: 'boolean'
      },
      external: {
        control: 'boolean'
      }
    },
    args: {
      href: '/sample-link',
      active: false,
      external: false
    }
  });
</script>

<Story name="Default" args={{}} let:args>
  <NavButton {...args}>Navigation Link</NavButton>
</Story>

<Story name="Active" args={{ active: true }} let:args>
  <NavButton {...args}>Active Link</NavButton>
</Story>

<Story name="External Link" args={{ 
  href: 'https://example.com',
  external: true 
}} let:args>
  <NavButton {...args}>External Link</NavButton>
</Story>

<Story name="Internal Link" args={{ 
  href: '/portfolio',
  external: false 
}} let:args>
  <NavButton {...args}>Portfolio</NavButton>
</Story>

<Story name="Navigation States" args={{}} let:args>
  <div class="space-y-4">
    <div>
      <h3 class="text-sm font-semibold mb-2">Internal Navigation</h3>
      <div class="flex space-x-4">
        <NavButton href="/" active={true}>Home</NavButton>
        <NavButton href="/portfolio" active={false}>Portfolio</NavButton>
        <NavButton href="/about" active={false}>About</NavButton>
        <NavButton href="/contact" active={false}>Contact</NavButton>
      </div>
    </div>
    
    <div>
      <h3 class="text-sm font-semibold mb-2">External Links</h3>
      <div class="flex space-x-4">
        <NavButton href="https://twitter.com" external={true}>Twitter</NavButton>
        <NavButton href="https://github.com" external={true}>GitHub</NavButton>
      </div>
    </div>
  </div>
</Story>

<Story name="Long Text" args={{ href: '/very-long-navigation-item' }} let:args>
  <NavButton {...args}>Very Long Navigation Item Text</NavButton>
</Story>