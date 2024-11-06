type Props = {
  params: {
    slug: string
  }
}

export default function Page({ params }: Props) {
  return (
    <div>
      <h1>Model: {params.slug}</h1>
    </div>
  )
}
