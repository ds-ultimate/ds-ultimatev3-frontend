
const nf = new Intl.NumberFormat("de-DE")

const DecodeName = ({name}: {name: string}) => {
  return (
      <>
        {decodeURIComponent(name).replaceAll("+", " ")}
      </>
  )
}

export {nf, DecodeName}
