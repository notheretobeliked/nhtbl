<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Modal from '../../components/Modal.svelte';

  const { Story } = defineMeta({
    title: 'Components/Modal',
    component: Modal,
    tags: ['autodocs'],
    argTypes: {
      isOpen: {
        control: 'boolean'
      },
      title: {
        control: 'text'
      },
      size: {
        control: 'select',
        options: ['sm', 'md', 'lg', 'xl', 'full']
      }
    },
    args: {
      isOpen: true,
      title: 'Sample Modal',
      size: 'md'
    }
  });
</script>

<Story name="Default" args={{}} let:args>
  <Modal {...args}>
    <p>This is the default modal content. It can contain any HTML or Svelte components.</p>
    <p class="mt-4">You can close the modal by clicking the X button or clicking outside the modal.</p>
  </Modal>
</Story>

<Story name="Small Modal" args={{ size: 'sm' }} let:args>
  <Modal {...args}>
    <p>This is a small modal with limited content.</p>
  </Modal>
</Story>

<Story name="Large Modal" args={{ size: 'lg' }} let:args>
  <Modal {...args}>
    <div class="space-y-4">
      <p>This is a large modal that can contain more extensive content.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
  </Modal>
</Story>

<Story name="Full Screen Modal" args={{ size: 'full' }} let:args>
  <Modal {...args}>
    <div class="space-y-6">
      <p>This is a full-screen modal that takes up the entire viewport.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold mb-2">Left Column</h3>
          <p>Content in the left column of the full-screen modal.</p>
        </div>
        <div>
          <h3 class="text-lg font-semibold mb-2">Right Column</h3>
          <p>Content in the right column of the full-screen modal.</p>
        </div>
      </div>
    </div>
  </Modal>
</Story>

<Story name="Without Title" args={{ title: null }} let:args>
  <Modal {...args}>
    <div class="text-center">
      <h2 class="text-2xl font-bold mb-4">Custom Title</h2>
      <p>This modal doesn't use the built-in title prop, but has a custom title instead.</p>
    </div>
  </Modal>
</Story>

<Story name="Form Modal" args={{ 
  title: 'Contact Form',
  size: 'lg'
}} let:args>
  <Modal {...args}>
    <form class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input type="text" id="name" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" id="email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea id="message" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
      </div>
      <div class="flex justify-end space-x-2">
        <button type="button" class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">Cancel</button>
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Send</button>
      </div>
    </form>
  </Modal>
</Story>

<Story name="Gallery Modal" args={{ 
  title: 'Image Gallery',
  size: 'xl'
}} let:args>
  <Modal {...args}>
    <div class="space-y-4">
      <div class="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
        <img src="https://picsum.photos/800/450" alt="Gallery item" class="max-w-full max-h-full object-contain" />
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Image 1 of 5</span>
        <div class="flex space-x-2">
          <button class="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Previous</button>
          <button class="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Next</button>
        </div>
      </div>
    </div>
  </Modal>
</Story>

<Story name="Closed Modal" args={{ 
  isOpen: false,
  title: 'This modal is closed'
}} let:args>
  <div>
    <p class="mb-4">The modal is currently closed. Click the button below to open it:</p>
    <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      Open Modal
    </button>
    <Modal {...args}>
      <p>This modal was opened programmatically!</p>
    </Modal>
  </div>
</Story>