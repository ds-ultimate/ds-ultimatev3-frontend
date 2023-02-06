
const nf = new Intl.NumberFormat("de-DE")
function FormatNumber({n}: {n: number}) {
  return (
      <>
        {nf.format(n)}
      </>
  )
}

const DecodeName = ({name}: {name: string}) => {
  return (
      <>
        {decodeURIComponent(name).replaceAll("+", " ")}
      </>
  )
}

export {FormatNumber, DecodeName}
