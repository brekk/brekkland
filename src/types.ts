export interface Project {
  data: {
    repo: string
    title: string
    description: string
    version: string
    isPublished: boolean
    hasBinary: boolean
    meta: {
      date: {
        published: Date | string
        updated: Date | string
      }
    }
    image?: string
    dependencies?: string[]
    related?: string[]
    tags?: string[]
  }
}
