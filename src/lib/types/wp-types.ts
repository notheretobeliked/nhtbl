interface HomePageContentResponse {
  page: {
    id: string
    editorBlocks: EditorBlock[]
  }
}

type EditorBlock = CoreParagraph | AcfHomePageHero | AcfServicePush | CoreColumns | CoreColumn | AcfGalerie | AcfPortfolioBlock

// CoreParagraphFragment
interface CoreParagraph {
  anchor?: string
  apiVersion: string
  attributes: {
    fontSize?: string
    style?: string
    content: string
  }
}

// AcfHomePageHeroFragment
interface AcfHomePageHero {
  apiVersion: string
  blockEditorCategoryName: string
  attributes: {
    align?: string
    backgroundColor?: string
  }
  homePageHero: {
    images: {
      nodes: MediaDetails[]
    }
  }
  innerBlocks: (CoreParagraph | CoreHeading | AcfServicePush)[]
}

// CoreHeadingFragment
interface CoreHeading {
  anchor?: string
  apiVersion: string
  attributes: {
    content: string
    fontFamily?: string
    fontSize?: string
    textColor?: string
    textAlign?: string
  }
}

// AcfServicePushFragment
interface AcfServicePush {
  clientId: string
  name: string
  parentClientId?: string
  servicePush: {
    service: {
      nodes: Page[]
    }
  }
  innerBlocks: (CoreParagraph | CoreHeading)[]
}
interface ImageNode {
    altText: string
    mediaDetais: MediaDetails[]
}

interface Page {
  id: string
  title: string
  uri: string
  featuredImage?: {
    node: MediaDetails
  }
}

// CoreColumns and CoreColumn Fragments (considering them similar in structure for the example)
interface CoreColumns {
  innerBlocks: (CoreParagraph | CoreHeading)[]
  clientId: string
  parentClientId?: string
}

interface CoreColumn extends CoreColumns {
  anchor?: string
  apiVersion: string
}

// AcfGalerieFragment
interface AcfGalerie {
  attributes: {
    align?: string
  }
  galerie: {
    galerie: {
      nodes: {
        altText?: string
        caption?: string
        mediaDetails: MediaDetails
      }[]
    }
  }
  name: string
}

// AcfPortfolioBlockFragment
interface AcfPortfolioBlock {
  name: string
  portfolioBlock: {
    portfolioItems: {
      nodes: NhtblProject[]
    }
  }
}

interface NhtblProject {
  id: string
  uri: string
  imageGallery: {
    imageGallery: {
      nodes: MediaDetails[]
    }
  }
}

// MediaDetailsFragment and related structures
interface MediaDetails {
  sizes: {
    name?: string
    sourceUrl: string
    width: number
    height: number
  }[]
}
