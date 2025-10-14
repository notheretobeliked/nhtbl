<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Emphas from '../../components/Emphas.svelte';

  const { Story } = defineMeta({
    title: 'Components/Emphas',
    component: Emphas,
    tags: ['autodocs'],
    argTypes: {
      version: {
        control: 'select',
        options: ['line', 'bubble']
      },
      content: {
        control: 'text'
      },
      stroke: {
        control: 'color'
      }
    },
    args: {
      version: 'bubble',
      content: 'emphasized text',
      stroke: 'black'
    }
  });
</script>

<Story name="Bubble Version" />

<Story name="Line Version" args={{
  version: 'line',
  content: 'underlined text'
}} />

<Story name="Different Colors" args={{}} let:args>
  <div class="space-y-4">
    <div>
      <h3 class="text-lg font-semibold mb-2">Black Stroke</h3>
      <Emphas content="emphasized text" stroke="black" version="bubble" />
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-2">Green Stroke</h3>
      <Emphas content="emphasized text" stroke="nhtbl-green-base" version="bubble" />
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-2">Line Version</h3>
      <Emphas content="underlined text" stroke="black" version="line" />
    </div>
  </div>
</Story>

<Story name="Long Text" args={{
  content: 'This is a much longer piece of emphasized text to show how the bubble scales',
  version: 'bubble'
}} />