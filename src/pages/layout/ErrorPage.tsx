
export default function ErrorPage({error}: {error: any}) {
  console.log(error)

  return (
      <>
        Something went somewhere wrong :/<br />
        The error page is still under construction
      </>
  )
}
