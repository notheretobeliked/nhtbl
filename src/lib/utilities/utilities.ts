interface HierarchicalOptions {
  idKey?: string
  parentKey?: string
  childrenKey?: string
}

export function flatListToHierarchical<T extends Record<string, any>>(
  data: T[] = [],
  { idKey = 'clientId', parentKey = 'parentId', childrenKey = 'children' }: HierarchicalOptions = {},
): T[] {
  const tree: T[] = []
  const childrenOf: Record<string, T[]> = {}

  data.forEach(item => {
    const newItem: T = { ...item }
    const id: string = newItem[idKey]
    const parentId: string = newItem[parentKey] || '0'

    childrenOf[id] = childrenOf[id] || []
    newItem[childrenKey] = childrenOf[id]

    if (parentId !== '0') {
      childrenOf[parentId] = childrenOf[parentId] || []
      childrenOf[parentId].push(newItem)
    } else {
      tree.push(newItem)
    }
  })

  return tree
}
