<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from '../../components/atoms/Button.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
      label: {
        control: 'text'
      },
      url: {
        control: 'text'
      },
      textClass: {
        control: 'text'
      },
      colourClass: {
        control: 'text'
      },
      textColourClass: {
        control: 'text'
      },
      font: {
        control: 'select',
        options: ['sans', 'serif', 'display']
      }
    },
    args: {
      label: 'Click me',
      url: '#',
      textClass: 'text-base',
      colourClass: 'bg-nhtbl-green-base border-black border',
      textColourClass: 'text-black',
      font: 'sans'
    }
  });
</script>

<Story name="Default" />

<Story name="Primary" args={{
  label: 'Primary Button',
  textClass: 'text-lg font-medium',
  colourClass: 'bg-black border-black border',
  textColourClass: 'text-white',
  font: 'display'
}} />

<Story name="Secondary" args={{
  label: 'Secondary Button',
  colourClass: 'bg-transparent border-gray-400 border',
  textColourClass: 'text-gray-700'
}} />

<Story name="Large" args={{
  label: 'Large Button',
  textClass: 'text-xl font-bold',
  colourClass: 'bg-nhtbl-green-base border-black border-2',
  font: 'display'
}} />

<Story name="Small" args={{
  label: 'Small Button',
  textClass: 'text-sm',
  colourClass: 'bg-gray-100 border-gray-300 border',
  textColourClass: 'text-gray-600'
}} />