<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FeaturedProject from '../../components/molecules/FeaturedProject.svelte';

  // Mock project data
  const createMockProject = (title, excerpt, clientNames = ['Sample Client'], services = ['Design', 'Strategy']) => ({
    title,
    excerpt,
    uri: '/portfolio/sample-project',
    slug: 'sample-project',
    featuredImage: {
      node: {
        altText: `${title} featured image`,
        colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
        dominantColor: '#FF6B6B',
        secondaryColor: '#4ECDC4',
        mediaDetails: {
          sizes: [
            {
              name: 'thumbnail',
              sourceUrl: 'https://picsum.photos/300/200',
              width: '300',
              height: '200'
            },
            {
              name: 'medium',
              sourceUrl: 'https://picsum.photos/900/600',
              width: '900',
              height: '600'
            },
            {
              name: 'large',
              sourceUrl: 'https://picsum.photos/1600/900',
              width: '1600',
              height: '900'
            }
          ]
        }
      }
    },
    nhtblClients: {
      nodes: clientNames.map(name => ({ name, slug: name.toLowerCase().replace(' ', '-') }))
    },
    nhtblServices: {
      nodes: services.map((name, index) => ({ 
        name, 
        slug: name.toLowerCase(), 
        parentId: index % 2 === 0 ? 1 : 2 // Mock parent ID for child services
      }))
    },
    projectData: {
      startDate: '2023-01-01',
      endDate: '2023-12-31'
    }
  });

  const { Story } = defineMeta({
    title: 'Molecules/FeaturedProject',
    component: FeaturedProject,
    tags: ['autodocs'],
    argTypes: {
      displayMode: {
        control: 'select',
        options: ['block', 'grid', 'masonryBlock']
      },
      enableSearch: {
        control: 'boolean'
      }
    },
    args: {
      project: createMockProject(
        'Sample Project Title',
        '<p>This is a sample project excerpt that describes what the project is about and its key features.</p>'
      ),
      displayMode: 'block',
      enableSearch: false
    }
  });
</script>

<Story name="Block Mode" />

<Story name="Grid Mode" args={{
  displayMode: 'grid'
}} />

<Story name="Masonry Block Mode" args={{
  displayMode: 'masonryBlock'
}} />

<Story name="With Search Enabled" args={{
  displayMode: 'block',
  enableSearch: true,
  onServiceClick: (serviceName) => console.log('Service clicked:', serviceName)
}} />

<Story name="Different Display Modes" args={{}} let:args>
  <div class="space-y-8">
    <div>
      <h3 class="text-lg font-semibold mb-4">Block Mode</h3>
      <FeaturedProject 
        project={createMockProject('Block Mode Project', '<p>Project shown in block display mode.</p>')}
        displayMode="block"
      />
    </div>
    
    <div>
      <h3 class="text-lg font-semibold mb-4">Grid Mode</h3>
      <FeaturedProject 
        project={createMockProject('Grid Mode Project', '<p>Project shown in grid display mode.</p>')}
        displayMode="grid"
      />
    </div>
    
    <div>
      <h3 class="text-lg font-semibold mb-4">Masonry Block Mode</h3>
      <div class="w-64">
        <FeaturedProject 
          project={createMockProject('Masonry Project', '<p>Project shown in masonry mode.</p>')}
          displayMode="masonryBlock"
        />
      </div>
    </div>
  </div>
</Story>

<Story name="Different Content" args={{}} let:args>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <FeaturedProject 
      project={createMockProject(
        'Short Title',
        '<p>Brief description.</p>',
        ['Client A'],
        ['Design']
      )}
      displayMode="block"
    />
    
    <FeaturedProject 
      project={createMockProject(
        'Very Long Project Title That Spans Multiple Lines',
        '<p>This is a much longer project description that contains more detailed information about the project scope, objectives, and outcomes. It demonstrates how the component handles longer content.</p>',
        ['Client A', 'Client B', 'Very Long Client Name Corp'],
        ['Strategy', 'Design', 'Development', 'Marketing', 'Research']
      )}
      displayMode="block"
    />
  </div>
</Story>

<Story name="Multiple Services and Clients" args={{
  project: createMockProject(
    'Complex Project',
    '<p>A project with multiple clients and services to test the display.</p>',
    ['Primary Client', 'Secondary Client', 'Third Client'],
    ['Strategy', 'Branding', 'Web Design', 'Development', 'Marketing', 'Research']
  ),
  displayMode: 'block',
  enableSearch: true
}} />