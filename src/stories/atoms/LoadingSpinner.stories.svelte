<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import LoadingSpinner from '../../components/atoms/LoadingSpinner.svelte';

  const { Story } = defineMeta({
    title: 'Atoms/LoadingSpinner',
    component: LoadingSpinner,
    tags: ['autodocs'],
    argTypes: {
      size: {
        control: 'select',
        options: ['sm', 'md', 'lg', 'xl']
      },
      color: {
        control: 'select',
        options: ['default', 'white', 'green', 'gray']
      }
    },
    args: {
      size: 'md',
      color: 'default'
    }
  });
</script>

<Story name="Default" />

<Story name="Small" args={{ size: 'sm' }} />

<Story name="Large" args={{ size: 'lg' }} />

<Story name="Extra Large" args={{ size: 'xl' }} />

<Story name="White Color" args={{ 
  color: 'white'
}} />

<Story name="Green Color" args={{ 
  color: 'green'
}} />

<Story name="Different Sizes" args={{}} let:args>
  <div class="flex items-center space-x-6 p-4">
    <div class="text-center">
      <LoadingSpinner size="sm" />
      <p class="text-sm mt-2">Small</p>
    </div>
    <div class="text-center">
      <LoadingSpinner size="md" />
      <p class="text-sm mt-2">Medium</p>
    </div>
    <div class="text-center">
      <LoadingSpinner size="lg" />
      <p class="text-sm mt-2">Large</p>
    </div>
    <div class="text-center">
      <LoadingSpinner size="xl" />
      <p class="text-sm mt-2">Extra Large</p>
    </div>
  </div>
</Story>

<Story name="Different Colors" args={{}} let:args>
  <div class="space-y-4">
    <div class="flex items-center space-x-4">
      <LoadingSpinner color="default" />
      <span>Default</span>
    </div>
    <div class="flex items-center space-x-4 bg-gray-800 p-4 rounded">
      <LoadingSpinner color="white" />
      <span class="text-white">White (on dark background)</span>
    </div>
    <div class="flex items-center space-x-4">
      <LoadingSpinner color="green" />
      <span>Green</span>
    </div>
    <div class="flex items-center space-x-4">
      <LoadingSpinner color="gray" />
      <span>Gray</span>
    </div>
  </div>
</Story>