<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EnergyUsageWidget from '../../components/EnergyUsageWidget.svelte';

  const { Story } = defineMeta({
    title: 'Components/EnergyUsageWidget',
    component: EnergyUsageWidget,
    tags: ['autodocs'],
    argTypes: {
      compact: {
        control: 'boolean'
      }
    },
    args: {
      compact: false
    }
  });
</script>

<Story name="Default" />

<Story name="Compact" args={{ compact: true }} />

<Story name="Comparison" args={{}} let:args>
  <div class="space-y-4">
    <div>
      <h3 class="text-lg font-semibold mb-2">Default (Full Labels)</h3>
      <EnergyUsageWidget compact={false} />
    </div>
    <div>
      <h3 class="text-lg font-semibold mb-2">Compact (Short Labels)</h3>
      <EnergyUsageWidget compact={true} />
    </div>
  </div>
</Story>