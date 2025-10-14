<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PortfolioItem from '../../components/PortfolioItem.svelte';

  // Mock portfolio item data
  const createMockProject = (title, excerpt, clientNames = ['Sample Client'], services = ['Design']) => ({
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
              sourceUrl: 'https://picsum.photos/600/400',
              width: '600',
              height: '400'
            },
            {
              name: 'large',
              sourceUrl: 'https://picsum.photos/1200/800',
              width: '1200',
              height: '800'
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
        parentId: index % 2 === 0 ? 1 : 2
      }))
    },
    projectData: {
      startDate: '2023-01-01',
      endDate: '2023-12-31'
    }
  });

  const { Story } = defineMeta({
    title: 'Components/PortfolioItem',
    component: PortfolioItem,
    tags: ['autodocs'],
    argTypes: {
      project: {
        control: 'object'
      },
      displayMode: {
        control: 'select',
        options: ['grid', 'masonry', 'list']
      }
    },
    args: {
      project: createMockProject(
        'Sample Portfolio Project',
        '<p>This is a sample portfolio project that demonstrates the PortfolioItem component.</p>'
      ),
      displayMode: 'grid'
    }
  });
</script>

<Story name="Grid Display" />

<Story name="Masonry Display" args={{
  displayMode: 'masonry'
}} />

<Story name="List Display" args={{
  displayMode: 'list'
}} />

<Story name="With Multiple Clients" args={{
  project: createMockProject(
    'Multi-Client Project',
    '<p>A project that involves multiple clients working together.</p>',
    ['Primary Client', 'Secondary Client', 'Third Partner']
  )
}} />

<Story name="With Multiple Services" args={{
  project: createMockProject(
    'Full Service Project',
    '<p>A comprehensive project utilizing multiple service offerings.</p>',
    ['Enterprise Client'],
    ['Strategy', 'Branding', 'Web Design', 'Development', 'Marketing']
  )
}} />

<Story name="Short Title Project" args={{
  project: createMockProject(
    'Short',
    '<p>Brief project description.</p>',
    ['Client'],
    ['Design']
  )
}} />

<Story name="Long Title Project" args={{
  project: createMockProject(
    'Very Long Project Title That Demonstrates How the Component Handles Extended Text',
    '<p>This project has a very long title to test how the component handles text wrapping and layout with longer content. The description is also longer to show how multiple lines of text are displayed.</p>',
    ['Client with a Very Long Company Name Ltd.'],
    ['Strategy', 'Brand Identity', 'Web Development', 'Content Creation']
  )
}} />

<Story name="Different Display Modes" args={{}} let:args>
  <div class="space-y-8">
    <div>
      <h3 class="text-lg font-semibold mb-4">Grid Mode</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PortfolioItem 
          project={createMockProject('Grid Project 1', '<p>First project in grid layout.</p>')}
          displayMode="grid"
        />
        <PortfolioItem 
          project={createMockProject('Grid Project 2', '<p>Second project in grid layout.</p>')}
          displayMode="grid"
        />
        <PortfolioItem 
          project={createMockProject('Grid Project 3', '<p>Third project in grid layout.</p>')}
          displayMode="grid"
        />
      </div>
    </div>
    
    <div>
      <h3 class="text-lg font-semibold mb-4">List Mode</h3>
      <div class="space-y-4">
        <PortfolioItem 
          project={createMockProject('List Project 1', '<p>First project in list layout.</p>')}
          displayMode="list"
        />
        <PortfolioItem 
          project={createMockProject('List Project 2', '<p>Second project in list layout.</p>')}
          displayMode="list"
        />
      </div>
    </div>
    
    <div>
      <h3 class="text-lg font-semibold mb-4">Masonry Mode</h3>
      <div class="columns-1 md:columns-2 lg:columns-3 gap-6">
        <PortfolioItem 
          project={createMockProject('Masonry Project 1', '<p>First project in masonry layout.</p>')}
          displayMode="masonry"
        />
        <PortfolioItem 
          project={createMockProject('Masonry Project 2', '<p>Second project with longer description to show how masonry layout handles different content heights and wrapping behavior.</p>')}
          displayMode="masonry"
        />
        <PortfolioItem 
          project={createMockProject('Masonry Project 3', '<p>Third project.</p>')}
          displayMode="masonry"
        />
      </div>
    </div>
  </div>
</Story>

<Story name="Color Variations" args={{}} let:args>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <PortfolioItem 
      project={{
        ...createMockProject('Red Theme Project', '<p>Project with red color scheme.</p>'),
        featuredImage: {
          node: {
            ...createMockProject().featuredImage.node,
            dominantColor: '#E74C3C',
            secondaryColor: '#C0392B',
            colorPalette: ['#E74C3C', '#C0392B', '#A93226']
          }
        }
      }}
      displayMode="grid"
    />
    <PortfolioItem 
      project={{
        ...createMockProject('Blue Theme Project', '<p>Project with blue color scheme.</p>'),
        featuredImage: {
          node: {
            ...createMockProject().featuredImage.node,
            dominantColor: '#3498DB',
            secondaryColor: '#2980B9',
            colorPalette: ['#3498DB', '#2980B9', '#1F618D']
          }
        }
      }}
      displayMode="grid"
    />
  </div>
</Story>