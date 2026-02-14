export type Tag = {
  id: number
  name: string
}

export type Work = {
  id: number
  title: string
  year: string
  imageUrl: string
  tags?: number[]
}
