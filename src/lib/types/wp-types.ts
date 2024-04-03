export interface HomePageContentResponse {
  page: {
    id: string
    editorBlocks: EditorBlock[]
  }
}
export interface EditorBlock {
  name: string
  parentClientId: string | null
  clientId: string
  attributes: Attributes
  children?: EditorBlock[]
}

export interface Attributes {
  backgroundColor?: string
  content?: string
  fontFamily?: string | null
  fontSize?: string | null
  textColor?: string | null
  align?: "full" | "wide " | '' | null
  level?: number | null
}

export interface ACFHomePageHero extends EditorBlock {
  homePageHero: {
    images: {
      nodes: ImageObject[]
    }
  }
}

export interface ACFServicePush extends EditorBlock {
  servicePush: {
    service: {
      nodes: ServiceNode[]
    }
  }
}

export interface ACFPortfolioBlock extends EditorBlock {
  portfolioBlock: {
    portfolioItems: {
      nodes: PortfolioItemNode[]
    }
  }
}

export interface ServiceNode {
  slug: string
  id: string
  title: string
  uri: string
  featuredImage: FeaturedImage
}

export interface PortfolioItemNode {
  slug: string
  id: string
  uri: string
  imageGallery: {
    imageGallery: {
      nodes: ImageObject[]
    }
  }
  content: string
  featuredImage: FeaturedImage
}

export interface FeaturedImage {
  node: ImageObject
}

export type ImageSize = {
  name: string
  sourceUrl: string
  width: string
  height: string
}

export type MediaDetails = {
  sizes: ImageSize[]
}

export type ImageObject = {
  altText: string
  caption: null | string
  mediaDetails: MediaDetails
}

export interface ProjectsQueryResult {
  nhtblProjects: {
    nodes: PortfolioItemNode[] // Assuming PortfolioItemNode represents your project structure
  }
}
