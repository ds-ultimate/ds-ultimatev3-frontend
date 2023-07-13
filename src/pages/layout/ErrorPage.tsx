
export default function ErrorPage({error}: {error: any}) {
  //TODO this page should act as a hub for: 404, 403, Maintenance Mode (world / global)
  console.log(error)

  return (
      <>
        Something went somewhere wrong :/<br />
        The error page is still under construction
      </>
  )
}
